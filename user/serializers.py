import re
from django.utils import timezone
from django.contrib.auth.models import User
from django.db.models import Avg
from django.contrib.auth.hashers import check_password
from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied, ValidationError
from .models import StoreKeeper, ProductDeliveryStatus
from inner.models import Product
from comments.models import Comment
from cart.models import ProductPayment

class UserSerializer(serializers.ModelSerializer):
    uuid = serializers.UUIDField(source='uuid_record.uuid', read_only=True)
    password = serializers.CharField(write_only=True, required=False)
    old_password = serializers.CharField(write_only=True, required=False)
    role = serializers.SerializerMethodField()
    storekeeper_id = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['uuid', 'username', 'password', 'old_password', 'role', 'storekeeper_id']
        extra_kwargs = {
            'username': {
                'help_text': 'Required. 4 to 50 characters. Letters, digits and @/./+/-/_ only.',
                'max_length': 50,
            }
        }

    def get_role(self, obj):
        return "storekeeper" if StoreKeeper.objects.filter(user=obj).exists() else "user"

    def get_storekeeper_id(self, obj):
        storekeeper = StoreKeeper.objects.filter(user=obj).first()
        return storekeeper.id if storekeeper else None

    def validate_username(self, value):
        if len(value) < 5:
            raise serializers.ValidationError("Username must be at least 5 characters long.")
        if len(value) > 50:
            raise serializers.ValidationError("Username must not exceed 50 characters.")
        return value

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("The password must be at least 8 characters long.")
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError("The password must contain at least one lowercase English letter.")
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("The password must contain at least one uppercase English letter.")
        if not re.search(r'\d', value):
            raise serializers.ValidationError("The password must contain at least one number.")
        if re.search(r'\s', value):
            raise serializers.ValidationError("The password should not contain spaces.")
        return value

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request else None

        if user and user.is_authenticated:
            raise PermissionDenied("You are already logged in and cannot create another account.")

        username = validated_data.get('username')
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError({'username': 'This username is already registered.'})

        validated_data.pop('old_password', None)
        password = validated_data.get('password')
        if not password:
            raise serializers.ValidationError({'password': 'A password is required to create an account.'})

        self.validate_password(password)
        return User.objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        request = self.context.get('request')
        user = request.user if request else None

        if instance != user:
            raise PermissionDenied("You cannot update another user's profile.")

        username = validated_data.get('username')
        if username:
            self.validate_username(username)
            instance.username = username

        new_password = validated_data.get('password')
        old_password = validated_data.pop('old_password', None)

        if new_password:
            self.validate_password(new_password)

            if not old_password:
                raise serializers.ValidationError({'old_password': 'To change the password, it is required to enter the previous password.'})
            if not check_password(old_password, instance.password):
                raise serializers.ValidationError({'old_password': 'The old password is incorrect.'})
            instance.set_password(new_password)

        instance.save()
        return instance

class StoreKeeperSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True, required=False, allow_null=True)
    created_time = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    average_rating = serializers.SerializerMethodField()
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = StoreKeeper
        fields = ['id', 'user', 'store_name', 'description', 'image', 'address', 'created_time', 'average_rating']

    def get_average_rating(self, obj):
        products = Product.objects.filter(storekeeper=obj)
        comments = Comment.objects.filter(product__in=products).exclude(rating=None)
        average = comments.aggregate(avg_rating=Avg('rating'))['avg_rating']
        return round(average, 1) if average else None

    def validate_image(self, image):
        if image and hasattr(image, 'size') and image.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("The size of the store image should not exceed 5 MB.")
        return image

    def validate_store_name(self, value):
        store_id = self.instance.id if self.instance else None
        if StoreKeeper.objects.filter(store_name=value).exclude(id=store_id).exists():
            raise serializers.ValidationError("The store name must be unique.")
        return value

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request else None

        if not user or not user.is_authenticated:
            raise PermissionDenied("You must be authenticated to create a store.")

        if 'user' in request.data and int(request.data['user']) != user.id:
            raise PermissionDenied("You cannot assign this store to another user.")

        if StoreKeeper.objects.filter(user=user).exists():
            raise ValidationError({"user": "This user already has a registered store."})

        image = validated_data.get('image')
        if not image:
            raise ValidationError({'image': 'Store image is required when creating a store.'})

        validated_data['user'] = user

        return super().create(validated_data)

    def update(self, instance, validated_data):
        request = self.context.get('request')
        user = request.user if request else None

        if instance.user != user:
            raise PermissionDenied("You cannot update another user's store.")

        image = validated_data.get('image', None)
        if image is None or isinstance(image, str):
            validated_data['image'] = instance.image

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        request = self.context.get('request')

        rep['user'] = instance.user.username if instance.user else None

        if request:
            method = request.method
            if method in ['PUT', 'PATCH'] and not request.data.get('image'):
                rep['image'] = None
            elif not instance.image:
                rep['image'] = None

        return rep

