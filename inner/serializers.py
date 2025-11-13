from rest_framework.exceptions import PermissionDenied
from rest_framework import serializers
from .models import Product, Images, Features, FrequentlyAskedQuestions, Category, CollectionModel
from comments.models import CommentReply
from user.models import StoreKeeper
from cart.models import ProductPayment, Payment

class ImageSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    image = serializers.ImageField(use_url=True, required=False, allow_null=True)

    class Meta:
        model = Images
        fields = ['id', 'product', 'image']

    def validate_image(self, image):
        if image is None:
            return image
        max_size = 5 * 1024 * 1024
        if image.size > max_size:
            raise serializers.ValidationError("The image size should not exceed 5 MB.")
        return image

    def validate(self, attrs):
        product = attrs.get('product')
        image = attrs.get('image')

        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None

        if product and user:
            if product.storekeeper.user != user:
                raise serializers.ValidationError({'product': 'You do not own this product.'})

        if self.instance is None and not image:
            raise serializers.ValidationError({'image': 'Image is required when creating a new entry.'})

        if product and self.instance is None:
            if Images.objects.filter(product=product).count() >= 7:
                raise serializers.ValidationError({'image': 'You cannot upload more than 7 images for this product.'})

        return attrs

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None

        product = validated_data.get('product')
        if not product or product.storekeeper.user != user:
            raise serializers.ValidationError("You cannot create an image for a product you don't own.")

        image = validated_data.get('image')
        if not image:
            raise serializers.ValidationError({'image': 'Image is required when creating a new entry.'})

        return Images.objects.create(**validated_data)

    def update(self, instance, validated_data):
        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None

        if instance.product.storekeeper.user != user:
            raise serializers.ValidationError("You cannot update an image for a product you don't own.")

        image = validated_data.get('image', instance.image)
        if image is None:
            image = instance.image

        instance.image = image
        instance.product = validated_data.get('product', instance.product)
        instance.save()
        return instance

    def to_representation(self, instance):
        rep = super().to_representation(instance)

        request = self.context.get('request')
        method = request.method if request else None

        if method in ['PUT', 'PATCH']:
            if not request.data.get('image'):
                rep['image'] = None
        elif not instance.image:
            rep['image'] = None

        return rep

class FeatureSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())

    class Meta:
        model = Features
        fields = ['id', 'product', 'feature_name', 'feature_value']

    def validate(self, attrs):
        product = attrs.get('product')
        request = self.context.get('request')
        user = request.user if request else None

        if product and user and user.is_authenticated:
            if product.storekeeper.user != user:
                raise serializers.ValidationError({'product': 'You do not own this product.'})

        return attrs

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request else None
        product = validated_data.get('product')

        if product.storekeeper.user != user:
            raise PermissionDenied("You do not have permission to add features to this product.")

        return Features.objects.create(**validated_data)

    def update(self, instance, validated_data):
        request = self.context.get('request')
        user = request.user if request else None
        product = instance.product

        if product.storekeeper.user != user:
            raise PermissionDenied("You do not have permission to update this feature.")

        instance.feature_name = validated_data.get('feature_name', instance.feature_name)
        instance.feature_value = validated_data.get('feature_value', instance.feature_value)
        instance.save()
        return instance

class FAQSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())

    class Meta:
        model = FrequentlyAskedQuestions
        fields = ['id', 'product', 'frequently_asked_question', 'frequently_asked_question_answer']

    def validate(self, attrs):
        product = attrs.get('product')
        request = self.context.get('request')
        user = request.user if request else None

        if product and user and user.is_authenticated:
            if product.storekeeper.user != user:
                raise serializers.ValidationError({'product': 'You do not own this product.'})

        return attrs

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request else None
        product = validated_data.get('product')

        if product.storekeeper.user != user:
            raise PermissionDenied("You do not have permission to add FAQs to this product.")

        return FrequentlyAskedQuestions.objects.create(**validated_data)

    def update(self, instance, validated_data):
        request = self.context.get('request')
        user = request.user if request else None
        product = instance.product

        if product.storekeeper.user != user:
            raise PermissionDenied("You do not have permission to update this FAQ.")

        instance.frequently_asked_question = validated_data.get(
            'frequently_asked_question', instance.frequently_asked_question
        )
        instance.frequently_asked_question_answer = validated_data.get(
            'frequently_asked_question_answer', instance.frequently_asked_question_answer
        )
        instance.save()
        return instance

