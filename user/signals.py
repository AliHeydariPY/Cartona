import os
from django.db.models.signals import pre_delete, pre_save, post_save, post_migrate
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.core.files import File
from django.conf import settings
from .models import StoreKeeper, UserUUID

@receiver(pre_delete, sender=StoreKeeper)
def delete_storekeeper_image(sender, instance, **kwargs):
    if instance.image and hasattr(instance.image, 'delete'):
        instance.image.delete(save=False)

@receiver(pre_save, sender=StoreKeeper)
def delete_old_storekeeper_image_on_change(sender, instance, **kwargs):
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

User = get_user_model()

@receiver(post_save, sender=User)
def create_user_uuid(sender, instance, created, **kwargs):
    if created:
        UserUUID.objects.create(user=instance)


@receiver(post_migrate)
def create_default_storekeepers(sender, **kwargs):
    if sender.name == "user":
        default_users = [
            {
                "username": "Ali-Heydari",
                "password": "AliHeydari123",
                "store_name": "Ali Heydari Store",
                "image": os.path.join(settings.BASE_DIR, "default image", "storekeeper", "ubuntu.jpeg"),
            },
            {
                "username": "Adel-Nouri",
                "password": "AdelNouri123",
                "store_name": "Adel Nouri Store",
                "image": os.path.join(settings.BASE_DIR, "default image", "storekeeper", "Nouri.jpeg"),
            },
        ]

        for u in default_users:
            user, created = User.objects.get_or_create(username=u["username"])
            if created:
                user.set_password(u["password"])
                user.save()

            if not StoreKeeper.objects.filter(user=user).exists():
                storekeeper = StoreKeeper.objects.create(
                    user=user,
                    store_name=u["store_name"],
                    description=f"Digital store for {u['username']}",
                    address="Isfahan city"
                )

                if os.path.exists(u["image"]):
                    with open(u["image"], "rb") as f:
                        storekeeper.image.save(
                            os.path.basename(u["image"]),
                            File(f),
                            save=True
                        )

