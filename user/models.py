from datetime import timezone
from django.db import models
from django.conf import settings

class StoreKeeper(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    store_name = models.CharField(max_length=300, unique=True)
    description = models.TextField()
    image = models.ImageField(upload_to='storekeepers/%Y/%m/%d')
    created_time = models.DateTimeField(auto_now_add=True)
    address = models.TextField()

    def save(self, *args, **kwargs):
        if self.store_name:
            self.store_name = self.store_name.strip()
        if self.description:
            self.description = self.description.strip()
        if self.address:
            self.address = self.address.strip()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Store_Keeper"
        verbose_name_plural = "Store_Keepers"
        db_table = "Store_Keepers"

class Images(models.Model):
    storekeeper = models.ForeignKey(StoreKeeper, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='StoreImages/%Y/%m/%d')

    class Meta:
        verbose_name = "Image"
        verbose_name_plural = "Images"
        db_table = "Store_Images"

class Features(models.Model):
    storekeeper = models.ForeignKey(StoreKeeper, on_delete=models.CASCADE, related_name='features')
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
        db_table = "Store_Features"

class FrequentlyAskedQuestions(models.Model):
    storekeeper = models.ForeignKey(StoreKeeper, on_delete=models.CASCADE, related_name='faqs')
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
        db_table = "Store_Frequently_Asked_Questions"

class ProductDeliveryStatus(models.Model):
    payment = models.OneToOneField(
        'cart.ProductPayment',
        on_delete=models.CASCADE,
        related_name='delivery_status',
        help_text="Payment with a registered sending status"
    )
    is_sent = models.BooleanField(
        default=False,
        help_text="Was the product shipped by the seller?"
    )
    sent_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Product delivery time (if applicable)"
    )
    note = models.TextField(
        blank=True,
        null=True,
        help_text="Optional seller description about shipping"
    )

    def save(self, *args, **kwargs):
        if self.is_sent and not self.sent_at:
            self.sent_at = timezone.now()
        if self.note:
            self.note = self.note.strip()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Product_Delivery_Status"
        verbose_name_plural = "Product_Delivery_Statuses"
        db_table = "product_delivery_status"
