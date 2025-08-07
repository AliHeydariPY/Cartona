from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from user.models import StoreKeeper
from categories.models import ProductCategory

class Product(models.Model):
    name = models.TextField()
    price = models.DecimalField(max_digits=20, decimal_places=2, null=True)
    discounted_price = models.DecimalField(max_digits=20, decimal_places=2, blank=True, null=True)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    discount_period = models.DateTimeField(blank=True, null=True)
    stock_quantity = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(10000)],
        help_text="موجودی باید بین 0 تا 10000 باشد")
    image = models.ImageField(upload_to='products/%Y/%m/%d')
    description = models.TextField()
    amazing_offer = models.TextField(blank=True, null=True)
    amazing_offer_period = models.DateTimeField(blank=True, null=True)
    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)
    storekeeper = models.ForeignKey(StoreKeeper, on_delete=models.CASCADE)
    category = models.ForeignKey(ProductCategory, on_delete=models.CASCADE, related_name='products')

    def save(self, *args, **kwargs):
        if self.name:
            self.name = self.name.lstrip()
        if self.description:
            self.description = self.description.lstrip()
        if self.amazing_offer:
            self.amazing_offer = self.amazing_offer.lstrip()

        if self.stock_quantity == 0:
            self.price = None
            self.discounted_price = None
            self.discount_percentage = None
            self.discount_period = None
            self.amazing_offer = None
            self.amazing_offer_period = None
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Product"
        verbose_name_plural = "Products"
        db_table = "products"

class Images(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='Images/%Y/%m/%d')

    class Meta:
        verbose_name = "Image"
        verbose_name_plural = "Images"
        db_table = "Images"

class Types(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    type_name = models.TextField()

    def save(self, *args, **kwargs):
        if self.type_name:
            self.type_name = self.type_name.lstrip()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Type"
        verbose_name_plural = "Types"
        db_table = "Types"

class TypesValues(models.Model):
    type = models.ForeignKey(Types, on_delete=models.CASCADE, related_name="typesvalues_set")
    type_value = models.TextField()

    def save(self, *args, **kwargs):
        if self.type_value:
            self.type_value = self.type_value.lstrip()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "TypesValue"
        verbose_name_plural = "TypesValues"
        db_table = "TypesValues"

class Features(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    feature_name = models.TextField()
    feature_value = models.TextField()

    def save(self, *args, **kwargs):
        if self.feature_name:
            self.feature_name = self.feature_name.lstrip()
        if self.feature_value:
            self.feature_value = self.feature_value.lstrip()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Feature"
        verbose_name_plural = "Features"
        db_table = "Features"

class FrequentlyAskedQuestions(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='faqs')
    frequently_asked_question = models.TextField()
    frequently_asked_question_answer = models.TextField()

    def save(self, *args, **kwargs):
        if self.frequently_asked_question:
            self.frequently_asked_question = self.frequently_asked_question.lstrip()
        if self.frequently_asked_question_answer:
            self.frequently_asked_question_answer = self.frequently_asked_question_answer.lstrip()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "FrequentlyAskedQuestion"
        verbose_name_plural = "FrequentlyAskedQuestions"
        db_table = "FrequentlyAskedQuestions"