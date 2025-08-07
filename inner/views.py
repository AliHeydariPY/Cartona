from rest_framework import viewsets
from .models import Product, Images, Types, Features, FrequentlyAskedQuestions
from .serializers import (
    ProductSerializer,
    ImageSerializer,
    TypesSerializer,
    FeatureSerializer,
    FAQSerializer,
    ProductReadOnlySerializer)

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-created_time')
    serializer_class = ProductSerializer

class ImageViewSet(viewsets.ModelViewSet):
    queryset = Images.objects.all()
    serializer_class = ImageSerializer

class TypesViewSet(viewsets.ModelViewSet):
    queryset = Types.objects.all()
    serializer_class = TypesSerializer

class FeatureViewSet(viewsets.ModelViewSet):
    queryset = Features.objects.all()
    serializer_class = FeatureSerializer

class FAQViewSet(viewsets.ModelViewSet):
    queryset = FrequentlyAskedQuestions.objects.all()
    serializer_class = FAQSerializer

class ProductReadOnlyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductReadOnlySerializer
