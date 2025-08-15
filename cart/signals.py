from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import ProductPayment, Payment

@receiver(post_save, sender=ProductPayment)
def delete_cart_item_when_payment_successful(sender, instance, created, **kwargs):
    if instance.is_successful and instance.cart_item:
        cart_item = instance.cart_item
        cart = cart_item.cart

        payment = Payment.objects.filter(cart=cart).first()

        if payment:
            cart_item.delete()
