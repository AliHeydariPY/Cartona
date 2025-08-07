from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework.exceptions import ValidationError
from .models import StoreKeeper, Images, Features, FrequentlyAskedQuestions, ProductDeliveryStatus
from cart.models import ProductPayment
from .serializers import (
    UserSerializer,
    StoreKeeperSerializer,
    StoreImageSerializer,
    StoreFeatureSerializer,
    StoreFAQSerializer,
    StoreKeeperReadOnlySerializer,
    DeliveryStatusSerializer,
    StoreRelatedPaymentSerializer)

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def create(self, request, *args, **kwargs):
        username = request.data.get('username')
        if User.objects.filter(username=username).exists():
            raise ValidationError({'username': 'این نام کاربری قبلاً ثبت شده است.'})
        return super().create(request, *args, **kwargs)

class StoreKeeperViewSet(viewsets.ModelViewSet):
    queryset = StoreKeeper.objects.all().order_by('-created_time')
    serializer_class = StoreKeeperSerializer

class StoreImageViewSet(viewsets.ModelViewSet):
    queryset = Images.objects.all()
    serializer_class = StoreImageSerializer

class StoreFeatureViewSet(viewsets.ModelViewSet):
    queryset = Features.objects.all()
    serializer_class = StoreFeatureSerializer

class StoreFAQViewSet(viewsets.ModelViewSet):
    queryset = FrequentlyAskedQuestions.objects.all()
    serializer_class = StoreFAQSerializer

class StoreKeeperReadOnlyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = StoreKeeper.objects.all()
    serializer_class = StoreKeeperReadOnlySerializer

class ProductDeliveryStatusViewSet(viewsets.ModelViewSet):
    queryset = ProductDeliveryStatus.objects.all()
    serializer_class = DeliveryStatusSerializer

class StorePaymentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = StoreRelatedPaymentSerializer

    def get_queryset(self):
        return ProductPayment.objects.filter(is_successful=True)
