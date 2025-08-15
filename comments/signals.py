from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import PurchaseChat, StoreNotificationSubscription, Notification
from cart.models import ProductPayment
from user.models import ProductDeliveryStatus
from inner.models import Product

@receiver(post_save, sender=ProductPayment)
def check_chat_status_on_delivery(sender, instance, **kwargs):
    delivery_status = getattr(instance, 'delivery_status', None)
    purchase = getattr(instance, 'purchase', None)

    if purchase and purchase.chat_enabled and instance.is_delivered and delivery_status and delivery_status.is_sent:
        message = f"✅ The buyer has confirmed delivery on {instance.delivered_at.strftime('%Y-%m-%d %H:%M:%S')}."
        PurchaseChat.objects.create(
            purchase=purchase,
            sender=purchase.buyer,
            message=message
        )

        purchase.chat_enabled = False
        purchase.save(update_fields=['chat_enabled'])

@receiver(post_save, sender=ProductDeliveryStatus)
def check_chat_status_on_seller_confirmation(sender, instance, **kwargs):
    payment = instance.payment
    purchase = getattr(payment, 'purchase', None)

    if purchase and purchase.chat_enabled and instance.is_sent:
        message = f"📦 The seller has shipped your product on {instance.sent_at.strftime('%Y-%m-%d %H:%M:%S')}."
        if instance.note:
            message += f"\n📝 Note from seller: {instance.note}"

        PurchaseChat.objects.create(
            purchase=purchase,
            sender=purchase.storekeeper.user,
            message=message
        )

        if payment.is_delivered:
            purchase.chat_enabled = False
            purchase.save(update_fields=['chat_enabled'])

@receiver(post_save, sender=Product)
def notify_subscribers_on_new_product(sender, instance, created, **kwargs):
    if not created:
        return

    storekeeper = getattr(instance, 'storekeeper', None)
    if not storekeeper:
        return

    subscriptions = StoreNotificationSubscription.objects.filter(storekeeper=storekeeper)

    notifications = [
        Notification(
            user=sub.user,
            notification=sub,
            message=f"🛍️ New product '{instance.name}' added by {storekeeper.store_name}.",
            storekeeper_id=storekeeper.id,
            product_id=instance.id
        )
        for sub in subscriptions
    ]

    Notification.objects.bulk_create(notifications)
