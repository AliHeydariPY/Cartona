from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet,
    ImageViewSet,
    TypesViewSet,
    FeatureViewSet,
    FAQViewSet,
    CategoryViewSet)

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'images', ImageViewSet, basename='image')
router.register(r'types', TypesViewSet, basename='type')
router.register(r'features', FeatureViewSet, basename='feature')
router.register(r'faqs', FAQViewSet, basename='faq')
router.register(r'categories', CategoryViewSet, basename='category')

urlpatterns = [
    path('product-api/', include(router.urls)),
]
