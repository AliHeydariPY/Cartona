import re
from django.utils import timezone
from django.contrib.auth.models import User
from django.db.models import Avg
from django.contrib.auth.hashers import check_password
from rest_framework import serializers
from .models import StoreKeeper, Features, Images, FrequentlyAskedQuestions, ProductDeliveryStatus
from inner.models import Product
from comments.models import Comment
from cart.models import ProductPayment
from cart.models import Cart
from inner.serializers import ProductReadOnlySerializer

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    old_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'old_password']
        extra_kwargs = {
            'username': {
                'help_text': 'Required. 4 to 50 characters. Letters, digits and @/./+/-/_ only.',
                'max_length': 50,
            }
        }

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
        validated_data.pop('old_password', None)
        password = validated_data.get('password')
        if not password:
            raise serializers.ValidationError({'password': 'A password is required to create an account.'})
        self.validate_password(password)
        return User.objects.create_user(**validated_data)

    def update(self, instance, validated_data):
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

class StoreImageSerializer(serializers.ModelSerializer):
    storekeeper = serializers.PrimaryKeyRelatedField(queryset=StoreKeeper.objects.all())
    image = serializers.ImageField(use_url=True)

    class Meta:
        model = Images
        fields = ['id', 'storekeeper', 'image']

    def validate_image(self, image):
        if image.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("The image size should not exceed 5 MB.")
        return image

    def create(self, validated_data):
        return Images.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.image = validated_data.get('image', instance.image)
        instance.storekeeper = validated_data.get('storekeeper', instance.storekeeper)
        instance.save()
        return instance

class StoreFeatureSerializer(serializers.ModelSerializer):
    storekeeper = serializers.PrimaryKeyRelatedField(queryset=StoreKeeper.objects.all())

    class Meta:
        model = Features
        fields = ['id', 'storekeeper', 'feature_name', 'feature_value']

    def create(self, validated_data):
        return Features.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.feature_name = validated_data.get('feature_name', instance.feature_name)
        instance.feature_value = validated_data.get('feature_value', instance.feature_value)
        instance.storekeeper = validated_data.get('storekeeper', instance.storekeeper)
        instance.save()
        return instance

class StoreFAQSerializer(serializers.ModelSerializer):
    storekeeper = serializers.PrimaryKeyRelatedField(queryset=StoreKeeper.objects.all())

    class Meta:
        model = FrequentlyAskedQuestions
        fields = ['id', 'storekeeper', 'frequently_asked_question', 'frequently_asked_question_answer']

    def create(self, validated_data):
        return FrequentlyAskedQuestions.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.frequently_asked_question = validated_data.get('frequently_asked_question', instance.frequently_asked_question)
        instance.frequently_asked_question_answer = validated_data.get('frequently_asked_question_answer', instance.frequently_asked_question_answer)
        instance.storekeeper = validated_data.get('storekeeper', instance.storekeeper)
        instance.save()
        return instance

class StoreKeeperSerializer(serializers.ModelSerializer):
    images = StoreImageSerializer(many=True, required=False, allow_null=True)
    features = StoreFeatureSerializer(many=True, required=False, allow_null=True)
    faqs = StoreFAQSerializer(many=True, required=False, allow_null=True)
    image = serializers.ImageField(use_url=True)
    created_time = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = StoreKeeper
        fields = ['id', 'user', 'store_name', 'description', 'image', 'address', 'images', 'features', 'faqs', 'created_time', 'average_rating']

    def get_average_rating(self, obj):
        products = Product.objects.filter(storekeeper=obj)
        comments = Comment.objects.filter(product__in=products).exclude(rating=None)
        average = comments.aggregate(avg_rating=Avg('rating'))['avg_rating']
        return round(average, 1) if average else None

    def validate_image(self, image):
        if image.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("The size of the store image should not exceed 5 MB.")
        return image

    def validate_store_name(self, value):
        request = self.context.get('request')
        store_id = self.instance.id if self.instance else None
        if StoreKeeper.objects.filter(store_name=value).exclude(id=store_id).exists():
            raise serializers.ValidationError("The store name must be unique.")
        return value

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        features_data = validated_data.pop('features', [])
        faqs_data = validated_data.pop('faqs', [])

        store = StoreKeeper.objects.create(**validated_data)

        for img in images_data:
            Images.objects.create(storekeeper=store, **img)

        for feat in features_data:
            Features.objects.create(storekeeper=store, **feat)

        for faq in faqs_data:
            FrequentlyAskedQuestions.objects.create(storekeeper=store, **faq)

        return store

    def update(self, instance, validated_data):
        images_data = validated_data.pop('images', [])
        features_data = validated_data.pop('features', [])
        faqs_data = validated_data.pop('faqs', [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        instance.images.all().delete()
        for img in images_data:
            Images.objects.create(storekeeper=instance, **img)

        instance.features.all().delete()
        for feat in features_data:
            Features.objects.create(storekeeper=instance, **feat)

        instance.faqs.all().delete()
        for faq in faqs_data:
            FrequentlyAskedQuestions.objects.create(storekeeper=instance, **faq)

        return instance

class StoreKeeperReadOnlySerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    features = StoreFeatureSerializer(many=True, read_only=True)
    faqs = StoreFAQSerializer(many=True, read_only=True)
    images = StoreImageSerializer(many=True, read_only=True)
    products = ProductReadOnlySerializer(many=True, read_only=True)
    image = serializers.ImageField(use_url=True, read_only=True)
    created_time = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = StoreKeeper
        fields = [
            'id',
            'user',
            'store_name',
            'description',
            'address',
            'image',
            'created_time',
            'average_rating',
            'features',
            'faqs',
            'images',
            'products',
        ]

    def get_average_rating(self, obj):
        products = Product.objects.filter(storekeeper=obj)
        comments = Comment.objects.filter(product__in=products).exclude(rating=None)
        avg = comments.aggregate(avg_rating=Avg('rating'))['avg_rating']
        return round(avg, 1) if avg else None

class MinimalProductSerializer(serializers.ModelSerializer):
    storekeeper = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'storekeeper']

class MinimalCartSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Cart
        fields = ['user']

class DeliveryStatusSerializer(serializers.ModelSerializer):
    payment = serializers.PrimaryKeyRelatedField(queryset=ProductPayment.objects.all())
    sent_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", required=False)

    class Meta:
        model = ProductDeliveryStatus
        fields = ['id', 'payment', 'is_sent', 'sent_at', 'note']

    def validate(self, attrs):
        is_sent = attrs.get('is_sent')
        sent_at = attrs.get('sent_at')
        payment = attrs.get('payment')

        now = timezone.now()

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

class StoreRelatedPaymentSerializer(serializers.ModelSerializer):
    paid_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    product = MinimalProductSerializer(read_only=True)
    cart = MinimalCartSerializer(read_only=True)
    delivery_status = DeliveryStatusSerializer(read_only=True)

    class Meta:
        model = ProductPayment
        fields = [
            'id', 'product', 'quantity', 'total_price',
            'paid_at', 'is_successful', 'address', 'cart',
            'delivery_status'
        ]
