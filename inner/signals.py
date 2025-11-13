import os
from django.db.models.signals import pre_delete, pre_save
from django.dispatch import receiver
from django.utils import timezone
from .models import Product, Images

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

