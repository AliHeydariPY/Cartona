from django.utils import timezone
from inner.models import Product

def clear_expired_product_fields():
    now = timezone.now()

    expired_discount = Product.objects.filter(discount_period__lt=now)
    expired_offer = Product.objects.filter(amazing_offer_period__lt=now)

    for product in (expired_discount | expired_offer).distinct():
        updated = False

        if product.discount_period and product.discount_period < now:
            product.discounted_price = None
            product.discount_percentage = None
            product.discount_period = None
            updated = True

        if product.amazing_offer_period and product.amazing_offer_period < now:
            product.amazing_offer = None
            product.amazing_offer_period = None
            updated = True

        if updated:
            product.save()
