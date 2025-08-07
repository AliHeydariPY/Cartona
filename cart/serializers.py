from django.utils import timezone
from rest_framework import serializers
from .models import Cart, CartItem, Payment, ProductPayment
from inner.models import Product

class CartItemSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())

    class Meta:
        model = CartItem
        fields = '__all__'

    def validate(self, data):
        product = data.get("product")
        quantity = data.get("quantity")

        if quantity is None:
            raise serializers.ValidationError("تعداد محصول وارد نشده است.")

        if not (1 <= quantity <= 10):
            raise serializers.ValidationError("تعداد محصول باید بین ۱ تا ۱۰ باشد.")

        if product.stock_quantity == 0:
            raise serializers.ValidationError("این محصول موجود نیست و نمی‌توان آن را به سبد خرید اضافه کرد.")

        if quantity > product.stock_quantity:
            raise serializers.ValidationError(
                f"حداکثر تعداد قابل خرید برای این محصول {product.stock_quantity} عدد است.")

        return data

    def create(self, validated_data):
        return super().create(validated_data)

    def update(self, instance, validated_data):
        quantity = validated_data.get("quantity", instance.quantity)

        if not (1 <= quantity <= 10):
            raise serializers.ValidationError("تعداد محصول باید بین ۱ تا ۱۰ باشد.")

        return super().update(instance, validated_data)

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['user', 'items', 'total_items']

    def get_total_items(self, obj):
        return sum(item.quantity for item in obj.items.all())

class ProductPaymentSerializer(serializers.ModelSerializer):
    paid_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', read_only=True)
    delivered_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', required=False)  # ← قابل اعتبارسنجی
    quantity = serializers.IntegerField(read_only=True)
    total_price = serializers.IntegerField(read_only=True)
    cart = serializers.PrimaryKeyRelatedField(read_only=True)
    product = serializers.PrimaryKeyRelatedField(read_only=True)
    is_delivered = serializers.BooleanField(required=False)

    class Meta:
        model = ProductPayment
        fields = '__all__'
        read_only_fields = [
            'product',
            'quantity',
            'total_price',
            'fake_card_number',
            'fake_card_second_password',
            'fake_card_cvv',
            'fake_card_expiry',
            'paid_at',
            'cart'
        ]

    SENSITIVE_FIELDS = [
        'fake_card_number',
        'fake_card_second_password',
        'fake_card_cvv',
        'fake_card_expiry',
        'product_payments'
    ]

    def validate(self, attrs):
        is_delivered = attrs.get('is_delivered')
        delivered_at = attrs.get('delivered_at')

        if is_delivered and not delivered_at:
            raise serializers.ValidationError({
                'delivered_at': 'اگر محصول تحویل داده شده است، زمان تحویل باید وارد شود.'
            })

        if not is_delivered and delivered_at:
            raise serializers.ValidationError({
                'delivered_at': 'اگر محصول هنوز تحویل داده نشده، نباید زمان تحویل وارد شود.'
            })

        return attrs

    def create(self, validated_data):
        for field in self.SENSITIVE_FIELDS:
            validated_data.pop(field, None)

        cart_item = validated_data.get('cart_item')
        if not cart_item:
            raise serializers.ValidationError("آیتم سبد خرید مشخص نشده است.")

        validated_data['product'] = cart_item.product
        validated_data['quantity'] = cart_item.quantity
        validated_data['total_price'] = cart_item.get_total_price()
        validated_data['cart'] = cart_item.cart
        validated_data['paid_at'] = timezone.now()

        pp = ProductPayment.objects.create(**validated_data)

        if pp.is_successful:
            product = pp.product
            if product and product.stock_quantity is not None:
                product.stock_quantity = max(product.stock_quantity - pp.quantity, 0)
                product.save()

        return pp

    def update(self, instance, validated_data):
        for field in self.SENSITIVE_FIELDS:
            validated_data.pop(field, None)

        was_successful = instance.is_successful
        new_successful = validated_data.get('is_successful', was_successful)
        new_delivered = validated_data.get('is_delivered', instance.is_delivered)

        instance.address = validated_data.get('address', instance.address)
        instance.is_successful = new_successful
        instance.is_delivered = new_delivered

        # اگر زمان تحویل در داده‌ها هست، ثبتش کن
        if 'delivered_at' in validated_data:
            instance.delivered_at = validated_data['delivered_at']

        instance.save()

        if not was_successful and new_successful:
            product = instance.product
            if product and product.stock_quantity is not None:
                product.stock_quantity = max(product.stock_quantity - instance.quantity, 0)
                product.save()

        return instance

