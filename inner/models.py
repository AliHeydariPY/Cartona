from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from user.models import StoreKeeper

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='children')

    def save(self, *args, **kwargs):
        if self.name:
            self.name = self.name.strip()
        if self.description:
            self.description = self.description.strip()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "category"
        verbose_name_plural = "categories"
        db_table = "categories"

class CollectionModel(models.Model):
    collection_name = models.TextField()
    storekeeper = models.ForeignKey(StoreKeeper, on_delete=models.CASCADE, related_name='collections')

    def save(self, *args, **kwargs):
        if self.collection_name:
            self.collection_name = self.collection_name.strip()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Collection"
        verbose_name_plural = "Collections"
        db_table = "collections"

class Product(models.Model):
    name = models.TextField()
    price = models.DecimalField(max_digits=20, decimal_places=2, null=True)
    discounted_price = models.DecimalField(max_digits=20, decimal_places=2, blank=True, null=True)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    discount_period = models.DateTimeField(blank=True, null=True)
    stock_quantity = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(10000)],
        help_text="Inventory must be between 0 and 10,000.")
    image = models.ImageField(upload_to='products/%Y/%m/%d', null=True, blank=True)
    description = models.TextField()
    amazing_offer = models.TextField(blank=True, null=True)
    amazing_offer_period = models.DateTimeField(blank=True, null=True)
    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)
    storekeeper = models.ForeignKey(StoreKeeper, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    collection = models.ForeignKey(
        CollectionModel,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='products'
    )

    def save(self, *args, **kwargs):
        if self.name:
            self.name = self.name.strip()
        if self.description:
            self.description = self.description.strip()
        if self.amazing_offer:
            self.amazing_offer = self.amazing_offer.strip()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Product"
        verbose_name_plural = "Products"
        db_table = "products"

class Images(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='Images/%Y/%m/%d', null=True, blank=True)

    class Meta:
        verbose_name = "Image"
        verbose_name_plural = "Images"
        db_table = "Images"

class Features(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    feature_name = models.TextField()
    feature_value = models.TextField()

    def save(self, *args, **kwargs):
        if self.feature_name:
            self.feature_name = self.feature_name.strip()
        if self.feature_value:
            self.feature_value = self.feature_value.strip()
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
            self.frequently_asked_question = self.frequently_asked_question.strip()
        if self.frequently_asked_question_answer:
            self.frequently_asked_question_answer = self.frequently_asked_question_answer.strip()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Frequently_Asked_Question"
        verbose_name_plural = "Frequently_Asked_Questions"
        db_table = "Frequently_Asked_Questions"
