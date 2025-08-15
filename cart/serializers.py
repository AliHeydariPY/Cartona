from django.utils import timezone
from rest_framework import serializers
from .models import Cart, CartItem, Payment, ProductPayment
from inner.models import Product
from comments.models import ProductPurchase, PurchaseChat

class CartItemSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())

    class Meta:
        model = CartItem
        fields = '__all__'

    def validate(self, data):
        product = data.get("product")
        quantity = data.get("quantity")

        if quantity is None:
            raise serializers.ValidationError("The product quantity has not been entered.")

        if not (1 <= quantity <= 10):
            raise serializers.ValidationError("The product number must be between 1 and 10.")

        if product.stock_quantity == 0:
            raise serializers.ValidationError("This product is not available and cannot be added to the cart.")

        if quantity > product.stock_quantity:
            raise serializers.ValidationError(
                f"The maximum quantity that can be purchased for this product is {product.stock_quantity} numbers.")

        return data

    def create(self, validated_data):
        return super().create(validated_data)

    def update(self, instance, validated_data):
        quantity = validated_data.get("quantity", instance.quantity)

        if not (1 <= quantity <= 10):
            raise serializers.ValidationError("The product number must be between 1 and 10.")

        return super().update(instance, validated_data)

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id' ,'user', 'items', 'total_items']

    def get_total_items(self, obj):
        return sum(item.quantity for item in obj.items.all())

class ProductPaymentSerializer(serializers.ModelSerializer):
    paid_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', read_only=True)
    delivered_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', required=False)
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
        delivery_status = getattr(self.instance, 'delivery_status', None)

        now = timezone.now()

        if is_delivered and not delivered_at:
            raise serializers.ValidationError({'delivered_at': 'Delivery time must be specified.'})
        if not is_delivered and delivered_at:
            raise serializers.ValidationError({'delivered_at': 'Cannot set delivery time if not delivered.'})

        if is_delivered:
            if not delivery_status or not delivery_status.is_sent:
                raise serializers.ValidationError({'is_delivered': 'Seller has not confirmed shipment yet.'})

            if delivered_at < delivery_status.sent_at:
                raise serializers.ValidationError({'delivered_at': 'Delivery time cannot be before shipment time.'})
            if delivered_at > now:
                raise serializers.ValidationError({'delivered_at': 'Delivery time cannot be in the future.'})

        return attrs

    def create(self, validated_data):
        for field in self.SENSITIVE_FIELDS:
            validated_data.pop(field, None)

        cart_item = validated_data.get('cart_item')
        if not cart_item:
            raise serializers.ValidationError("The shopping cart item is not specified.")

        validated_data['product'] = cart_item.product
        validated_data['quantity'] = cart_item.quantity
        validated_data['total_price'] = cart_item.get_total_price()
        validated_data['cart'] = cart_item.cart
        validated_data['paid_at'] = timezone.now()

        pp = ProductPayment.objects.create(**validated_data)

        if pp.is_successful:
            buyer = pp.cart.user
            product = pp.product
            storekeeper = product.storekeeper

            purchase, created = ProductPurchase.objects.get_or_create(
                buyer=buyer,
                product=product,
                storekeeper=storekeeper,
                payment=pp
            )

            if not purchase.chat_enabled:
                purchase.chat_enabled = True
                purchase.save(update_fields=['chat_enabled'])

            PurchaseChat.objects.create(
                purchase=purchase,
                sender=buyer,
                message=f"💬 Chat opened for your purchase of '{product.name}'. You can now communicate with the seller."
            )

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

        if 'delivered_at' in validated_data:
            instance.delivered_at = validated_data['delivered_at']

        instance.save()

        if not was_successful and new_successful:
            product = instance.product
            if product and product.stock_quantity is not None:
                product.stock_quantity = max(product.stock_quantity - instance.quantity, 0)
                product.save()

            buyer = instance.cart.user
            storekeeper = product.storekeeper

            purchase, created = ProductPurchase.objects.get_or_create(
                buyer=buyer,
                product=product,
                storekeeper=storekeeper,
                payment=instance
            )

            if not purchase.chat_enabled:
                purchase.chat_enabled = True
                purchase.save(update_fields=['chat_enabled'])

            if not PurchaseChat.objects.filter(purchase=purchase).exists():
                PurchaseChat.objects.create(
                    purchase=purchase,
                    sender=buyer,
                    message=f"💬 Chat opened for your purchase of '{product.name}'. You can now communicate with the seller."
                )

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

        for field in self.SENSITIVE_FIELDS:
            validated_data.pop(field, None)

        payment = super().create(validated_data)
        is_successful = validated_data.get('is_successful', False)

        product_payments = []

        for item in cart.items.filter(cart=cart).select_related('product'):
            try:
                item = CartItem.objects.get(pk=item.pk)
            except CartItem.DoesNotExist:
                continue

            pp = ProductPayment.objects.filter(
                cart_item=item,
                cart=cart,
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
                if not pp.is_successful:
                    continue

                product = pp.product
                buyer = pp.cart.user
                storekeeper = product.storekeeper

                purchase, created = ProductPurchase.objects.get_or_create(
                    buyer=buyer,
                    product=product,
                    storekeeper=storekeeper,
                    payment=pp
                )

                if not purchase.chat_enabled:
                    purchase.chat_enabled = True
                    purchase.save(update_fields=['chat_enabled'])

                if not PurchaseChat.objects.filter(purchase=purchase).exists():
                    PurchaseChat.objects.create(
                        purchase=purchase,
                        sender=buyer,
                        message=f"💬 Chat opened for your purchase of '{product.name}'. You can now communicate with the seller."
                    )

        return payment

    def update(self, instance, validated_data):
        for field in self.SENSITIVE_FIELDS:
            validated_data.pop(field, None)

        was_successful = instance.is_successful
        new_successful = validated_data.get('is_successful', was_successful)

        instance.address = validated_data.get('address', instance.address)
        instance.is_successful = new_successful
        instance.save()

        if not was_successful and new_successful:
            for pp in instance.product_payments.all():
                product = pp.product
                if product and product.stock_quantity is not None:
                    product.stock_quantity = max(product.stock_quantity - pp.quantity, 0)
                    product.save()

                pp.is_successful = True
                pp.save(update_fields=['is_successful'])

                buyer = pp.cart.user
                storekeeper = product.storekeeper

                purchase, created = ProductPurchase.objects.get_or_create(
                    buyer=buyer,
                    product=product,
                    storekeeper=storekeeper,
                    payment=pp
                )

                if not purchase.chat_enabled:
                    purchase.chat_enabled = True
                    purchase.save(update_fields=['chat_enabled'])

                if not PurchaseChat.objects.filter(purchase=purchase).exists():
                    PurchaseChat.objects.create(
                        purchase=purchase,
                        sender=buyer,
                        message=f"💬 Chat opened for your purchase of '{product.name}'. You can now communicate with the seller."
                    )

        return instance
