from rest_framework import mixins, viewsets
from .models import Cart, CartItem, Payment, ProductPayment
from .serializers import (CartItemSerializer, CartSerializer,
    PaymentSerializer, ProductPaymentSerializer)

class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    queryset = CartItem.objects.all()

    def get_queryset(self):
        return CartItem.objects.all()

class CartViewSet(mixins.CreateModelMixin,
                  mixins.RetrieveModelMixin,
                  mixins.ListModelMixin,
                  viewsets.GenericViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

class ProductPaymentViewSet(viewsets.ModelViewSet):
    queryset = ProductPayment.objects.all()
    serializer_class = ProductPaymentSerializer
