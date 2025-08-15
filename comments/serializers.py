from django.contrib.auth.models import User
from rest_framework import serializers
from .models import (Comment, CommentReply, ProductQuestion,
    ProductPurchase, PurchaseChat, StoreNotificationSubscription, Notification)
from inner.models import Product
from user.models import StoreKeeper
from cart.models import ProductPayment

class CommentReplySerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    comment = serializers.PrimaryKeyRelatedField(queryset=Comment.objects.all())
    updated_time = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)

    class Meta:
        model = CommentReply
        fields = ['id', 'comment', 'user', 'text', 'updated_time']

    def validate_text(self, value):
        if not value.strip():
            raise serializers.ValidationError("The response text cannot be empty.")
        return value

    def validate(self, data):
        user = data.get('user')
        comment = data.get('comment')

        if not user or not user.is_authenticated:
            raise serializers.ValidationError("You must be logged in to post a reply.")
        if not comment:
            raise serializers.ValidationError("The comment is not valid.")
        return data

    def create(self, validated_data):
        return CommentReply.objects.create(**validated_data)

    def update(self, instance, validated_data):
        user = validated_data.get('user')
        if user != instance.user:
            raise serializers.ValidationError("You cannot edit another user's reply.")

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    updated_time = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    replies = CommentReplySerializer(many=True, required=False, allow_null=True)

    class Meta:
        model = Comment
        fields = '__all__'

    def validate(self, data):
        user = data.get("user")
        product = data.get("product")

        if not user or not user.is_authenticated:
            raise serializers.ValidationError("You must be logged in to post a comment.")

        if not product:
            raise serializers.ValidationError("The product is invalid.")

        return data

    def validate_rating(self, value):
        user_id = self.initial_data.get("user")
        product_id = self.initial_data.get("product")

        if not user_id or not product_id:
            return value

        try:
            user_instance = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            raise serializers.ValidationError("The user is not valid.")

        has_commented = Comment.objects.filter(user=user_instance, product_id=product_id).exists()

        if self.instance:
            original_rating = self.instance.rating
            if original_rating is None and value is not None:
                raise serializers.ValidationError("You cannot rate a comment that has not already been rated.")
            return value

        if has_commented and value is not None:
            raise serializers.ValidationError(
                "You have already commented on this product and cannot rate it again.")
        if not has_commented and value is None:
            raise serializers.ValidationError("Rating is required for the first comment.")

        return value

    def create(self, validated_data):
        replies_data = validated_data.pop('replies', [])
        comment = super().create(validated_data)

        for reply_data in replies_data:
            CommentReply.objects.create(comment=comment, **reply_data)

        return comment

    def update(self, instance, validated_data):
        user = validated_data.get("user")
        if user != instance.user:
            raise serializers.ValidationError("You cannot edit another user's comment.")

        rating = validated_data.get("rating")
        if rating is not None and not (1 <= rating <= 5):
            raise serializers.ValidationError("The score must be a number between 1 and 5.")

        replies_data = validated_data.pop('replies', [])

        comment = super().update(instance, validated_data)

        for reply_data in replies_data:
            reply_id = reply_data.get('id')
            if reply_id:
                try:
                    reply_instance = CommentReply.objects.get(id=reply_id, comment=comment)
                    for attr, value in reply_data.items():
                        setattr(reply_instance, attr, value)
                    reply_instance.save()
                except CommentReply.DoesNotExist:
                    continue
            else:
                CommentReply.objects.create(comment=comment, **reply_data)

        return comment

class ProductQuestionSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    storekeeper = serializers.PrimaryKeyRelatedField(queryset=StoreKeeper.objects.all(), required=False, allow_null=True)
    updated_time = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)

    class Meta:
        model = ProductQuestion
        fields = ['id', 'product', 'user', 'question_text', 'answer_text', 'storekeeper', 'updated_time']

    def validate_question_text(self, value):
        if not value.strip():
            raise serializers.ValidationError("The question text cannot be empty.")
        return value

    def create(self, validated_data):
        product = validated_data.get('product')
        user = validated_data.get('user')

        if product.storekeeper.user == user:
            raise serializers.ValidationError("The seller cannot register a question for their own product.")

        return ProductQuestion.objects.create(**validated_data)

    def update(self, instance, validated_data):
        storekeeper = validated_data.get('storekeeper')
        product_storekeeper = instance.product.storekeeper

        if storekeeper != product_storekeeper:
            raise serializers.ValidationError("Only the product seller can answer the question.")

        answer = validated_data.get('answer_text')
        if answer is not None:
            instance.answer_text = answer.strip()
            instance.storekeeper = storekeeper

        instance.save()
        return instance

class ProductPurchaseSerializer(serializers.ModelSerializer):
    buyer = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    storekeeper = serializers.PrimaryKeyRelatedField(queryset=StoreKeeper.objects.all())
    payment = serializers.PrimaryKeyRelatedField(queryset=ProductPayment.objects.all())
    chat_enabled = serializers.BooleanField(read_only=True)

    class Meta:
        model = ProductPurchase
        fields = ['id', 'buyer', 'product', 'storekeeper', 'payment', 'chat_enabled']

    def validate(self, data):
        buyer = data.get('buyer')
        product = data.get('product')
        storekeeper = data.get('storekeeper')
        payment = data.get('payment')

        if buyer == storekeeper.user:
            raise serializers.ValidationError("The buyer cannot be the same as the seller.")

        if ProductPurchase.objects.filter(
            buyer=buyer,
            product=product,
            storekeeper=storekeeper
        ).exists():
            raise serializers.ValidationError("This purchase has already been registered.")

        if payment.cart.user != buyer:
            raise serializers.ValidationError("The selected payment does not belong to this buyer.")

        return data

    def create(self, validated_data):
        return ProductPurchase.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.buyer = validated_data.get('buyer', instance.buyer)
        instance.product = validated_data.get('product', instance.product)
        instance.storekeeper = validated_data.get('storekeeper', instance.storekeeper)
        instance.payment = validated_data.get('payment', instance.payment)
        instance.save()
        return instance

class PurchaseChatSerializer(serializers.ModelSerializer):
    purchase = serializers.PrimaryKeyRelatedField(queryset=ProductPurchase.objects.all())
    sender = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    sent_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    edited_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)

    class Meta:
        model = PurchaseChat
        fields = ['id', 'purchase', 'sender', 'message', 'sent_at', 'edited_at']

    def validate_message(self, value):
        if not value.strip():
            raise serializers.ValidationError("The message text cannot be empty.")
        return value

    def validate(self, data):
        purchase = data.get('purchase')
        sender = data.get('sender')

        if not purchase.chat_enabled:
            raise serializers.ValidationError("Chat has been disabled for this purchase.")

        if sender != purchase.buyer and sender != purchase.storekeeper.user:
            raise serializers.ValidationError("Only the buyer or seller can send messages.")

        return data

    def create(self, validated_data):
        return PurchaseChat.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.message = validated_data.get('message', instance.message).strip()
        instance.save()
        return instance

class StoreNotificationSubscriptionSerializer(serializers.ModelSerializer):
    storekeeper = serializers.PrimaryKeyRelatedField(queryset=StoreKeeper.objects.all())
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = StoreNotificationSubscription
        fields = ['id', 'user', 'storekeeper']

    def validate(self, attrs):
        user = attrs.get('user')
        storekeeper = attrs.get('storekeeper')

        if StoreNotificationSubscription.objects.filter(user=user, storekeeper=storekeeper).exists():
            raise serializers.ValidationError("You have already subscribed to this store.")

        return attrs

    def create(self, validated_data):
        return StoreNotificationSubscription.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.storekeeper = validated_data.get('storekeeper', instance.storekeeper)
        instance.user = validated_data.get('user', instance.user)
        instance.save()
        return instance

class NotificationSerializer(serializers.ModelSerializer):
    notification = serializers.PrimaryKeyRelatedField(read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'user', 'notification', 'message', 'storekeeper_id', 'product_id']
        read_only_fields = ['user', 'notification', 'message', 'storekeeper_id', 'product_id']