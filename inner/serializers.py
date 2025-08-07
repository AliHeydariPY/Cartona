from rest_framework import serializers
from .models import Product, Images, Types, TypesValues, Features, FrequentlyAskedQuestions
from user.models import StoreKeeper
from categories.models import ProductCategory

class ImageSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    image = serializers.ImageField(use_url=True)

    class Meta:
        model = Images
        fields = ['id', 'product', 'image']

    def validate_image(self, image):
        max_size = 5 * 1024 * 1024
        if image.size > max_size:
            raise serializers.ValidationError("حجم تصویر نباید بیشتر از ۵ مگابایت باشد.")
        return image

    def create(self, validated_data):
        return Images.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.image = validated_data.get('image', instance.image)
        instance.product = validated_data.get('product', instance.product)
        instance.save()
        return instance

class TypesValueSerializer(serializers.ModelSerializer):
    type = serializers.PrimaryKeyRelatedField(queryset=Types.objects.all())

    class Meta:
        model = TypesValues
        fields = ['id', 'type', 'type_value']

    def create(self, validated_data):
        return TypesValues.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.type = validated_data.get('type', instance.type)
        instance.type_value = validated_data.get('type_value', instance.type_value)
        instance.save()
        return instance

class TypesSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    typesvalues_set = TypesValueSerializer(many=True)

    class Meta:
        model = Types
        fields = ['id', 'product', 'type_name', 'typesvalues_set']

    def create(self, validated_data):
        values_data = validated_data.pop('typesvalues_set', [])
        type_obj = Types.objects.create(**validated_data)

        for value in values_data:
            # هماهنگ با تغییر فیلد به type
            TypesValues.objects.create(type=type_obj, type_value=value['type_value'])

        return type_obj

    def update(self, instance, validated_data):
        values_data = validated_data.pop('typesvalues_set', [])

        # به‌روزرسانی خود مدل Types
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # حذف مقادیر قبلی و ایجاد مقادیر جدید مرتبط با instance به‌عنوان type
        instance.typesvalues_set.all().delete()
        for value in values_data:
            TypesValues.objects.create(type=instance, type_value=value['type_value'])

        return instance

class FeatureSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())

    class Meta:
        model = Features
        fields = ['id', 'product', 'feature_name', 'feature_value']

    def create(self, validated_data):
        return Features.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.feature_name = validated_data.get('feature_name', instance.feature_name)
        instance.feature_value = validated_data.get('feature_value', instance.feature_value)
        instance.save()
        return instance

class FAQSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())

    class Meta:
        model = FrequentlyAskedQuestions
        fields = ['id', 'product', 'frequently_asked_question', 'frequently_asked_question_answer']

    def create(self, validated_data):
        return FrequentlyAskedQuestions.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.frequently_asked_question = validated_data.get('frequently_asked_question', instance.frequently_asked_question)
        instance.frequently_asked_question_answer = validated_data.get('frequently_asked_question_answer', instance.frequently_asked_question_answer)
        instance.save()
        return instance

