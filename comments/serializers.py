from django.utils import timezone
from rest_framework import serializers
from .models import (Comment, CommentReply, ProductQuestion,
    ProductPurchase, PurchaseChat, StoreNotificationSubscription, Notification)
from inner.models import Product
from user.models import StoreKeeper, ProductDeliveryStatus
from cart.models import ProductPayment

class CommentReplySerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    comment = serializers.PrimaryKeyRelatedField(queryset=Comment.objects.all())
    updated_time = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)

    class Meta:
        model = CommentReply
        fields = ['id', 'comment', 'user', 'text', 'updated_time']

    def get_user(self, obj):
        return obj.user.username if obj.user else None

    def validate_text(self, value):
        if not value.strip():
            raise serializers.ValidationError("The response text cannot be empty.")
        return value

    def validate(self, data):
        request = self.context.get('request')
        method = request.method if request else None

        if method in ['POST', 'PUT']:
            comment = data.get('comment')
            if not comment:
                raise serializers.ValidationError({"comment": "The comment is not valid."})

        return data

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None
        validated_data['user'] = user
        return CommentReply.objects.create(**validated_data)

    def update(self, instance, validated_data):
        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None

        if user != instance.user:
            raise serializers.ValidationError("You cannot edit another user's reply.")

        if 'comment' in validated_data and validated_data['comment'] != instance.comment:
            raise serializers.ValidationError({"comment": "You cannot change the comment of a reply."})

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    updated_time = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)

    class Meta:
        model = Comment
        fields = [
            "id", "user", "product", "text",
            "rating", "updated_time"
        ]

    def get_user(self, obj):
        return obj.user.username if obj.user else None

    def validate(self, data):
        request = self.context.get("request")
        user = request.user if request and request.user.is_authenticated else None
        product = data.get("product") or getattr(self.instance, "product", None)
        rating = data.get("rating", None)

        if not product:
            raise serializers.ValidationError({"product": "The product is invalid."})

        product_id = product.id if hasattr(product, "id") else product

        has_rated_comment = Comment.objects.filter(
            user=user,
            product_id=product_id,
            rating__isnull=False
        ).exists()

        if self.instance:
            if self.instance.product_id != int(product_id):
                raise serializers.ValidationError({"product": "You cannot change the product of a comment."})
            if self.instance.user != user:
                raise serializers.ValidationError("You cannot edit another user's comment.")
            if has_rated_comment and self.instance.rating is None and rating is not None:
                raise serializers.ValidationError({"rating": "You cannot rate a comment after the first one."})
            return data

        if has_rated_comment and rating is not None:
            raise serializers.ValidationError({
                "rating": "You have already rated this product. Only the first comment can have a rating."
            })
        if not has_rated_comment and rating is None:
            raise serializers.ValidationError({
                "rating": "Rating is required for your first comment on this product."
            })

        return data

    def validate_rating(self, value):
        if value is not None and not (1 <= value <= 5):
            raise serializers.ValidationError("The score must be a number between 1 and 5.")
        return value

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None
        validated_data['user'] = user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        request = self.context.get("request")
        user = request.user if request and request.user.is_authenticated else None

        if user != instance.user:
            raise serializers.ValidationError("You cannot edit another user's comment.")

        if 'product' in validated_data and validated_data['product'] != instance.product:
            raise serializers.ValidationError({"product": "You cannot change the product of a comment."})

        rating = validated_data.get("rating")
        if rating is not None and not (1 <= rating <= 5):
            raise serializers.ValidationError({"rating": "The score must be a number between 1 and 5."})

        return super().update(instance, validated_data)

class ProductQuestionSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    storekeeper = serializers.PrimaryKeyRelatedField(read_only=True)
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    updated_time = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)

    class Meta:
        model = ProductQuestion
        fields = [
            'id',
            'product',
            'user',
            'question_text',
            'answer_text',
            'storekeeper',
            'updated_time'
        ]

    def get_user(self, obj):
        return obj.user.username if obj.user else None

    def validate_question_text(self, value):
        if not value.strip():
            raise serializers.ValidationError("The question text cannot be empty.")
        return value

    def validate(self, data):
        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None
        product = data.get('product') or getattr(self.instance, 'product', None)

        if request.method == 'POST':
            if product and product.storekeeper.user == user:
                raise serializers.ValidationError("The seller cannot ask a question about their own product.")
            if 'answer_text' in data and data['answer_text'].strip():
                raise serializers.ValidationError("You cannot provide an answer when creating a question.")

        elif request.method in ['PUT', 'PATCH']:
            if self.instance:
                if 'product' in data and data['product'] != self.instance.product:
                    raise serializers.ValidationError({"product": "You cannot change the product of a question."})

                if user == self.instance.user:
                    if 'answer_text' in data:
                        raise serializers.ValidationError("You cannot answer your own question.")
                elif user == self.instance.product.storekeeper.user:
                    if 'question_text' in data:
                        raise serializers.ValidationError("You cannot modify the question text.")
                else:
                    raise serializers.ValidationError("You do not have permission to update this question.")

        question_text = data.get('question_text')
        if question_text and not question_text.strip():
            raise serializers.ValidationError("The question text cannot be empty.")

        if question_text and not (self.instance and self.instance.user) and not user:
            raise serializers.ValidationError("User must be set when providing a question.")

        answer_text = data.get('answer_text')
        if answer_text and not (self.instance and self.instance.storekeeper):
            if not (product and product.storekeeper):
                raise serializers.ValidationError("Storekeeper must be set when providing an answer.")

        return data

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None
        validated_data['user'] = user
        return ProductQuestion.objects.create(**validated_data)

    def update(self, instance, validated_data):
        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None

        if 'product' in validated_data and validated_data['product'] != instance.product:
            raise serializers.ValidationError("Product cannot be changed during update.")

        if user == instance.user:
            question = validated_data.get('question_text')
            if question is not None:
                instance.question_text = question.strip()

        elif user == instance.product.storekeeper.user:
            answer = validated_data.get('answer_text')
            if answer is not None:
                instance.answer_text = answer.strip()
                instance.storekeeper = instance.product.storekeeper

        else:
            raise serializers.ValidationError("You do not have permission to update this question.")

        instance.save()
        return instance

class ProductPurchaseSerializer(serializers.ModelSerializer):
    buyer = serializers.SerializerMethodField()
    product = serializers.PrimaryKeyRelatedField(read_only=True)
    product_name = serializers.CharField(read_only=True)
    storekeeper = serializers.PrimaryKeyRelatedField(read_only=True)
    payment = serializers.PrimaryKeyRelatedField(queryset=ProductPayment.objects.all())
    chat_enabled = serializers.BooleanField(read_only=True)
    storekeeper_delivery = serializers.SerializerMethodField()
    storekeeper_delivered_at = serializers.DateTimeField(
        source='payment.delivery_status.sent_at',
        format='%Y-%m-%d %H:%M:%S',
        read_only=True
    )
    buyer_delivery = serializers.SerializerMethodField()
    buyer_delivered_at = serializers.DateTimeField(
        source='payment.delivered_at',
        format='%Y-%m-%d %H:%M:%S',
        read_only=True
    )
    updated_time = serializers.DateTimeField(
        format='%Y-%m-%d %H:%M:%S',
        read_only=True
    )

    total_price = serializers.SerializerMethodField()

    class Meta:
        model = ProductPurchase
        fields = [
            'id', 'buyer', 'product', 'product_name', 'storekeeper', 'payment', 'chat_enabled',
            'storekeeper_delivery', 'storekeeper_delivered_at',
            'buyer_delivery', 'buyer_delivered_at', 'updated_time',
            'total_price'
        ]

    def get_updated_time(self, obj):
        if not obj.chat_enabled:
            return None
        last_message = PurchaseChat.objects.filter(purchase=obj).order_by('-sent_at').first()
        return last_message.sent_at if last_message else None

    def get_buyer(self, obj):
        return obj.buyer.username if obj.buyer else None

    def get_storekeeper_delivery(self, obj):
        try:
            delivery_status = ProductDeliveryStatus.objects.get(payment=obj.payment)
            return bool(delivery_status.is_sent)
        except ProductDeliveryStatus.DoesNotExist:
            return False

    def get_storekeeper_delivered_at(self, obj):
        try:
            delivery_status = ProductDeliveryStatus.objects.get(payment=obj.payment)
            return delivery_status.sent_at
        except ProductDeliveryStatus.DoesNotExist:
            return None

    def get_buyer_delivery(self, obj):
        return obj.payment.is_delivered

    def get_buyer_delivered_at(self, obj):
        return obj.payment.delivered_at

    def get_total_price(self, obj):
        return getattr(obj.payment, "total_price", None)

    def validate_deletion(self):
        if self.instance and self.instance.chat_enabled:
            raise serializers.ValidationError("You cannot delete this purchase while chat is enabled.")

    def validate(self, data):
        payment = data.get('payment')

        if not payment.is_successful:
            raise serializers.ValidationError("Only successful payments can be linked to a purchase.")

        buyer = payment.cart.user
        product = payment.product
        storekeeper = product.storekeeper

        if buyer == storekeeper.user:
            raise serializers.ValidationError("The buyer cannot be the same as the seller.")

        if ProductPurchase.objects.filter(
            buyer=buyer,
            product=product,
            storekeeper=storekeeper,
            payment=payment
        ).exists():
            raise serializers.ValidationError("This purchase has already been registered.")

        data['buyer'] = buyer
        data['product'] = product
        data['storekeeper'] = storekeeper

        return data

    def create(self, validated_data):
        return ProductPurchase.objects.create(**validated_data)

    def update(self, instance, validated_data):
        payment = validated_data.get('payment', instance.payment)

        buyer = payment.cart.user
        product = payment.product
        storekeeper = product.storekeeper

        instance.payment = payment
        instance.buyer = buyer
        instance.product = product
        instance.storekeeper = storekeeper
        instance.save()

        return instance

