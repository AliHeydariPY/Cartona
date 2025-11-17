import os
import random
from datetime import timedelta
from django.db.models.signals import pre_delete, pre_save, post_migrate
from django.dispatch import receiver
from django.utils import timezone
from django.conf import settings
from django.core.files import File
from django.contrib.auth import get_user_model
from .models import Product, Images, Category, CollectionModel, Features, FrequentlyAskedQuestions
from user.models import StoreKeeper

@receiver(pre_delete, sender=Product)
def delete_product_image(sender, instance, **kwargs):
    if instance.image and hasattr(instance.image, 'delete'):
        instance.image.delete(save=False)

@receiver(pre_delete, sender=Images)
def delete_images_image(sender, instance, **kwargs):
    if instance.image and hasattr(instance.image, 'delete'):
        instance.image.delete(save=False)

@receiver(pre_save, sender=Product)
def delete_old_product_image_on_change(sender, instance, **kwargs):
    if not instance.pk:
        return

    try:
        old_instance = sender.objects.get(pk=instance.pk)
    except sender.DoesNotExist:
        return

    old_image = getattr(old_instance, 'image', None)
    new_image = getattr(instance, 'image', None)

    if old_image and old_image != new_image:
        if hasattr(old_image, 'path') and os.path.isfile(old_image.path):
            try:
                old_image.delete(save=False)
            except Exception:
                pass

@receiver(pre_save, sender=Images)
def delete_old_images_image_on_change(sender, instance, **kwargs):
    if not instance.pk:
        return

    try:
        old_instance = sender.objects.get(pk=instance.pk)
    except sender.DoesNotExist:
        return

    old_image = getattr(old_instance, 'image', None)
    new_image = getattr(instance, 'image', None)

    if old_image and old_image != new_image:
        if hasattr(old_image, 'path') and os.path.isfile(old_image.path):
            try:
                old_image.delete(save=False)
            except Exception:
                pass

@receiver(pre_save, sender=Product)
def clear_expired_fields(sender, instance, **kwargs):
    now = timezone.now()

    if instance.discount_period and instance.discount_period < now:
        instance.discounted_price = None
        instance.discount_percentage = None
        instance.discount_period = None

    if instance.amazing_offer_period and instance.amazing_offer_period < now:
        instance.amazing_offer = None
        instance.amazing_offer_period = None


User = get_user_model()

def attach_image_to_product(product, product_name):
    image_path = os.path.join(settings.BASE_DIR, "default image", "product image", f"{product_name}.jpeg")
    if os.path.exists(image_path):
        with open(image_path, "rb") as f:
            product.image.save(os.path.basename(image_path), File(f), save=True)

def attach_additional_images(product):
    images_dir = os.path.join(settings.BASE_DIR, "default image", "product images")

    current_count = Images.objects.filter(product=product).count()
    if current_count >= 2:
        return

    target_filenames = [f"{product.name}{i}.jpeg" for i in range(1, 3)]

    existing_basenames = {
        os.path.basename(img.image.name)
        for img in Images.objects.filter(product=product).only("image")
        if getattr(img.image, "name", "")
    }

    for image_filename in target_filenames:
        if Images.objects.filter(product=product).count() >= 2:
            break

        image_path = os.path.join(images_dir, image_filename)
        if not os.path.exists(image_path):
            continue

        if image_filename in existing_basenames:
            continue

        with open(image_path, "rb") as f:
            Images.objects.create(
                product=product,
                image=File(f, name=image_filename)
            )