class ProductSerializer(serializers.ModelSerializer):
    images_set = ImageSerializer(many=True, required=False, allow_null=True)
    types_set = TypesSerializer(many=True, required=False, allow_null=True)
    features_set = FeatureSerializer(many=True, required=False, allow_null=True)
    faqs = FAQSerializer(many=True, required=False, allow_null=True)
    created_time = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    updated_time = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    image = serializers.ImageField(use_url=True)
    storekeeper = serializers.PrimaryKeyRelatedField(queryset=StoreKeeper.objects.all())
    category = serializers.PrimaryKeyRelatedField(queryset=ProductCategory.objects.all())
    average_rating = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    user_commented = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def validate_image(self, image):
        max_size = 5 * 1024 * 1024
        if image.size > max_size:
            raise serializers.ValidationError("حجم تصویر نباید بیشتر از ۵ مگابایت باشد.")
        return image

    def validate_stock_quantity(self, value):
        if value < 0 or value > 10000:
            raise serializers.ValidationError("مقدار موجودی باید بین ۰ تا ۱۰٬۰۰۰ باشد.")
        return value

    def get_average_rating(self, obj):
        ratings = obj.comments.exclude(rating=None).values_list('rating', flat=True)
        if ratings:
            return round(sum(ratings) / len(ratings), 1)
        return None

    def get_comment_count(self, obj):
        return obj.comments.count()

    def get_user_commented(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            return obj.comments.filter(user=user).exists()
        return False

    def validate(self, data):
        price = data.get('price')
        discounted_price = data.get('discounted_price')
        discount_percentage = data.get('discount_percentage')
        discount_period = data.get('discount_period')
        amazing_offer = data.get('amazing_offer')
        amazing_offer_period = data.get('amazing_offer_period')
        errors = {}

        if discounted_price and discount_percentage:
            errors['discount_conflict'] = "فقط یکی از 'قیمت تخفیف‌خورده' یا 'درصد تخفیف' باید وارد شود."

        if discount_period and not (discounted_price or discount_percentage):
            errors['discount_period'] = "برای ثبت 'دوره تخفیف' باید یکی از فیلدهای تخفیف مشخص شده باشد."

        if amazing_offer_period and not amazing_offer:
            errors['amazing_offer_period'] = "ابتدا باید متن پیشنهاد وارد شود تا مدت آن معتبر باشد."

        if price:
            if discount_percentage and not discounted_price:
                data['discounted_price'] = round(price * (1 - discount_percentage / 100), 2)
            elif discounted_price and not discount_percentage:
                data['discount_percentage'] = round(100 * (1 - discounted_price / price), 2)

        if errors:
            raise serializers.ValidationError(errors)

        if data.get('stock_quantity') == 0:
            for field in ['price', 'discounted_price', 'discount_percentage',
                          'discount_period', 'amazing_offer', 'amazing_offer_period']:
                if data.get(field) is not None:
                    errors[field] = "وقتی موجودی صفر است نباید اطلاعات قیمت یا تخفیف وارد شود."

        return data

    def create(self, validated_data):
        images_data = validated_data.pop('images_set', [])
        types_data = validated_data.pop('types_set', [])
        features_data = validated_data.pop('features_set', [])
        faq_data = validated_data.pop('faqs', [])

        product = Product.objects.create(**validated_data)

        for image in images_data:
            Images.objects.create(product=product, **image)

        for type_item in types_data:
            values_data = type_item.pop('typesvalues_set', [])
            type_obj = Types.objects.create(product=product, **type_item)
            for value in values_data:
                TypesValues.objects.create(product=type_obj, **value)

        for feature in features_data:
            Features.objects.create(product=product, **feature)

        for faq in faq_data:
            FrequentlyAskedQuestions.objects.create(product=product, **faq)

        return product

    def update(self, instance, validated_data):
        images_data = validated_data.pop('images_set', [])
        types_data = validated_data.pop('types_set', [])
        features_data = validated_data.pop('features_set', [])
        faq_data = validated_data.pop('faqs', [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        instance.images_set.all().delete()
        for image in images_data:
            Images.objects.create(product=instance, **image)

        instance.types_set.all().delete()
        for type_item in types_data:
            values_data = type_item.pop('typesvalues_set', [])
            type_obj = Types.objects.create(product=instance, **type_item)
            for value in values_data:
                TypesValues.objects.create(product=type_obj, **value)

        instance.features_set.all().delete()
        for feature in features_data:
            Features.objects.create(product=instance, **feature)

        instance.faqs.all().delete()
        for faq in faq_data:
            FrequentlyAskedQuestions.objects.create(product=instance, **faq)

        return instance

class ProductReadOnlySerializer(serializers.ModelSerializer):
    images_set = ImageSerializer(many=True, read_only=True)
    types_set = TypesSerializer(many=True, read_only=True)
    features_set = FeatureSerializer(many=True, read_only=True)
    faqs = FAQSerializer(many=True, read_only=True)
    created_time = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    updated_time = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    image = serializers.ImageField(use_url=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    user_commented = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_average_rating(self, obj):
        ratings = obj.comments.exclude(rating=None).values_list('rating', flat=True)
        if ratings:
            return round(sum(ratings) / len(ratings), 1)
        return None

    def get_comment_count(self, obj):
        return obj.comments.count()

    def get_user_commented(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.comments.filter(user=request.user).exists()
        return False
