from rest_framework import viewsets
from .models import ProductCategory
from .serializers import ProductCategorySerializer, ProductCategoryWithFullProductsSerializer

class ProductCategoryViewSet(viewsets.ModelViewSet):
    serializer_class = ProductCategorySerializer

    def get_queryset(self):
        return ProductCategory.objects.all()

class ProductCategoryViewSets(viewsets.ReadOnlyModelViewSet):
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategoryWithFullProductsSerializer