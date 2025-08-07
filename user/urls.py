from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet,
    StoreKeeperViewSet,
    StoreImageViewSet,
    StoreFeatureViewSet,
    StoreFAQViewSet,
    StoreKeeperReadOnlyViewSet,
    ProductDeliveryStatusViewSet,
    StorePaymentViewSet)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'storekeepers', StoreKeeperViewSet)
router.register(r'store-images', StoreImageViewSet)
router.register(r'store-features', StoreFeatureViewSet)
router.register(r'store-faqs', StoreFAQViewSet)
router.register(r'stores', StoreKeeperReadOnlyViewSet, basename='store')
router.register(r'delivery-status', ProductDeliveryStatusViewSet, basename='delivery-status')
router.register(r'storekeeper-payments', StorePaymentViewSet, basename='storekeeper-payments')


urlpatterns = [
    path('user-api/', include(router.urls)),
]