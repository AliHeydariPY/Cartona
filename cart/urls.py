from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (CartViewSet, CartItemViewSet, PaymentViewSet,
    ProductPaymentViewSet, FavoriteViewSet, FavoriteItemViewSet)


router = DefaultRouter()
router.register(r'cart', CartViewSet, basename='cart')
router.register(r'cart-items', CartItemViewSet, basename='cart-items')
router.register(r'favorites', FavoriteViewSet, basename='favorite')
router.register(r'favorite-items', FavoriteItemViewSet, basename='favorite-item')
router.register(r'payments', PaymentViewSet, basename='payments')
router.register(r'product-payments', ProductPaymentViewSet, basename='product-payments')

urlpatterns = [
    path('cart-api/', include(router.urls)),
]