class DeliveryStatusSerializer(serializers.ModelSerializer):
    payment = serializers.PrimaryKeyRelatedField(
        queryset=ProductPayment.objects.filter(is_successful=True)
    )
    sent_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", required=True)
    is_sent = serializers.BooleanField(required=True)
    note = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = ProductDeliveryStatus
        fields = ['id', 'payment', 'is_sent', 'sent_at', 'note']

    def validate(self, attrs):
        request = self.context.get('request')
        user = getattr(request, 'user', None)

        payment = attrs.get('payment')
        is_sent = attrs.get('is_sent')
        sent_at = attrs.get('sent_at')
        now = timezone.now()

        if not user or not user.is_authenticated:
            raise serializers.ValidationError({'payment': 'Authentication required.'})

        if not hasattr(payment.product, 'storekeeper') or payment.product.storekeeper.user != user:
            raise serializers.ValidationError({'payment': 'You are not authorized to update delivery status for this payment.'})

        if is_sent and not sent_at:
            raise serializers.ValidationError({'sent_at': 'The delivery time must be specified.'})

        if not is_sent and sent_at:
            raise serializers.ValidationError({'sent_at': 'Cannot set delivery time if not sent.'})

        if self.instance is None:
            if ProductDeliveryStatus.objects.filter(payment=payment).exists():
                raise serializers.ValidationError({'payment': 'Delivery status for this payment already exists.'})

        if is_sent and sent_at:
            if sent_at < payment.paid_at:
                raise serializers.ValidationError({'sent_at': 'Delivery time cannot be before payment time.'})
            if sent_at > now:
                raise serializers.ValidationError({'sent_at': 'Delivery time cannot be in the future.'})

        return attrs

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request else None
        payment = validated_data.get('payment')

        if not payment or payment.product.storekeeper.user != user:
            raise PermissionDenied("You can only create delivery status for your own products.")

        return ProductDeliveryStatus.objects.create(**validated_data)

    def update(self, instance, validated_data):
        request = self.context.get('request')
        user = request.user if request else None

        if instance.payment.product.storekeeper.user != user:
            raise PermissionDenied("You can only update delivery status for your own products.")

        if 'payment' in validated_data and validated_data['payment'] != instance.payment:
            raise serializers.ValidationError({'payment': 'You cannot change the payment once set.'})

        if instance.is_sent:
            if 'is_sent' in validated_data and validated_data['is_sent'] != instance.is_sent:
                raise serializers.ValidationError(
                    {'is_sent': 'You cannot change the delivery status after it has been marked as sent.'})
            if 'sent_at' in validated_data and validated_data['sent_at'] != instance.sent_at:
                raise serializers.ValidationError(
                    {'sent_at': 'You cannot change the delivery time after it has been set.'})
            if 'note' in validated_data and validated_data['note'] != instance.note:
                raise serializers.ValidationError(
                    {'note': 'You cannot change the note after the delivery has been marked as sent.'})

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

class StoreRelatedPaymentSerializer(serializers.ModelSerializer):
    paid_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    product = serializers.PrimaryKeyRelatedField(read_only=True)
    product_name = serializers.CharField(read_only=True)
    buyer = serializers.CharField(source='cart.user.username', read_only=True)
    storekeeper = serializers.PrimaryKeyRelatedField(read_only=True)
    storekeeper_delivery = serializers.SerializerMethodField()
    storekeeper_delivered_at = serializers.DateTimeField(
        source='delivery_status.sent_at',
        format='%Y-%m-%d %H:%M:%S',
        read_only=True
    )
    buyer_delivery = serializers.SerializerMethodField()
    buyer_delivered_at = serializers.DateTimeField(
        source='delivered_at',
        format='%Y-%m-%d %H:%M:%S',
        read_only=True
    )

    class Meta:
        model = ProductPayment
        fields = [
            'id', 'product', 'product_name', 'quantity', 'total_price',
            'paid_at', 'address', 'buyer', 'storekeeper', 'storekeeper_delivery',
            'storekeeper_delivered_at', 'buyer_delivery', 'buyer_delivered_at'
        ]

    def get_storekeeper_delivery(self, obj):
        try:
            delivery = ProductDeliveryStatus.objects.get(payment=obj)
            return delivery.is_sent
        except ProductDeliveryStatus.DoesNotExist:
            return False

    def get_storekeeper_delivered_at(self, obj):
        try:
            delivery_status = ProductDeliveryStatus.objects.get(payment=obj)
            return delivery_status.sent_at
        except ProductDeliveryStatus.DoesNotExist:
            return None

    def get_buyer_delivery(self, obj):
        return bool(obj.is_delivered)

    def get_buyer_delivered_at(self, obj):
        return obj.delivered_at if obj.delivered_at else None