class PaymentSerializer(serializers.ModelSerializer):
    paid_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', read_only=True)
    product_payments = ProductPaymentSerializer(many=True, read_only=True)

    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = [
            'amount',
            'fake_card_number',
            'fake_card_second_password',
            'fake_card_cvv',
            'fake_card_expiry',
            'paid_at',
            'product_payments'
        ]

    SENSITIVE_FIELDS = [
        'fake_card_number',
        'fake_card_second_password',
        'fake_card_cvv',
        'fake_card_expiry',
        'product_payments'
    ]

    def create(self, validated_data):
        cart = validated_data.get('cart')
        validated_data['amount'] = cart.get_total_price()

        # حذف فیلدهای حساس از ورودی
        for field in self.SENSITIVE_FIELDS:
            validated_data.pop(field, None)

        payment = super().create(validated_data)
        is_successful = validated_data.get('is_successful', False)

        product_payments = []

        for item in cart.items.filter(cart=cart).select_related('product'):
            try:
                item = CartItem.objects.get(pk=item.pk)  # دریافت قطعی از DB
            except CartItem.DoesNotExist:
                continue

            # بررسی وجود ProductPayment قبلی
            pp = ProductPayment.objects.filter(
                cart_item=item,
                cart = cart,
            ).first()

            if pp:
                pp.fake_card_number = payment.fake_card_number
                pp.fake_card_second_password = payment.fake_card_second_password
                pp.fake_card_cvv = payment.fake_card_cvv
                pp.fake_card_expiry = payment.fake_card_expiry
                pp.address = payment.address
                pp.paid_at = timezone.now()
                pp.is_successful = payment.is_successful
                pp.save()
            else:
                pp = ProductPayment.objects.create(
                    cart_item=item,
                    address=payment.address,
                    fake_card_number=payment.fake_card_number,
                    fake_card_second_password=payment.fake_card_second_password,
                    fake_card_cvv=payment.fake_card_cvv,
                    fake_card_expiry=payment.fake_card_expiry,
                    paid_at=timezone.now(),
                    is_successful=payment.is_successful
                )

            product_payments.append(pp)

        payment.product_payments.set(product_payments)

        payment.amount = sum(pp.total_price for pp in product_payments)
        payment.save(update_fields=['amount'])

        if payment.is_successful:
            ProductPayment.objects.filter(pk__in=[pp.pk for pp in product_payments]).update(is_successful=True)

            for pp in product_payments:
                product = pp.product
                if product and product.stock_quantity is not None:
                    product.stock_quantity = max(product.stock_quantity - pp.quantity, 0)
                    product.save()

        return payment

    def update(self, instance, validated_data):
        for field in self.SENSITIVE_FIELDS:
            validated_data.pop(field, None)

        # بررسی مقدار قبلی قبل از آپدیت
        was_successful = instance.is_successful
        new_successful = validated_data.get('is_successful', was_successful)

        instance.address = validated_data.get('address', instance.address)
        instance.is_successful = new_successful
        instance.save()

        # فقط وقتی از False به True تغییر کرده، کاهش موجودی محصول انجام شود
        if not was_successful and new_successful:
            for pp in instance.product_payments.all():
                product = pp.product
                if product and product.stock_quantity is not None:
                    product.stock_quantity = max(product.stock_quantity - pp.quantity, 0)
                    product.save()

                pp.is_successful = True
                pp.save(update_fields=['is_successful'])

        return instance
