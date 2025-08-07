from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet,
    ImageViewSet,
    TypesViewSet,
    TypesValuesViewSet,
    FeatureViewSet,
    FAQViewSet,
    ProductReadOnlyViewSet)

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'images', ImageViewSet, basename='image')
router.register(r'types', TypesViewSet, basename='type')
router.register(r'type-values', TypesValuesViewSet, basename='type-value')
router.register(r'features', FeatureViewSet, basename='feature')
router.register(r'faqs', FAQViewSet, basename='faq')
router.register(r'list-products', ProductReadOnlyViewSet, basename='list-products')

urlpatterns = [
    path('product-api/', include(router.urls)),
]