def seed_default_products():
    sk_map = {}
    for uname in ["Adel-Nouri", "Ali-Heydari"]:
        try:
            user = User.objects.get(username=uname)
            sk_map[uname] = StoreKeeper.objects.get(user=user)
        except (User.DoesNotExist, StoreKeeper.DoesNotExist):
            sk_map[uname] = None

    CAT_MONITORS = 68
    CAT_DIGITAL_ACCESSORIES = 15

    required_ids = [CAT_MONITORS, CAT_DIGITAL_ACCESSORIES]
    if Category.objects.filter(id__in=required_ids).count() < len(required_ids):
        return

    products_by_store = {
        "Adel-Nouri": [
            {"name": "white mouse", "description": "Wireless optical mouse in white, 1600 DPI, comfortable for daily use.", "price": 25.00, "category_id": CAT_DIGITAL_ACCESSORIES},
            {"name": "keyboard", "description": "Full-size mechanical keyboard with backlit keys and durable switches.", "price": 70.00, "category_id": CAT_DIGITAL_ACCESSORIES},
            {"name": "black mouse", "description": "Wired optical mouse in black, 1200 DPI, ergonomic design.", "price": 20.00, "category_id": CAT_DIGITAL_ACCESSORIES},
        ],
        "Ali-Heydari": [
            {"name": "blue speaker", "description": "Portable Bluetooth speaker in blue, 10W output, 12h battery life.", "price": 45.00, "category_id": CAT_DIGITAL_ACCESSORIES},
            {"name": "monitor", "description": "24-inch Full HD monitor, 75Hz refresh rate, IPS panel with slim bezels.", "price": 180.00, "category_id": CAT_MONITORS},
            {"name": "black speaker", "description": "Desktop black speaker pair, rich bass, 12W RMS for clear sound.", "price": 60.00, "category_id": CAT_DIGITAL_ACCESSORIES},
        ],
    }

    for uname, items in products_by_store.items():
        storekeeper = sk_map.get(uname)
        if not storekeeper:
            continue

        discount_items = random.sample(items, 2)
        amazing_item = random.choice(items)

        for item in items:
            price = item["price"]
            stock_quantity = random.randint(100, 999)

            discounted_price = None
            discount_percentage = None
            discount_period = None
            if item in discount_items:
                discounted_price = round(price * random.uniform(0.70, 0.90), 2)
                discount_percentage = round(100 * (1 - discounted_price / price), 2)
                discount_period = timezone.now() + timedelta(minutes=10)

            amazing_offer = None
            amazing_offer_period = None
            if item is amazing_item:
                amazing_offer = f"Limited-time deal on {item['name']} with special bonus!"
                amazing_offer_period = timezone.now() + timedelta(minutes=10)

            product = Product.objects.filter(
                name=item["name"],
                storekeeper=storekeeper
            ).first()

            if not product:
                product = Product.objects.create(
                    name=item["name"],
                    description=item["description"],
                    price=price,
                    discounted_price=discounted_price,
                    discount_percentage=discount_percentage,
                    discount_period=discount_period,
                    amazing_offer=amazing_offer,
                    amazing_offer_period=amazing_offer_period,
                    stock_quantity=stock_quantity,
                    category_id=item["category_id"],
                    storekeeper=storekeeper,
                    collection=None
                )

            attach_image_to_product(product, item["name"])
            attach_additional_images(product)

            if product.name == "white mouse":
                Features.objects.get_or_create(product=product, feature_name="Connectivity", feature_value="Wireless")
                Features.objects.get_or_create(product=product, feature_name="DPI", feature_value="1600 DPI")
                FrequentlyAskedQuestions.objects.get_or_create(
                    product=product,
                    frequently_asked_question="Is this mouse suitable for daily use?",
                    frequently_asked_question_answer="Yes, it is designed for comfortable daily use."
                )
            elif product.name == "black mouse":
                Features.objects.get_or_create(product=product, feature_name="Connectivity", feature_value="Wired")
                Features.objects.get_or_create(product=product, feature_name="DPI", feature_value="1200 DPI")
                FrequentlyAskedQuestions.objects.get_or_create(
                    product=product,
                    frequently_asked_question="Does this mouse have ergonomic design?",
                    frequently_asked_question_answer="Yes, it has an ergonomic design for long usage."
                )
            elif product.name == "keyboard":
                Features.objects.get_or_create(product=product, feature_name="Type", feature_value="Mechanical")
                Features.objects.get_or_create(product=product, feature_name="Backlight", feature_value="Yes")
                FrequentlyAskedQuestions.objects.get_or_create(
                    product=product,
                    frequently_asked_question="Are the keys durable?",
                    frequently_asked_question_answer="Yes, the mechanical switches are highly durable."
                )
            elif product.name == "blue speaker":
                Features.objects.get_or_create(product=product, feature_name="Connectivity", feature_value="Bluetooth")
                Features.objects.get_or_create(product=product, feature_name="Battery Life", feature_value="12 hours")
                FrequentlyAskedQuestions.objects.get_or_create(
                    product=product,
                    frequently_asked_question="Is it portable?",
                    frequently_asked_question_answer="Yes, it is lightweight and portable."
                )
            elif product.name == "black speaker":
                Features.objects.get_or_create(product=product, feature_name="Output Power", feature_value="12W RMS")
                Features.objects.get_or_create(product=product, feature_name="Bass", feature_value="Rich bass")
                FrequentlyAskedQuestions.objects.get_or_create(
                    product=product,
                    frequently_asked_question="Does it provide clear sound?",
                    frequently_asked_question_answer="Yes, it delivers clear sound with strong bass."
                )
            elif product.name == "monitor":
                Features.objects.get_or_create(product=product, feature_name="Screen Size", feature_value="24-inch")
                Features.objects.get_or_create(product=product, feature_name="Refresh Rate", feature_value="75Hz")
                FrequentlyAskedQuestions.objects.get_or_create(
                    product=product,
                    frequently_asked_question="Is this monitor suitable for office work?",
                    frequently_asked_question_answer="Yes, the IPS panel and slim bezels make it ideal for office use."
                )

@receiver(post_migrate)
def create_default_products(sender, **kwargs):
    if sender.name != "inner":
        return
    seed_default_products()


def seed_collections():
    mouse_products = Product.objects.filter(name__in=["white mouse", "black mouse"])
    if mouse_products.exists():
        storekeeper = mouse_products.first().storekeeper
        collection, created = CollectionModel.objects.get_or_create(
            collection_name="mouse color",
            storekeeper=storekeeper
        )
        collection.products.set(mouse_products)

    speaker_products = Product.objects.filter(name__in=["blue speaker", "black speaker"])
    if speaker_products.exists():
        storekeeper = speaker_products.first().storekeeper
        collection, created = CollectionModel.objects.get_or_create(
            collection_name="speaker color",
            storekeeper=storekeeper
        )
        collection.products.set(speaker_products)

@receiver(post_migrate)
def create_default_collections(sender, **kwargs):
    if sender.name != "inner":
        return
    seed_collections()

