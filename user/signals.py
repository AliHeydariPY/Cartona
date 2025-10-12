import os
from django.db.models.signals import pre_delete, pre_save, post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
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
