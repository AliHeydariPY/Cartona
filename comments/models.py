from django.db import models
from django.contrib.auth.models import User
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
            self.text = self.text.strip()
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
        help_text="The comment this reply relates to."
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='comment_replies',
        help_text="The user who answered"
    )
    text = models.TextField()
    updated_time = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self.text:
            self.text = self.text.strip()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Comment_Reply"
        verbose_name_plural = "Comment_Replies"
        db_table = "Comment_Replies"

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
        verbose_name = "Product_Question"
        verbose_name_plural = "Product_Questions"
        db_table = "Product_Questions"

class ProductPurchase(models.Model):
    buyer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='purchases')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='purchases')
    storekeeper = models.ForeignKey(StoreKeeper, on_delete=models.CASCADE, related_name='sales')
    payment = models.OneToOneField('cart.ProductPayment', on_delete=models.CASCADE,
        related_name='purchase')
    chat_enabled = models.BooleanField(default=True, help_text="Is chat between buyer and seller enabled?")

    class Meta:
        unique_together = ('buyer', 'product', 'storekeeper')
        verbose_name = "Product_Purchase"
        verbose_name_plural = "Product_Purchases"
        db_table = "Product_Purchases"

class PurchaseChat(models.Model):
    purchase = models.ForeignKey(ProductPurchase, on_delete=models.CASCADE, related_name='chats')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='purchase_messages')
    message = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)
    edited_at = models.DateTimeField(auto_now=True)

    def clean(self):
        if self.sender != self.purchase.buyer and self.sender != self.purchase.storekeeper.user:
            raise ValidationError("Only the buyer or seller can send messages.")

    def save(self, *args, **kwargs):
        if self.message:
            self.message = self.message.strip()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Purchase_Chat"
        verbose_name_plural = "Purchase_Chats"
        db_table = "Purchase_Chats"

class StoreNotificationSubscription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='store_notifications')
    storekeeper = models.ForeignKey(StoreKeeper, on_delete=models.CASCADE, related_name='subscribers')

    class Meta:
        verbose_name = "Notification_Subscription"
        verbose_name_plural = "Notification_Subscriptions"
        db_table = "Notification_Subscriptions"
        unique_together = ('user', 'storekeeper')

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_notifications')
    notification = models.ForeignKey(StoreNotificationSubscription, on_delete=models.SET_NULL,
        blank=True, null=True, related_name='notifications')
    message = models.TextField()

    storekeeper = models.ForeignKey(
        StoreKeeper, on_delete=models.CASCADE, related_name='notifications')

    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name='notifications')

    class Meta:
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"
        db_table = "Notifications"
