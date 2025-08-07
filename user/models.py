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
            self.store_name = self.store_name.lstrip()
        if self.description:
            self.description = self.description.lstrip()
        if self.address:
            self.address = self.address.lstrip()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "StoreKeeper"
        verbose_name_plural = "StoreKeepers"
        db_table = "StoreKeepers"

class Images(models.Model):
    storekeeper = models.ForeignKey(StoreKeeper, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='StoreImages/%Y/%m/%d')

    class Meta:
        verbose_name = "Image"
        verbose_name_plural = "Images"
        db_table = "StoreImages"

class Features(models.Model):
    storekeeper = models.ForeignKey(StoreKeeper, on_delete=models.CASCADE, related_name='features')
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
        db_table = "StoreFeatures"

class FrequentlyAskedQuestions(models.Model):
    storekeeper = models.ForeignKey(StoreKeeper, on_delete=models.CASCADE, related_name='faqs')
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
        db_table = "StoreFrequentlyAskedQuestions"

class ProductDeliveryStatus(models.Model):
    payment = models.OneToOneField(
        'cart.ProductPayment',
        on_delete=models.CASCADE,
        related_name='delivery_status',
        help_text="پرداختی که وضعیت ارسال آن ثبت شده"
    )
    is_sent = models.BooleanField(
        default=False,
        help_text="آیا محصول توسط فروشنده ارسال شده است؟"
    )
    sent_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="زمان ارسال محصول (در صورت وجود)"
    )
    note = models.TextField(
        blank=True,
        null=True,
        help_text="توضیحات اختیاری فروشنده درباره ارسال"
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
