from django.utils import timezone
from rest_framework import serializers
from .models import Cart, CartItem, Payment, ProductPayment, FavoriteItem, Favorite
from inner.models import Product
from user.models import ProductDeliveryStatus
from comments.models import ProductPurchase, PurchaseChat

class CartItemSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    cart = serializers.PrimaryKeyRelatedField(read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity', 'cart', 'total_price']

    def get_total_price(self, obj):
        product = obj.product
        quantity = obj.quantity

        if product and quantity:
            unit_price = product.discounted_price if product.discounted_price is not None else product.price
            return float(unit_price) * quantity

        return 0.0

    def validate(self, data):
        product = data.get("product") or getattr(self.instance, "product", None)
        quantity = data.get("quantity")

        if quantity is None:
            raise serializers.ValidationError("The product quantity has not been entered.")

        if not (1 <= quantity <= 10):
            raise serializers.ValidationError("The product number must be between 1 and 10.")

        if not product:
            raise serializers.ValidationError("Product is missing or invalid.")

        if product.stock_quantity == 0:
            raise serializers.ValidationError("This product is not available and cannot be added to the cart.")

        if quantity > product.stock_quantity:
            raise serializers.ValidationError(
                f"The maximum quantity that can be purchased for this product is {product.stock_quantity} numbers."
            )

        return data

    def create(self, validated_data):
        user = self.context['request'].user

        try:
            cart = Cart.objects.get(user=user)
        except Cart.DoesNotExist:
            raise serializers.ValidationError("Cart not found for this user.")

        validated_data['cart'] = cart
        product = validated_data['product']

        if CartItem.objects.filter(cart=cart, product=product).exists():
            raise serializers.ValidationError({
                "product": "This product is already in your cart."
            })

        return super().create(validated_data)

    def update(self, instance, validated_data):
        if ProductPayment.objects.filter(cart_item=instance).exists():
            raise serializers.ValidationError("This cart item has already been paid for and cannot be modified.")

        if 'product' in validated_data and validated_data['product'] != instance.product:
            raise serializers.ValidationError({"product": "You cannot change the product of a cart item."})

        quantity = validated_data.get("quantity", instance.quantity)

        if not (1 <= quantity <= 10):
            raise serializers.ValidationError("The product number must be between 1 and 10.")

        return super().update(instance, validated_data)

class CartSerializer(serializers.ModelSerializer):
    total_items = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'user', 'total_items', 'total_price']

    def get_user(self, obj):
        return obj.user.username if obj.user else None

    def get_total_items(self, obj):
        return sum(item.quantity for item in obj.items.all())

    def get_total_price(self, obj):
        total = 0
        for item in obj.items.all():
            product = item.product
            unit_price = product.discounted_price if product.discounted_price is not None else product.price
            total += float(unit_price) * item.quantity
        return total

class FavoriteItemSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    favorite = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = FavoriteItem
        fields = ['id', 'product', 'favorite']

    def validate(self, data):
        product = data.get("product")

        if product.stock_quantity == 0:
            raise serializers.ValidationError("This product is not available and cannot be added to favorites.")

        return data

    def create(self, validated_data):
        user = self.context['request'].user
        try:
            favorite = Favorite.objects.get(user=user)
        except Favorite.DoesNotExist:
            raise serializers.ValidationError("Favorite list not found for this user.")

        validated_data['favorite'] = favorite
        product = validated_data['product']

        if FavoriteItem.objects.filter(favorite=favorite, product=product).exists():
            raise serializers.ValidationError({
                "product": "This product is already in your favorites."
            })

        return super().create(validated_data)

class FavoriteSerializer(serializers.ModelSerializer):
    total_items = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()

    class Meta:
        model = Favorite
        fields = ['id', 'user', 'total_items']

    def get_user(self, obj):
        return obj.user.username if obj.user else None

    def get_total_items(self, obj):
        return obj.items.count()

