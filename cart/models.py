import random
from datetime import datetime, timedelta
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from inner.models import Product

class Cart(models.Model):
    user = models.OneToOneField(
    settings.AUTH_USER_MODEL,
    on_delete=models.CASCADE,
    related_name='cart')

    class Meta:
        verbose_name = "Cart"
        verbose_name_plural = "Carts"
        db_table = "Carts"

    def get_total_price(self):
        return sum(item.get_total_price() for item in self.items.all())

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    quantity = models.IntegerField(
        default=1,
        validators=[MinValueValidator(1), MaxValueValidator(10)],
        help_text="Enter a quantity between 1 and 10"
    )

    def get_total_price(self):
        return self.product.price * self.quantity

    class Meta:
        verbose_name = "CartItem"
        verbose_name_plural = "CartItems"
        db_table = "CartItems"
        constraints = [
            models.UniqueConstraint(fields=['cart', 'product'], name='unique_product_per_cart')]

def generate_fake_second_password():
    return str(random.randint(100000, 999999))  # رمز دوم ۶ رقمی

def generate_fake_cvv():
    return str(random.randint(100, 999))  # CVV سه‌رقمی

def generate_fake_expiry():
    future_date = datetime.now() + timedelta(days=random.randint(365, 1460))  # بین 1 تا 4 سال آینده
    return future_date.strftime("%m/%y")

def generate_fake_card_number():
    prefix = random.choice(["1234", "4321", "9876", "6789"])
    blocks = [str(random.randint(1000, 9999)) for _ in range(3)]
    return f"{prefix} {' '.join(blocks)}"

class ProductPayment(models.Model):
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,  # حذف سبد باعث حذف پرداخت بشه
        related_name='product_payments',
        help_text="سبدی که این پرداخت جزئی مربوط به آن است"
    )
    cart_item = models.ForeignKey(
        CartItem,
        on_delete=models.SET_NULL,
        related_name='product_payments',
        null=True,
        blank=True)
    product = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='product_payments')
    quantity = models.PositiveIntegerField(default=1, help_text="تعداد پرداخت‌شده از محصول")
    total_price = models.PositiveIntegerField(
        help_text="تعداد × قیمت واحد محصول",
        editable=False)
    fake_card_number = models.CharField(max_length=19, default=generate_fake_card_number)
    fake_card_second_password = models.CharField(max_length=8, default=generate_fake_second_password)
    fake_card_cvv = models.CharField(max_length=4, default=generate_fake_cvv)
    fake_card_expiry = models.CharField(max_length=5, default=generate_fake_expiry)
    paid_at = models.DateTimeField(default=timezone.now)
    address = models.TextField(help_text="آدرس پرداخت‌کننده")
    is_successful = models.BooleanField(default=False)
    is_delivered = models.BooleanField(
        default=False,
        help_text="آیا محصول به دست خریدار رسیده است؟"
    )
    delivered_at = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.cart_item:
            self.product = self.cart_item.product
            self.quantity = self.cart_item.quantity
            self.total_price = self.cart_item.get_total_price()
        if self.address:
            self.address = self.address.strip()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "product_payment"
        verbose_name_plural = "product_payments"
        db_table = "product_payments"

class Payment(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='payments')
    amount = models.PositiveIntegerField(
        help_text="مبلغ نهایی پرداخت‌شده برای کل سبد خرید",
        editable=False)
    product_payments = models.ManyToManyField(
        ProductPayment,
        related_name='main_payment',
        blank=True,
        help_text="لیست پرداخت‌های جزئی مربوط به این پرداخت کلی")
    fake_card_number = models.CharField(max_length=19, default=generate_fake_card_number)
    fake_card_second_password = models.CharField(max_length=8, default=generate_fake_second_password)
    fake_card_cvv = models.CharField(max_length=4, default=generate_fake_cvv)
    fake_card_expiry = models.CharField(max_length=5, default=generate_fake_expiry)
    paid_at = models.DateTimeField(default=timezone.now)
    address = models.TextField(help_text="آدرس پرداخت‌کننده")
    is_successful = models.BooleanField(default=False)

    def process_product_payments(self):
        for cart_item in self.cart.items.all():
            pp = ProductPayment.objects.create(
                cart_item=cart_item,
                cart=self.cart,
                address=self.address,
                fake_card_number=self.fake_card_number,
                fake_card_second_password=self.fake_card_second_password,
                fake_card_cvv=self.fake_card_cvv,
                fake_card_expiry=self.fake_card_expiry,
            )
            self.product_payments.add(pp)
        self.amount = sum(pp.total_price for pp in self.product_payments.all())

    def save(self, *args, **kwargs):
        if self.address:
            self.address = self.address.lstrip()

        if not self.pk:
            super().save(*args, **kwargs)
            self.process_product_payments()
            Payment.objects.filter(pk=self.pk).update(amount=self.amount)
        else:
            super().save(*args, **kwargs)

    class Meta:
        verbose_name = "cart_payment"
        verbose_name_plural = "cart_payments"
        db_table = "cart_payments"