class ProductSerializer(serializers.ModelSerializer):
    name = serializers.CharField()
    description = serializers.CharField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    discounted_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    discount_percentage = serializers.DecimalField(max_digits=5, decimal_places=2, required=False, allow_null=True)
    discount_period = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", required=False, allow_null=True)
    amazing_offer = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    amazing_offer_period = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", required=False, allow_null=True)
    stock_quantity = serializers.IntegerField()
    image = serializers.ImageField(use_url=True, required=False, allow_null=True)
    average_rating = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    storekeeper = serializers.PrimaryKeyRelatedField(read_only=True)
    collection = serializers.PrimaryKeyRelatedField(queryset=CollectionModel.objects.all(), required=False, allow_null=True)
    created_time = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    updated_time = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'discounted_price', 'discount_percentage',
            'discount_period', 'amazing_offer', 'amazing_offer_period', 'stock_quantity',
            'image', 'average_rating', 'comment_count', 'category',
            'storekeeper', 'collection', 'created_time', 'updated_time'
        ]

    def perform_delete(self, instance):
        affected_pps = ProductPayment.objects.filter(product=instance)
        affected_payments = set()

        for pp in affected_pps:
            if pp.is_successful:
                pp.product = None
                pp.save(update_fields=['product'])
            else:
                payment = Payment.objects.filter(product_payments=pp, is_successful=False).first()
                if payment:
                    affected_payments.add(payment.id)
                pp.delete()

        for payment_id in affected_payments:
            try:
                payment = Payment.objects.get(id=payment_id)
            except Payment.DoesNotExist:
                continue

            remaining_pps = payment.product_payments.all()

            if not remaining_pps.exists():
                payment.delete()
            else:
                payment.amount = sum(pp.total_price for pp in remaining_pps)
                if not remaining_pps.filter(is_successful=False).exists():
                    payment.is_successful = True
                    payment.save(update_fields=['amount', 'is_successful'])
                else:
                    payment.save(update_fields=['amount'])

        instance.delete()

    def validate_image(self, image):
        if image and hasattr(image, 'size') and image.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("The image size should not exceed 5 MB.")
        return image

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        request = self.context.get('request')
        method = request.method if request else None

        if method in ['PUT', 'PATCH']:
            if not request.data.get('image'):
                rep['image'] = None
        elif not instance.image:
            rep['image'] = None

        return rep

    def validate_stock_quantity(self, value):
        if value < 0 or value > 10000:
            raise serializers.ValidationError("The inventory value must be between 0 and 10,000.")
        return value

    def get_average_rating(self, obj):
        ratings = obj.comments.exclude(rating=None).values_list('rating', flat=True)
        if ratings:
            return round(sum(ratings) / len(ratings), 1)
        return None

    def get_comment_count(self, obj):
        comment_count = obj.comments.count()
        reply_count = CommentReply.objects.filter(comment__product=obj).count()
        return comment_count + reply_count

    def validate(self, data):
        price = data.get('price', getattr(self.instance, 'price', None))
        discounted_price = data.get('discounted_price')
        discount_percentage = data.get('discount_percentage')
        discount_period = data.get('discount_period')
        amazing_offer = data.get('amazing_offer')
        amazing_offer_period = data.get('amazing_offer_period')
        stock_quantity = data.get('stock_quantity', getattr(self.instance, 'stock_quantity', None))
        collection = data.get('collection')

        errors = {}

        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None
        if collection and collection.storekeeper.user != user:
            errors['collection'] = "You can only assign collections that belong to you."

        old_discounted_price = getattr(self.instance, 'discounted_price', None)
        old_discount_percentage = getattr(self.instance, 'discount_percentage', None)

        if discounted_price is not None and discount_percentage is not None:
            if self.instance:
                if discounted_price != old_discounted_price and discount_percentage == old_discount_percentage:
                    data['discount_percentage'] = round(100 * (1 - discounted_price / price), 2)
                elif discount_percentage != old_discount_percentage and discounted_price == old_discounted_price:
                    data['discounted_price'] = round(price * (1 - discount_percentage / 100), 2)
                else:
                    data['discounted_price'] = round(price * (1 - discount_percentage / 100), 2)
            else:
                errors['discount_conflict'] = "Only one of 'Discounted Price' or 'Discount Percentage' must be entered."

        elif discount_percentage is not None and discounted_price is None:
            data['discounted_price'] = round(price * (1 - discount_percentage / 100), 2)

        elif discounted_price is not None and discount_percentage is None:
            data['discount_percentage'] = round(100 * (1 - discounted_price / price), 2)

        if discount_period and not (data.get('discounted_price') or data.get('discount_percentage')):
            errors['discount_period'] = "To register a 'discount period', one of the discount fields must be specified."

        if amazing_offer_period and not amazing_offer:
            errors['amazing_offer_period'] = "The offer text must first be entered for its validity period."

        if stock_quantity == 0:
            for field in ['price', 'discounted_price', 'discount_percentage',
                          'discount_period', 'amazing_offer', 'amazing_offer_period']:
                if data.get(field) is not None:
                    errors[field] = "When the inventory is zero, no price or discount information should be entered."

        if errors:
            raise serializers.ValidationError(errors)

        return data

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None

        try:
            storekeeper = StoreKeeper.objects.get(user=user)
        except StoreKeeper.DoesNotExist:
            raise serializers.ValidationError("You are not registered as a storekeeper.")

        requested_storekeeper = validated_data.get('storekeeper')
        if requested_storekeeper and requested_storekeeper != storekeeper:
            raise serializers.ValidationError("You cannot assign another storekeeper's product.")

        collection = validated_data.get('collection')
        if collection and collection.storekeeper != storekeeper:
            raise serializers.ValidationError({'collection': "You can only assign collections that belong to you."})

        validated_data['storekeeper'] = storekeeper

        image = validated_data.get('image')
        if not image:
            raise serializers.ValidationError({'image': 'Product image is required when creating a product.'})

        return Product.objects.create(**validated_data)

    def update(self, instance, validated_data):
        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None

        if instance.storekeeper.user != user:
            raise serializers.ValidationError("You cannot update another storekeeper's product.")

        collection = validated_data.get('collection')
        if collection and collection.storekeeper.user != user:
            raise serializers.ValidationError({'collection': "You can only assign collections that belong to you."})

        image = validated_data.get('image', None)
        if image is None or isinstance(image, str):
            validated_data['image'] = instance.image

        new_price = validated_data.get('price', instance.price)
        new_discounted_price = validated_data.get('discounted_price', instance.discounted_price)
        old_price = instance.price

        if new_price != old_price and new_discounted_price is not None:
            try:
                validated_data['discount_percentage'] = round(100 * (1 - new_discounted_price / new_price), 2)
            except (ZeroDivisionError, TypeError):
                pass

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'parent']

class ProductSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name']

class CollectionModelSerializer(serializers.ModelSerializer):
    storekeeper = serializers.PrimaryKeyRelatedField(read_only=True)
    products = ProductSummarySerializer(many=True, read_only=True)

    class Meta:
        model = CollectionModel
        fields = ['id', 'collection_name', 'storekeeper', 'products']

    def create(self, validated_data):
        user = self.context['request'].user
        try:
            storekeeper = StoreKeeper.objects.get(user=user)
        except StoreKeeper.DoesNotExist:
            raise serializers.ValidationError("You are not registered as a storekeeper.")

        validated_data['storekeeper'] = storekeeper
        return super().create(validated_data)

    def update(self, instance, validated_data):
        user = self.context['request'].user
        if instance.storekeeper.user != user:
            raise serializers.ValidationError("You cannot edit another storekeeper's collection.")
        return super().update(instance, validated_data)

    def perform_delete(self, instance):
        user = self.context['request'].user
        if instance.storekeeper.user != user:
            raise serializers.ValidationError("You cannot delete another storekeeper's collection.")
        instance.delete()

