from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import ProductPayment, Payment, Cart, Favorite
from user.models import ProductDeliveryStatus

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
