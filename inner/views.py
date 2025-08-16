import django_filters
from django_filters.rest_framework import DjangoFilterBackend
from django.http import Http404
from django.db.models import Avg, Count, Case, When, F, Q
from django.core.exceptions import ValidationError
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import MethodNotAllowed
from rest_framework.filters import SearchFilter
from .models import Product, Images, Types, Features, FrequentlyAskedQuestions, Category
from .serializers import (
    ProductSerializer,
    ImageSerializer,
    TypesSerializer,
    FeatureSerializer,
    FAQSerializer,
    ProductReadOnlySerializer,
    CategorySerializer,
)

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-created_time')
    serializer_class = ProductSerializer
    lookup_field = 'pk'

    def get_products_by(self, **kwargs):
        products = Product.objects.filter(**kwargs).order_by('-created_time')
        if not products.exists():
            raise Http404("No products found.")
        return products

    def handle_request(self, request, products, index=None):
        if not index and request.method != 'GET':
            raise MethodNotAllowed(request.method, detail="Only GET is allowed in list mode.")

        if index:
            try:
                index = int(index)
                if index < 1 or index > products.count():
                    raise Http404("Invalid index.")
                product = products[index - 1]
            except ValueError:
                raise Http404("Index must be a number.")
        else:
            product = None

        if request.method == 'GET':
            if index:
                serializer = self.get_serializer(product)
                return Response(serializer.data)
            else:
                serializer = self.get_serializer(products, many=True)
                return Response(serializer.data)

        elif request.method in ['PUT', 'PATCH']:
            serializer = self.get_serializer(product, data=request.data, partial=(request.method == 'PATCH'))
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

        elif request.method == 'DELETE':
            product.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, url_path=r'storekeeper/(?P<storekeeper_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_storekeeper(self, request, storekeeper_id=None, index=None):
        products = self.get_products_by(storekeeper_id=storekeeper_id)
        return self.handle_request(request, products, index)

    @action(detail=False, url_path=r'category/(?P<category_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_category(self, request, category_id=None, index=None):
        products = self.get_products_by(category_id=category_id)
        return self.handle_request(request, products, index)

    @action(detail=False, url_path=r'name/(?P<name>[^/.]+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_name(self, request, name=None, index=None):
        products = self.get_products_by(name=name)
        return self.handle_request(request, products, index)

class ImageViewSet(viewsets.ModelViewSet):
    queryset = Images.objects.all()
    serializer_class = ImageSerializer

    @action(detail=False, url_path=r'product/(?P<product_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_product(self, request, product_id=None, index=None):
        images = Images.objects.filter(product_id=product_id).order_by('-id')
        if not images.exists():
            raise Http404("No images found for this product.")

        if not index and request.method != 'GET':
            raise MethodNotAllowed(request.method, detail="Only GET is allowed in list mode.")

        if index:
            try:
                index = int(index)
                if index < 1 or index > images.count():
                    raise Http404("Invalid index.")
                image = images[index - 1]
            except ValueError:
                raise Http404("Index must be a number.")
        else:
            image = None

        if request.method == 'GET':
            if index:
                serializer = self.get_serializer(image)
                return Response(serializer.data)
            else:
                serializer = self.get_serializer(images, many=True)
                return Response(serializer.data)

        elif request.method in ['PUT', 'PATCH']:
            serializer = self.get_serializer(image, data=request.data, partial=(request.method == 'PATCH'))
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

        elif request.method == 'DELETE':
            image.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

class TypesViewSet(viewsets.ModelViewSet):
    queryset = Types.objects.all()
    serializer_class = TypesSerializer

    @action(detail=False, url_path=r'product/(?P<product_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_product(self, request, product_id=None, index=None):
        types = Types.objects.filter(product_id=product_id).order_by('-id')
        if not types.exists():
            raise Http404("No types found for this product.")

        if not index and request.method != 'GET':
            raise MethodNotAllowed(request.method, detail="Only GET is allowed in list mode.")

        if index:
            try:
                index = int(index)
                if index < 1 or index > types.count():
                    raise Http404("Invalid index.")
                type_obj = types[index - 1]
            except ValueError:
                raise Http404("Index must be a number.")
        else:
            type_obj = None

        if request.method == 'GET':
            if index:
                serializer = self.get_serializer(type_obj)
                return Response(serializer.data)
            else:
                serializer = self.get_serializer(types, many=True)
                return Response(serializer.data)

        elif request.method in ['PUT', 'PATCH']:
            serializer = self.get_serializer(type_obj, data=request.data, partial=(request.method == 'PATCH'))
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

        elif request.method == 'DELETE':
            type_obj.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

class FeatureViewSet(viewsets.ModelViewSet):
    queryset = Features.objects.all()
    serializer_class = FeatureSerializer

    @action(detail=False, url_path=r'product/(?P<product_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_product(self, request, product_id=None, index=None):
        features = Features.objects.filter(product_id=product_id).order_by('-id')
        if not features.exists():
            raise Http404("No features found for this product.")

        if not index and request.method != 'GET':
            raise MethodNotAllowed(request.method, detail="Only GET is allowed in list mode.")

        if index:
            try:
                index = int(index)
                if index < 1 or index > features.count():
                    raise Http404("Invalid index.")
                feature = features[index - 1]
            except ValueError:
                raise Http404("Index must be a number.")
        else:
            feature = None

        if request.method == 'GET':
            if index:
                serializer = self.get_serializer(feature)
                return Response(serializer.data)
            else:
                serializer = self.get_serializer(features, many=True)
                return Response(serializer.data)

        elif request.method in ['PUT', 'PATCH']:
            serializer = self.get_serializer(feature, data=request.data, partial=(request.method == 'PATCH'))
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

        elif request.method == 'DELETE':
            feature.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

class FAQViewSet(viewsets.ModelViewSet):
    queryset = FrequentlyAskedQuestions.objects.all()
    serializer_class = FAQSerializer

    @action(detail=False, url_path=r'product/(?P<product_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_product(self, request, product_id=None, index=None):
        faqs = FrequentlyAskedQuestions.objects.filter(product_id=product_id).order_by('-id')
        if not faqs.exists():
            raise Http404("No FAQs found for this product.")

        if not index and request.method != 'GET':
            raise MethodNotAllowed(request.method, detail="Only GET is allowed in list mode.")

        if index:
            try:
                index = int(index)
                if index < 1 or index > faqs.count():
                    raise Http404("Invalid index.")
                faq = faqs[index - 1]
            except ValueError:
                raise Http404("Index must be a number.")
        else:
            faq = None

        if request.method == 'GET':
            if index:
                serializer = self.get_serializer(faq)
                return Response(serializer.data)
            else:
                serializer = self.get_serializer(faqs, many=True)
                return Response(serializer.data)

        elif request.method in ['PUT', 'PATCH']:
            serializer = self.get_serializer(faq, data=request.data, partial=(request.method == 'PATCH'))
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

        elif request.method == 'DELETE':
            faq.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

class ProductFilter(django_filters.FilterSet):
    min_rating = django_filters.CharFilter(
        method='filter_min_rating',
        label='Minimum Rating'
    )
    max_rating = django_filters.CharFilter(
        method='filter_max_rating',
        label='Maximum Rating'
    )

    min_comments = django_filters.NumberFilter(
        field_name='comment_count',
        lookup_expr='gte',
        label='Minimum Comment Count'
    )
    max_comments = django_filters.NumberFilter(
        field_name='comment_count',
        lookup_expr='lte',
        label='Maximum Comment Count'
    )

    min_price = django_filters.NumberFilter(
        method='filter_min_price',
        label='Minimum Price'
    )
    max_price = django_filters.NumberFilter(
        method='filter_max_price',
        label='Maximum Price'
    )

    category = django_filters.NumberFilter(
        field_name='category_id',
        label='Category'
    )
    storekeeper = django_filters.NumberFilter(
        field_name='storekeeper_id',
        label='Storekeeper'
    )

    def filter_min_rating(self, queryset, name, value):
        max_rating_value = self.data.get('max_rating')

        if value == 'null':
            if max_rating_value and max_rating_value != 'null':
                try:
                    max_rating = float(max_rating_value)
                    if not (1.0 <= max_rating <= 5.0):
                        raise ValidationError("max_rating must be between 1.0 and 5.0.")
                    return queryset.filter(Q(average_rating__isnull=True) | Q(average_rating__lte=max_rating))
                except ValueError:
                    raise ValidationError("max_rating must be a number or 'null'.")
            else:
                return queryset.filter(average_rating__isnull=True)

        try:
            min_rating = float(value)
            if not (1.0 <= min_rating <= 5.0):
                raise ValidationError("min_rating must be between 1.0 and 5.0.")
            if max_rating_value and max_rating_value != 'null':
                try:
                    max_rating = float(max_rating_value)
                    if not (1.0 <= max_rating <= 5.0):
                        raise ValidationError("max_rating must be between 1.0 and 5.0.")
                    return queryset.filter(average_rating__gte=min_rating, average_rating__lte=max_rating)
                except ValueError:
                    raise ValidationError("max_rating must be a number or 'null'.")
            return queryset.filter(average_rating__gte=min_rating)
        except ValueError:
            raise ValidationError("min_rating must be a number or 'null'.")

    def filter_max_rating(self, queryset, name, value):
        min_rating_value = self.data.get('min_rating')
        if min_rating_value:
            return queryset

        if value == 'null':
            return queryset.filter(average_rating__isnull=True)

        try:
            max_rating = float(value)
            if not (1.0 <= max_rating <= 5.0):
                raise ValidationError("max_rating must be between 1.0 and 5.0.")
            return queryset.filter(Q(average_rating__lte=max_rating))
        except ValueError:
            raise ValidationError("max_rating must be a number or 'null'.")

    def filter_min_price(self, queryset, name, value):
        return queryset.annotate(
            final_price=Case(
                When(discounted_price__isnull=False, then=F('discounted_price')),
                default=F('price')
            )
        ).filter(final_price__gte=value)

    def filter_max_price(self, queryset, name, value):
        return queryset.annotate(
            final_price=Case(
                When(discounted_price__isnull=False, then=F('discounted_price')),
                default=F('price')
            )
        ).filter(final_price__lte=value)

    class Meta:
        model = Product
        fields = [
            'min_rating', 'max_rating',
            'min_comments', 'max_comments',
            'min_price', 'max_price',
            'category', 'storekeeper'
        ]

class ProductReadOnlyViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProductReadOnlySerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description']

    def get_queryset(self):
        return Product.objects.annotate(
            comment_count=Count('comments'),
            average_rating=Avg('comments__rating'),
            final_price=Case(
                When(discounted_price__isnull=False, then=F('discounted_price')),
                default=F('price')
            )
        )

    def handle_exception(self, exc):
        if isinstance(exc, ValidationError):
            return Response(
                {"detail": exc.messages},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().handle_exception(exc)

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all().order_by('-id')
    serializer_class = CategorySerializer
    filter_backends = [SearchFilter]
    search_fields = ['name', 'description']

    @action(detail=False, url_path='parent/(?P<parent_id>[^/]+)(?:/(?P<index>\d+))?', methods=['get'])
    def by_parent(self, request, parent_id=None, index=None):
        if parent_id == "null":
            categories = Category.objects.filter(parent__isnull=True).order_by('-id')
        else:
            categories = Category.objects.filter(parent_id=parent_id).order_by('-id')

        if not categories.exists():
            raise Http404("No categories found.")

        if index:
            try:
                index = int(index)
                if index < 1 or index > categories.count():
                    raise Http404("Invalid index.")
                category = categories[index - 1]
            except ValueError:
                raise Http404("Index must be a number.")
            serializer = self.get_serializer(category)
            return Response(serializer.data)

        serializer = self.get_serializer(categories, many=True)
        return Response(serializer.data)