class ProductPaymentSerializer(serializers.ModelSerializer):
    paid_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', read_only=True)
    is_delivered = serializers.BooleanField(required=False)
    delivered_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', required=False)
    quantity = serializers.IntegerField(read_only=True)
    total_price = serializers.IntegerField(read_only=True)
    cart = serializers.PrimaryKeyRelatedField(read_only=True)
    product = serializers.PrimaryKeyRelatedField(read_only=True)
    product_name = serializers.CharField(read_only=True)
    storekeeper = serializers.PrimaryKeyRelatedField(read_only=True)
    storekeeper_delivery = serializers.SerializerMethodField()
    storekeeper_delivered_at = serializers.DateTimeField(
        source='delivery_status.sent_at',
        format='%Y-%m-%d %H:%M:%S',
        read_only=True
    )
    cart_item = serializers.PrimaryKeyRelatedField(
        queryset=CartItem.objects.all(),
        required=True
    )

    class Meta:
        model = ProductPayment
        fields = [
            'id',
            'paid_at',
            'is_delivered',
            'delivered_at',
            'quantity',
            'total_price',
            'cart',
            'product',
            'product_name',
            'storekeeper',
            'storekeeper_delivery',
            'storekeeper_delivered_at',
            'cart_item',
            'fake_card_number',
            'fake_card_second_password',
            'fake_card_cvv',
            'fake_card_expiry',
            'address',
            'is_successful',
        ]
        read_only_fields = [
            'product',
            'product_name',
            'quantity',
            'total_price',
            'fake_card_number',
            'fake_card_second_password',
            'fake_card_cvv',
            'fake_card_expiry',
            'paid_at',
            'cart',
            'storekeeper',
            'storekeeper_delivery',
            'storekeeper_delivered_at',
        ]

    SENSITIVE_FIELDS = [
        'fake_card_number',
        'fake_card_second_password',
        'fake_card_cvv',
        'fake_card_expiry',
        'product_payments'
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

    def perform_delete(self, instance):
        payments = instance.main_payment.all()

        for payment in payments:
            if payment.is_successful:
                continue

            remaining = payment.product_payments.exclude(id=instance.id)

            if remaining.exists():
                payment.amount = sum(pp.total_price for pp in remaining)
                if not remaining.filter(is_successful=False).exists():
                    payment.is_successful = True
                    payment.save(update_fields=['amount', 'is_successful'])
                else:
                    payment.save(update_fields=['amount'])
            else:
                payment.delete()

        instance.delete()

    def check_payment_success_status(self, instance):
        for payment in instance.main_payment.all():
            if payment.is_successful:
                continue

            if not payment.product_payments.filter(is_successful=False).exists():
                payment.is_successful = True
                payment.save(update_fields=['is_successful'])

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
        user = self.context['request'].user

        if not cart_item:
            raise serializers.ValidationError("The shopping cart item is not specified.")

        if cart_item.cart.user != user:
            raise serializers.ValidationError("You are not allowed to use this cart item.")

        ProductPayment.objects.filter(
            cart_item=cart_item,
            is_successful=False
        ).delete()

        product = cart_item.product
        validated_data.update({
            'product': product,
            'storekeeper': product.storekeeper,
            'quantity': cart_item.quantity,
            'total_price': cart_item.get_total_price(),
            'cart': cart_item.cart,
            'paid_at': timezone.now()
        })

        pp = ProductPayment.objects.create(**validated_data)

        if pp.is_successful:
            buyer = pp.cart.user
            storekeeper = product.storekeeper

            purchase = ProductPurchase.objects.create(
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

        if 'cart_item' in validated_data:
            raise serializers.ValidationError({'cart_item': 'You cannot change the cart item after payment creation.'})

        was_successful = instance.is_successful
        new_successful = validated_data.get('is_successful', was_successful)

        if was_successful and not new_successful:
            raise serializers.ValidationError(
                {'is_successful': 'You cannot mark a successful payment as unsuccessful.'})

        if instance.is_delivered and 'is_delivered' in validated_data and not validated_data['is_delivered']:
            raise serializers.ValidationError({'is_delivered': 'You cannot mark a delivered item as undelivered.'})

        if 'delivered_at' in validated_data and instance.delivered_at is not None:
            raise serializers.ValidationError({'delivered_at': 'Delivery time cannot be changed once set.'})

        if 'address' in validated_data and self.get_storekeeper_delivery(instance):
            raise serializers.ValidationError(
                {'address': 'You cannot change the address after the seller has shipped the product.'})

        instance.address = validated_data.get('address', instance.address)
        instance.is_successful = new_successful
        instance.is_delivered = validated_data.get('is_delivered', instance.is_delivered)

        if 'delivered_at' in validated_data:
            instance.delivered_at = validated_data['delivered_at']

        instance.save()

        if not was_successful and new_successful:
            product = instance.product
            if product and product.stock_quantity is not None:
                product.stock_quantity = max(product.stock_quantity - instance.quantity, 0)

                if product.stock_quantity == 0:
                    product.discounted_price = None
                    product.discount_percentage = None
                    product.discount_period = None
                    product.amazing_offer = None
                    product.amazing_offer_period = None

                product.save()

            buyer = instance.cart.user
            storekeeper = product.storekeeper

            purchase = ProductPurchase.objects.create(
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

            for payment in instance.main_payment.all():
                if payment.is_successful:
                    continue

                if not payment.product_payments.filter(is_successful=False).exists():
                    payment.is_successful = True
                    payment.save(update_fields=['is_successful'])

        return instance

class PaymentSerializer(serializers.ModelSerializer):
    paid_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', read_only=True)
    product_payments = ProductPaymentSerializer(many=True, read_only=True)
    cart = serializers.PrimaryKeyRelatedField(read_only=True)

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
        request = self.context.get('request')
        user = getattr(request, 'user', None)

        if not user or not user.is_authenticated:
            raise serializers.ValidationError("Authentication required.")

        Payment.objects.filter(cart__user=user, is_successful=False).delete()

        try:
            cart = Cart.objects.prefetch_related('items').get(user=user)
        except Cart.DoesNotExist:
            raise serializers.ValidationError("No active cart found for this user.")

        if not cart.items.exists():
            raise serializers.ValidationError("Your cart is empty. You cannot create a payment without items.")

        validated_data['cart'] = cart
        validated_data['amount'] = cart.get_total_price()

        for field in self.SENSITIVE_FIELDS:
            validated_data.pop(field, None)

        payment = super().create(validated_data)

        product_payments = []

        for item in cart.items.select_related('product'):
            try:
                item = CartItem.objects.get(pk=item.pk)
            except CartItem.DoesNotExist:
                continue

            product = item.product
            storekeeper = getattr(product, 'storekeeper', None)

            if not storekeeper:
                raise serializers.ValidationError(
                    f"Storekeeper missing for product {getattr(product, 'pk', 'unknown')}")

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
                    cart=cart,
                    product=product,
                    storekeeper=storekeeper,
                    quantity=item.quantity,
                    total_price=item.get_total_price(),
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
                storekeeper = pp.storekeeper

                purchase = ProductPurchase.objects.create(
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

        if was_successful and not new_successful:
            raise serializers.ValidationError(
                {'is_successful': 'You cannot mark a successful payment as unsuccessful.'}
            )

        new_address = validated_data.get('address')

        if new_address is not None:
            for pp in instance.product_payments.all():
                delivery_status = ProductDeliveryStatus.objects.filter(payment=pp).first()
                if delivery_status and delivery_status.is_sent:
                    raise serializers.ValidationError({
                        'address': 'You cannot change the address after the seller has shipped one of the products.'
                    })

            for pp in instance.product_payments.filter(is_successful=False):
                pp.address = new_address
                pp.save(update_fields=['address'])

            instance.address = new_address

        instance.is_successful = new_successful
        instance.save()

        if not was_successful and new_successful:
            for pp in instance.product_payments.filter(is_successful=False):
                product = pp.product
                if product and product.stock_quantity is not None:
                    product.stock_quantity = max(product.stock_quantity - pp.quantity, 0)

                    if product.stock_quantity == 0:
                        product.discounted_price = None
                        product.discount_percentage = None
                        product.discount_period = None
                        product.amazing_offer = None
                        product.amazing_offer_period = None

                    product.save()

                pp.is_successful = True
                pp.save(update_fields=['is_successful'])

                if not ProductPurchase.objects.filter(payment=pp).exists():
                    buyer = pp.cart.user
                    storekeeper = product.storekeeper

                    purchase = ProductPurchase.objects.create(
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

