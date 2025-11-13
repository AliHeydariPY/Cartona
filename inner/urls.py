from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet,
    ImageViewSet,
    FeatureViewSet,
    FAQViewSet,
    CategoryViewSet,
    CollectionModelViewSet)

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'images', ImageViewSet, basename='image')
router.register(r'features', FeatureViewSet, basename='feature')
router.register(r'faqs', FAQViewSet, basename='faq')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'collections', CollectionModelViewSet, basename='collections')

urlpatterns = [
    path('product-api/', include(router.urls)),
]
