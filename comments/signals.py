from django.db.models.signals import post_save
from django.dispatch import receiver
from cart.models import ProductPayment
from user.models import ProductDeliveryStatus

@receiver(post_save, sender=ProductPayment)
def check_chat_status_on_delivery(sender, instance, **kwargs):
    try:
        delivery_status = instance.delivery_status
        if instance.is_delivered and delivery_status.is_sent:
            purchase = getattr(instance, 'purchase', None)
            if purchase and purchase.chat_enabled:
                purchase.chat_enabled = False
                purchase.save(update_fields=['chat_enabled'])
    except ProductDeliveryStatus.DoesNotExist:
        pass


@receiver(post_save, sender=ProductDeliveryStatus)
def check_chat_status_on_seller_confirmation(sender, instance, **kwargs):
    payment = instance.payment
    if payment.is_delivered and instance.is_sent:
        purchase = getattr(payment, 'purchase', None)
        if purchase and purchase.chat_enabled:
            purchase.chat_enabled = False
            purchase.save(update_fields=['chat_enabled'])
