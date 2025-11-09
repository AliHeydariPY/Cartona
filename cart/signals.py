from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import ProductPayment, Payment, Cart, Favorite
from inner.models import Product

@receiver(post_save, sender=ProductPayment)
def delete_cart_item_when_payment_successful(sender, instance, created, **kwargs):
    if instance.is_successful and instance.cart_item:
        cart_item = instance.cart_item
        cart = cart_item.cart

        payment = Payment.objects.filter(cart=cart).first()

        if payment:
            cart_item.delete()

User = get_user_model()

@receiver(post_save, sender=User)
def create_cart_for_new_user(sender, instance, created, **kwargs):
    if created:
        Cart.objects.get_or_create(user=instance)

@receiver(post_save, sender=User)
def create_favorite_for_new_user(sender, instance, created, **kwargs):
    if created:
        Favorite.objects.get_or_create(user=instance)

@receiver(post_save, sender=Product)
def update_product_payments_on_price_change(sender, instance, **kwargs):
    affected_payments = ProductPayment.objects.filter(
        product=instance,
        is_successful=False,
        cart_item__isnull=False
    ).select_related('cart_item')

    for pp in affected_payments:
        cart_item = pp.cart_item
        if not cart_item:
            continue

        discounted_price = instance.discounted_price
        unit_price = discounted_price if discounted_price is not None else instance.price
        new_total = float(unit_price) * cart_item.quantity

        if pp.total_price != new_total:
            pp.total_price = new_total
            pp.save(update_fields=['total_price'])

            for payment in pp.main_payment.all():
                if not payment.is_successful:
                    payment.amount = sum(p.total_price for p in payment.product_payments.all())
                    payment.save(update_fields=['amount'])

