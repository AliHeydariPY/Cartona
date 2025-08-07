from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductCategoryViewSet, ProductCategoryViewSets

router = DefaultRouter()
router.register(r'categories', ProductCategoryViewSet, basename='category')
router.register(r'list-categories', ProductCategoryViewSets, basename='list-categories')

urlpatterns = [
    path('categories-api/', include(router.urls)),
]