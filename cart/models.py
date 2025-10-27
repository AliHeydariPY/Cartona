import random
from datetime import datetime, timedelta
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError
from django.utils import timezone
from inner.models import Product
from user.models import StoreKeeper

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
        verbose_name = "Cart_Item"
        verbose_name_plural = "Cart_Items"
        db_table = "Cart_Items"
        constraints = [
            models.UniqueConstraint(fields=['cart', 'product'], name='unique_product_per_cart')]

class Favorite(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='favorite'
    )
    class Meta:
        verbose_name = "Favorite"
        verbose_name_plural = "Favorites"
        db_table = "Favorites"

class FavoriteItem(models.Model):
    favorite = models.ForeignKey(
        Favorite,
        on_delete=models.CASCADE,
        related_name='items'
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='favorited_items'
    )
    class Meta:
        verbose_name = "Favorite Item"
        verbose_name_plural = "Favorite Items"
        db_table = "Favorite_Items"
        constraints = [
            models.UniqueConstraint(fields=['favorite', 'product'], name='unique_product_per_favorite')
        ]

def generate_fake_second_password():
    return str(random.randint(100000, 999999))

def generate_fake_cvv():
    return str(random.randint(100, 999))

def generate_fake_expiry():
    future_date = datetime.now() + timedelta(days=random.randint(365, 1460))
    return future_date.strftime("%m/%y")

def generate_fake_card_number():
    prefix = random.choice(["1234", "4321", "9876", "6789"])
    blocks = [str(random.randint(1000, 9999)) for _ in range(3)]
    return f"{prefix} {' '.join(blocks)}"

class ProductPayment(models.Model):
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name='product_payments',
        help_text="The basket to which this partial payment relates."
    )
    cart_item = models.ForeignKey(
        CartItem,
        on_delete=models.SET_NULL,
        related_name='product_payments',
        null=True,
        blank=True
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='product_payments'
    )
    storekeeper = models.ForeignKey(
        StoreKeeper,
        on_delete=models.CASCADE,
        related_name='product_payments',
        help_text="Storekeeper responsible for this product"
    )
    product_name = models.TextField(
        null=True,
        blank=True,
        help_text="Stores product name in case product is deleted after successful payment."
    )
    quantity = models.PositiveIntegerField(default=1, help_text="Paid quantity of the product")
    total_price = models.PositiveIntegerField(
        help_text="Quantity × Unit price of product",
        editable=False
    )
    fake_card_number = models.CharField(max_length=19, default=generate_fake_card_number)
    fake_card_second_password = models.CharField(max_length=8, default=generate_fake_second_password)
    fake_card_cvv = models.CharField(max_length=4, default=generate_fake_cvv)
    fake_card_expiry = models.CharField(max_length=5, default=generate_fake_expiry)
    paid_at = models.DateTimeField(default=timezone.now)
    address = models.TextField(help_text="Payer's address")
    is_successful = models.BooleanField(default=False)
    is_delivered = models.BooleanField(
        default=False,
        help_text="Has the product reached the buyer?"
    )
    delivered_at = models.DateTimeField(null=True, blank=True)
    buyer_hidden = models.BooleanField(default=False, help_text="Hidden from buyer")
    storekeeper_hidden = models.BooleanField(default=False, help_text="Hidden from storekeeper")

    def save(self, *args, **kwargs):
        if self.cart_item:
            self.product = self.cart_item.product
            self.quantity = self.cart_item.quantity
            self.total_price = self.cart_item.get_total_price()

        if self.product and not self.product_name:
            self.product_name = self.product.name

        if self.product and not self.storekeeper:
            self.storekeeper = self.product.storekeeper

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
        help_text="Final amount paid for the entire shopping cart",
        editable=False)
    product_payments = models.ManyToManyField(
        ProductPayment,
        related_name='main_payment',
        blank=True,
        help_text="List of partial payments related to this overall payment")
    fake_card_number = models.CharField(max_length=19, default=generate_fake_card_number)
    fake_card_second_password = models.CharField(max_length=8, default=generate_fake_second_password)
    fake_card_cvv = models.CharField(max_length=4, default=generate_fake_cvv)
    fake_card_expiry = models.CharField(max_length=5, default=generate_fake_expiry)
    paid_at = models.DateTimeField(default=timezone.now)
    address = models.TextField(help_text="Payer's address")
    is_successful = models.BooleanField(default=False)

    def process_product_payments(self):
        for cart_item in self.cart.items.select_related('product'):
            product = cart_item.product
            storekeeper = getattr(product, 'storekeeper', None)

            if not storekeeper:
                raise ValidationError(f"Storekeeper missing for product {getattr(product, 'pk', 'unknown')}")

            pp = ProductPayment.objects.create(
                cart_item=cart_item,
                cart=self.cart,
                product=product,
                storekeeper=storekeeper,
                quantity=cart_item.quantity,
                total_price=cart_item.get_total_price(),
                address=self.address,
                fake_card_number=self.fake_card_number,
                fake_card_second_password=self.fake_card_second_password,
                fake_card_cvv=self.fake_card_cvv,
                fake_card_expiry=self.fake_card_expiry,
                paid_at=self.paid_at,
                is_successful=self.is_successful
            )
            self.product_payments.add(pp)

        self.amount = sum(pp.total_price for pp in self.product_payments.all())

    def save(self, *args, **kwargs):
        if self.address:
            self.address = self.address.strip()

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
