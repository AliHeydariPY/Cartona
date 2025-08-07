from rest_framework import serializers
from .models import ProductCategory
from user.models import StoreKeeper
from inner.models import (
    Product,
    Images,
    Features,
    FrequentlyAskedQuestions,
    Types,
    TypesValues)

class ProductCategorySerializer(serializers.ModelSerializer):
    storekeeper = serializers.PrimaryKeyRelatedField(queryset=StoreKeeper.objects.all())
    image = serializers.ImageField(use_url=True)

    class Meta:
        model = ProductCategory
        fields = '__all__'

    def validate(self, data):
        storekeeper = data.get("storekeeper")

        if not storekeeper:
            raise serializers.ValidationError("فروشنده معتبر نیست.")

        if self.instance and storekeeper != self.instance.storekeeper:
            raise serializers.ValidationError("فقط فروشنده‌ای که این دسته را ساخته می‌تواند آن را ویرایش کند.")

        image = data.get("image")
        if image and hasattr(image, "size") and image.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("حجم تصویر نباید بیشتر از ۵ مگابایت باشد.")

        return data

    def validate_image(self, image):
        if image and hasattr(image, "size") and image.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("اندازه تصویر نباید بیش از ۵ مگابایت باشد.")
        return image

    def create(self, validated_data):
        return super().create(validated_data)

    def update(self, instance, validated_data):
        storekeeper = validated_data.get("storekeeper")
        if storekeeper != instance.storekeeper:
            raise serializers.ValidationError("شما اجازه ویرایش دسته‌بندی فروشنده دیگر را ندارید.")

        image = validated_data.get("image")
        if image and hasattr(image, "size") and image.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("اندازه تصویر نباید بیش از ۵ مگابایت باشد.")

        return super().update(instance, validated_data)

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Images
        fields = ['id', 'image']

class TypesValuesSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypesValues
        fields = ['id', 'type_value']

class TypeSerializer(serializers.ModelSerializer):
    typesvalues_set = TypesValuesSerializer(many=True, read_only=True)

    class Meta:
        model = Types
        fields = ['id', 'type_name', 'typesvalues_set']

class FeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Features
        fields = ['id', 'feature_name', 'feature_value']

class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FrequentlyAskedQuestions
        fields = ['id', 'frequently_asked_question', 'frequently_asked_question_answer']

class FullProductSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True, source='images_set')
    types = TypeSerializer(many=True, read_only=True)
    features = FeatureSerializer(many=True, read_only=True)
    faqs = FAQSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'price', 'discounted_price', 'discount_percentage', 'discount_period',
            'image', 'description', 'amazing_offer', 'amazing_offer_period',
            'created_time', 'updated_time', 'storekeeper', 'category',
            'images', 'types', 'features', 'faqs'
        ]

class ProductCategoryWithFullProductsSerializer(serializers.ModelSerializer):
    products = FullProductSerializer(many=True, read_only=True)

    class Meta:
        model = ProductCategory
        fields = ['id', 'storekeeper', 'title', 'description', 'image', 'products']