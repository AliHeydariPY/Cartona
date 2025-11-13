from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet,
    StoreKeeperViewSet,
    ProductDeliveryStatusViewSet,
    StorePaymentViewSet,
    UserActivitySummaryViewSet)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'storekeepers', StoreKeeperViewSet, basename='storekeeper')
router.register(r'delivery-status', ProductDeliveryStatusViewSet, basename='delivery-status')
router.register(r'storekeeper-payments', StorePaymentViewSet, basename='storekeeper-payments')
router.register(r'user-activity-summary', UserActivitySummaryViewSet, basename='user-activity-summary')


urlpatterns = [
    path('user-api/', include(router.urls)),
]