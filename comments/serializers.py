from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Comment, CommentReply, ProductQuestion, ProductPurchase, PurchaseChat
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
            raise serializers.ValidationError("متن پاسخ نمی‌تواند خالی باشد.")
        return value

    def validate(self, data):
        user = data.get('user')
        comment = data.get('comment')

        if not user or not user.is_authenticated:
            raise serializers.ValidationError("برای ارسال پاسخ باید وارد حساب کاربری شوید.")
        if not comment:
            raise serializers.ValidationError("کامنت معتبر نیست.")
        return data

    def create(self, validated_data):
        return CommentReply.objects.create(**validated_data)

    def update(self, instance, validated_data):
        user = validated_data.get('user')
        if user != instance.user:
            raise serializers.ValidationError("شما نمی‌توانید پاسخ کاربر دیگری را ویرایش کنید.")

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
            raise serializers.ValidationError("برای ثبت کامنت باید وارد حساب کاربری شوید.")

        if not product:
            raise serializers.ValidationError("محصول نامعتبر است.")

        return data

    def validate_rating(self, value):
        user_id = self.initial_data.get("user")
        product_id = self.initial_data.get("product")

        if not user_id or not product_id:
            return value  # اگر اطلاعات ناقص بود، ولش می‌کنیم

        try:
            user_instance = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            raise serializers.ValidationError("کاربر معتبر نیست.")

        has_commented = Comment.objects.filter(user=user_instance, product_id=product_id).exists()

        if self.instance:
            # حالت آپدیت: فقط اجازه داریم امتیاز قبلی رو تغییر بدیم
            original_rating = self.instance.rating
            if original_rating is None and value is not None:
                raise serializers.ValidationError("نمی‌توانید برای کامنتی که قبلاً امتیاز نداشته، امتیاز ثبت کنید.")
            return value

        # حالت ساخت (create):
        if has_commented and value is not None:
            raise serializers.ValidationError(
                "شما قبلاً برای این محصول کامنت داده‌اید و نمی‌توانید دوباره امتیاز دهید.")
        if not has_commented and value is None:
            raise serializers.ValidationError("برای اولین کامنت، امتیاز دادن الزامی است.")

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
            raise serializers.ValidationError("شما نمی‌توانید کامنت کاربر دیگری را ویرایش کنید.")

        rating = validated_data.get("rating")
        if rating is not None and not (1 <= rating <= 5):
            raise serializers.ValidationError("امتیاز باید عددی بین ۱ تا ۵ باشد.")

        replies_data = validated_data.pop('replies', [])

        # ابتدا کامنت اصلی را آپدیت می‌کنیم
        comment = super().update(instance, validated_data)

        # سپس ریپلای‌ها را هندل می‌کنیم
        for reply_data in replies_data:
            reply_id = reply_data.get('id')
            if reply_id:
                try:
                    reply_instance = CommentReply.objects.get(id=reply_id, comment=comment)
                    for attr, value in reply_data.items():
                        setattr(reply_instance, attr, value)
                    reply_instance.save()
                except CommentReply.DoesNotExist:
                    continue  # یا می‌تونی به جای این، ریپلای جدید بسازی
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
            raise serializers.ValidationError("متن سوال نمی‌تواند خالی باشد.")
        return value

    def create(self, validated_data):
        product = validated_data.get('product')
        user = validated_data.get('user')

        if product.storekeeper.user == user:
            raise serializers.ValidationError("فروشنده نمی‌تواند برای محصول خودش سوال ثبت کند.")

        return ProductQuestion.objects.create(**validated_data)

    def update(self, instance, validated_data):
        storekeeper = validated_data.get('storekeeper')
        product_storekeeper = instance.product.storekeeper

        if storekeeper != product_storekeeper:
            raise serializers.ValidationError("فقط فروشنده محصول می‌تواند به سوال پاسخ دهد.")

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
            raise serializers.ValidationError("خریدار نمی‌تواند همان فروشنده باشد.")

        if ProductPurchase.objects.filter(
            buyer=buyer,
            product=product,
            storekeeper=storekeeper
        ).exists():
            raise serializers.ValidationError("این خرید قبلاً ثبت شده است.")

        if payment.cart.user != buyer:
            raise serializers.ValidationError("پرداخت انتخاب‌شده متعلق به این خریدار نیست.")

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
            raise serializers.ValidationError("متن پیام نمی‌تواند خالی باشد.")
        return value

    def validate(self, data):
        purchase = data.get('purchase')
        sender = data.get('sender')

        # بررسی فعال بودن چت
        if not purchase.chat_enabled:
            raise serializers.ValidationError("چت برای این خرید غیرفعال شده است.")

        # بررسی مجاز بودن ارسال‌کننده
        if sender != purchase.buyer and sender != purchase.storekeeper.user:
            raise serializers.ValidationError("فقط خریدار یا فروشنده می‌تواند پیام ارسال کند.")

        return data

    def create(self, validated_data):
        return PurchaseChat.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.message = validated_data.get('message', instance.message).strip()
        instance.save()
        return instance