class PurchaseChatSerializer(serializers.ModelSerializer):
    purchase = serializers.PrimaryKeyRelatedField(queryset=ProductPurchase.objects.all())
    sender = serializers.SerializerMethodField()
    sent_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    edited_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)

    class Meta:
        model = PurchaseChat
        fields = ['id', 'purchase', 'sender', 'message', 'sent_at', 'edited_at']

    def get_sender(self, obj):
        return obj.sender.username if obj.sender else None

    def validate_message(self, value):
        if not value.strip():
            raise serializers.ValidationError("The message text cannot be empty.")
        return value

    def validate(self, data):
        request = self.context.get('request')
        user = request.user if request else None

        purchase = data.get('purchase') or getattr(self.instance, 'purchase', None)

        if not purchase:
            raise serializers.ValidationError("Purchase information is missing.")

        if not purchase.chat_enabled:
            raise serializers.ValidationError("Chat has been disabled for this purchase.")

        if user != purchase.buyer and user != purchase.storekeeper.user:
            raise serializers.ValidationError("Only the buyer or seller can send messages.")

        return data

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request else None
        validated_data['sender'] = user
        return PurchaseChat.objects.create(**validated_data)

    def update(self, instance, validated_data):
        request = self.context.get('request')
        user = request.user if request else None

        if user != instance.sender:
            raise serializers.ValidationError("You can only edit your own messages.")

        if 'purchase' in validated_data and validated_data['purchase'] != instance.purchase:
            raise serializers.ValidationError({"purchase": "You cannot change the purchase of a chat message."})

        instance.message = validated_data.get('message', instance.message).strip()
        instance.edited_at = timezone.now()
        instance.save(update_fields=['message', 'edited_at'])
        return instance

class StoreNotificationSubscriptionSerializer(serializers.ModelSerializer):
    storekeeper = serializers.PrimaryKeyRelatedField(queryset=StoreKeeper.objects.all())
    user = serializers.SerializerMethodField()

    class Meta:
        model = StoreNotificationSubscription
        fields = ['id', 'user', 'storekeeper']

    def get_user(self, obj):
        return obj.user.username if obj.user else None

    def validate(self, attrs):
        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None
        storekeeper = attrs.get('storekeeper')

        if StoreNotificationSubscription.objects.filter(user=user, storekeeper=storekeeper).exists():
            raise serializers.ValidationError("You have already subscribed to this store.")

        return attrs

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None
        validated_data['user'] = user
        return StoreNotificationSubscription.objects.create(**validated_data)

class NotificationSerializer(serializers.ModelSerializer):
    notification = serializers.PrimaryKeyRelatedField(read_only=True)
    user = serializers.SerializerMethodField()
    is_read = serializers.BooleanField(required=False)

    class Meta:
        model = Notification
        fields = [
            'id', 'user', 'notification', 'message',
            'storekeeper_id', 'product_id', 'is_read'
        ]
        read_only_fields = [
            'user', 'notification', 'message',
            'storekeeper_id', 'product_id'
        ]

    def get_user(self, obj):
        return obj.user.username if obj.user else None

    def update(self, instance, validated_data):
        request = self.context.get('request')
        user = request.user if request else None

        if user != instance.user:
            raise serializers.ValidationError("You do not have permission to update this notification.")

        instance.is_read = validated_data.get('is_read', instance.is_read)
        instance.save(update_fields=['is_read'])
        return instance

