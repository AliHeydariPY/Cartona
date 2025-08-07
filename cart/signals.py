from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import ProductPayment, Payment

@receiver(post_save, sender=ProductPayment)
def delete_cart_item_when_payment_successful(sender, instance, created, **kwargs):
    if instance.is_successful and instance.cart_item:
        cart_item = instance.cart_item
        cart = cart_item.cart  # ارتباط بین CartItem و Cart

        # پیدا کردن پرداخت مرتبط با این سبد
        payment = Payment.objects.filter(cart=cart).first()

        # اگر پرداختی وجود داشت و معتبر بود
        if payment:
            cart_item.delete()
"""
@receiver(post_save, sender=Payment)
def clear_cart_on_successful_payment(sender, instance, created, **kwargs):
    if created and instance.is_successful:
        # دسترسی به کاربر از طریق مسیر cart → user
        user = instance.cart.user
        CartItem.objects.filter(cart__user=user).delete()
        """
