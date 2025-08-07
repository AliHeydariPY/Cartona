from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.conf import settings
from rest_framework.exceptions import ValidationError
from inner.models import Product
from user.models import StoreKeeper

class Comment(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="comments")
    text = models.TextField()
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        blank=True,
        null=True,
        help_text="Enter a rating between 1 and 5"
    )
    updated_time = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self.text:
            self.text = self.text.lstrip()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Comment"
        verbose_name_plural = "Comments"
        db_table = "Comments"

class CommentReply(models.Model):
    comment = models.ForeignKey(
        Comment,
        on_delete=models.CASCADE,
        related_name='replies',
        help_text="کامنتی که این پاسخ مربوط به آن است"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='comment_replies',
        help_text="کاربری که پاسخ داده"
    )
    text = models.TextField()
    updated_time = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self.text:
            self.text = self.text.lstrip()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Comment-Reply"
        verbose_name_plural = "Comment-Replies"
        db_table = "Comment-Replies"

class ProductQuestion(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='questions')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='product_questions')
    question_text = models.TextField()
    storekeeper = models.ForeignKey(StoreKeeper, on_delete=models.CASCADE, blank=True, null=True,
        related_name='answered_questions')
    answer_text = models.TextField(blank=True, null=True)
    updated_time = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self.question_text:
            self.question_text = self.question_text.strip()
        if self.answer_text:
            self.answer_text = self.answer_text.strip()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Product-Question"
        verbose_name_plural = "Product-Questions"
        db_table = "Product-Questions"

class ProductPurchase(models.Model):
    buyer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='purchases')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='purchases')
    storekeeper = models.ForeignKey(StoreKeeper, on_delete=models.CASCADE, related_name='sales')
    payment = models.OneToOneField('cart.ProductPayment', on_delete=models.CASCADE,
        related_name='purchase')
    chat_enabled = models.BooleanField(default=True, help_text="آیا امکان چت بین خریدار و فروشنده فعال است؟")

    class Meta:
        unique_together = ('buyer', 'product', 'storekeeper')
        verbose_name = "Product-Purchase"
        verbose_name_plural = "Product-Purchases"
        db_table = "Product-Purchases"

class PurchaseChat(models.Model):
    purchase = models.ForeignKey(ProductPurchase, on_delete=models.CASCADE, related_name='chats')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='purchase_messages')
    message = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)
    edited_at = models.DateTimeField(auto_now=True)

    def clean(self):
        # فقط خریدار یا فروشنده می‌تونن پیام بفرستن
        if self.sender != self.purchase.buyer and self.sender != self.purchase.storekeeper.user:
            raise ValidationError("فقط خریدار یا فروشنده می‌تواند پیام ارسال کند.")

    def save(self, *args, **kwargs):
        if self.message:
            self.message = self.message.strip()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Purchase-Chat"
        verbose_name_plural = "Purchase-Chats"
        db_table = "Purchase-Chats"