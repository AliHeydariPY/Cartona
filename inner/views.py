import django_filters
from django_filters.rest_framework import DjangoFilterBackend
from django.http import Http404
from django.db.models import Avg, Count, Case, When, F, Q
from django.core.exceptions import ValidationError
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import MethodNotAllowed, PermissionDenied
from rest_framework.filters import SearchFilter
from .models import Product, Images, Types, Features, FrequentlyAskedQuestions, Category
from .serializers import (
    ProductSerializer,
    ImageSerializer,
    TypesSerializer,
    FeatureSerializer,
    FAQSerializer,
    CategorySerializer,
)

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

class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description']

    def get_permissions(self):
        if self.request.method in ['GET', 'HEAD', 'OPTIONS']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        base_queryset = Product.objects.annotate(
            comment_count=Count('comments'),
            average_rating=Avg('comments__rating'),
            final_price=Case(
                When(discounted_price__isnull=False, then=F('discounted_price')),
                default=F('price')
            )
        )

        if self.request.method in ['GET', 'HEAD', 'OPTIONS']:
            return base_queryset.order_by('-updated_time')
        return base_queryset.filter(storekeeper__user=self.request.user).order_by('-updated_time')

    def get_serializer_context(self):
        return {"request": self.request}

    def handle_exception(self, exc):
        if isinstance(exc, ValidationError):
            return Response(
                {"detail": exc.messages},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().handle_exception(exc)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.storekeeper.user != request.user:
            raise PermissionDenied("You cannot delete another storekeeper's product.")

        serializer = self.get_serializer(instance)
        serializer.perform_delete(instance)

        return Response(status=status.HTTP_204_NO_CONTENT)

    def _handle_filtered_request(self, request, queryset, index, label="product"):
        queryset = queryset.order_by('-id')

        if not queryset.exists():
            raise Http404(f"No {label}s found.")

        if not index and request.method != 'GET':
            raise MethodNotAllowed(request.method, detail="Only GET is allowed in list mode.")

        if index:
            try:
                index = int(index)
                if index < 1 or index > queryset.count():
                    raise Http404("Invalid index.")
                obj = queryset[index - 1]
            except ValueError:
                raise Http404("Index must be a number.")
        else:
            obj = None

        if request.method == 'GET':
            serializer = self.get_serializer(obj if index else queryset, many=not index)
            return Response(serializer.data)

        elif request.method in ['PUT', 'PATCH']:
            serializer = self.get_serializer(obj, data=request.data, partial=(request.method == 'PATCH'))
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

        elif request.method == 'DELETE':
            if obj is None:
                raise MethodNotAllowed("DELETE", detail="You must specify an index to delete a single product.")
            obj.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, url_path=r'category/(?P<category_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_category(self, request, category_id=None, index=None):
        queryset = self.get_queryset().filter(category_id=category_id)
        return self._handle_filtered_request(request, queryset, index, label="category product")

    @action(detail=False, url_path=r'storekeeper/(?P<storekeeper_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_storekeeper(self, request, storekeeper_id=None, index=None):
        queryset = self.get_queryset().filter(storekeeper_id=storekeeper_id)
        return self._handle_filtered_request(request, queryset, index, label="storekeeper product")

class ImageViewSet(viewsets.ModelViewSet):
    serializer_class = ImageSerializer

    def get_permissions(self):
        if self.request.method in ['GET', 'HEAD', 'OPTIONS']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        if self.request.method in ['GET', 'HEAD', 'OPTIONS']:
            return Images.objects.all().order_by('-id')
        user = self.request.user
        return Images.objects.filter(product__storekeeper__user=user).order_by('-id')

    def get_serializer_context(self):
        return {"request": self.request}

    def _handle_filtered_request(self, request, queryset, index, label="image"):
        queryset = queryset.order_by('-id')

        if not queryset.exists():
            raise Http404(f"No {label}s found.")

        if not index and request.method != 'GET':
            raise MethodNotAllowed(request.method, detail="Only GET is allowed in list mode.")

        if index:
            try:
                index = int(index)
                if index < 1 or index > queryset.count():
                    raise Http404("Invalid index.")
                obj = queryset[index - 1]
            except ValueError:
                raise Http404("Index must be a number.")
        else:
            obj = None

        if request.method == 'GET':
            serializer = self.get_serializer(obj if index else queryset, many=not index)
            return Response(serializer.data)

        elif request.method in ['PUT', 'PATCH']:
            serializer = self.get_serializer(obj, data=request.data, partial=(request.method == 'PATCH'))
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

        elif request.method == 'DELETE':
            obj.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, url_path=r'product/(?P<product_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def product(self, request, product_id=None, index=None):
        queryset = self.get_queryset().filter(product_id=product_id)
        return self._handle_filtered_request(request, queryset, index, label="product image")

class TypesViewSet(viewsets.ModelViewSet):
    serializer_class = TypesSerializer

    def get_permissions(self):
        if self.request.method in ['GET', 'HEAD', 'OPTIONS']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        if self.request.method in ['GET', 'HEAD', 'OPTIONS']:
            return Types.objects.all().order_by('-id')
        user = self.request.user
        return Types.objects.filter(product__storekeeper__user=user).order_by('-id')

    def get_serializer_context(self):
        return {"request": self.request}

    def _handle_filtered_request(self, request, queryset, index, label="type"):
        queryset = queryset.order_by('-id')

        if not queryset.exists():
            raise Http404(f"No {label}s found.")

        if not index and request.method != 'GET':
            raise MethodNotAllowed(request.method, detail="Only GET is allowed in list mode.")

        if index:
            try:
                index = int(index)
                if index < 1 or index > queryset.count():
                    raise Http404("Invalid index.")
                obj = queryset[index - 1]
            except ValueError:
                raise Http404("Index must be a number.")
        else:
            obj = None

        if request.method == 'GET':
            serializer = self.get_serializer(obj if index else queryset, many=not index)
            return Response(serializer.data)

        elif request.method in ['PUT', 'PATCH']:
            serializer = self.get_serializer(obj, data=request.data, partial=(request.method == 'PATCH'))
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

        elif request.method == 'DELETE':
            obj.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, url_path=r'product/(?P<product_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def product(self, request, product_id=None, index=None):
        queryset = self.get_queryset().filter(product_id=product_id)
        return self._handle_filtered_request(request, queryset, index, label="product type")

class FeatureViewSet(viewsets.ModelViewSet):
    serializer_class = FeatureSerializer

    def get_permissions(self):
        if self.request.method in ['GET', 'HEAD', 'OPTIONS']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        if self.request.method in ['GET', 'HEAD', 'OPTIONS']:
            return Features.objects.all().order_by('-id')
        user = self.request.user
        return Features.objects.filter(product__storekeeper__user=user).order_by('-id')

    def get_serializer_context(self):
        return {"request": self.request}

    def _handle_filtered_request(self, request, queryset, index, label="feature"):
        queryset = queryset.order_by('-id')

        if not queryset.exists():
            raise Http404(f"No {label}s found.")

        if not index and request.method != 'GET':
            raise MethodNotAllowed(request.method, detail="Only GET is allowed in list mode.")

        if index:
            try:
                index = int(index)
                if index < 1 or index > queryset.count():
                    raise Http404("Invalid index.")
                obj = queryset[index - 1]
            except ValueError:
                raise Http404("Index must be a number.")
        else:
            obj = None

        if request.method == 'GET':
            serializer = self.get_serializer(obj if index else queryset, many=not index)
            return Response(serializer.data)

        elif request.method in ['PUT', 'PATCH']:
            serializer = self.get_serializer(obj, data=request.data, partial=(request.method == 'PATCH'))
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

        elif request.method == 'DELETE':
            obj.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, url_path=r'product/(?P<product_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def product(self, request, product_id=None, index=None):
        queryset = self.get_queryset().filter(product_id=product_id)
        return self._handle_filtered_request(request, queryset, index, label="product feature")

class FAQViewSet(viewsets.ModelViewSet):
    serializer_class = FAQSerializer

    def get_permissions(self):
        if self.request.method in ['GET', 'HEAD', 'OPTIONS']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        if self.request.method in ['GET', 'HEAD', 'OPTIONS']:
            return FrequentlyAskedQuestions.objects.all().order_by('-id')
        user = self.request.user
        return FrequentlyAskedQuestions.objects.filter(product__storekeeper__user=user).order_by('-id')

    def get_serializer_context(self):
        return {"request": self.request}

    def _handle_filtered_request(self, request, queryset, index, label="FAQ"):
        queryset = queryset.order_by('-id')

        if not queryset.exists():
            raise Http404(f"No {label}s found.")

        if not index and request.method != 'GET':
            raise MethodNotAllowed(request.method, detail="Only GET is allowed in list mode.")

        if index:
            try:
                index = int(index)
                if index < 1 or index > queryset.count():
                    raise Http404("Invalid index.")
                obj = queryset[index - 1]
            except ValueError:
                raise Http404("Index must be a number.")
        else:
            obj = None

        if request.method == 'GET':
            serializer = self.get_serializer(obj if index else queryset, many=not index)
            return Response(serializer.data)

        elif request.method in ['PUT', 'PATCH']:
            serializer = self.get_serializer(obj, data=request.data, partial=(request.method == 'PATCH'))
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

        elif request.method == 'DELETE':
            obj.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, url_path=r'product/(?P<product_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def product(self, request, product_id=None, index=None):
        queryset = self.get_queryset().filter(product_id=product_id)
        return self._handle_filtered_request(request, queryset, index, label="product FAQ")

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all().order_by('-id')
    serializer_class = CategorySerializer
    filter_backends = [SearchFilter]
    search_fields = ['name', 'description']

    @action(detail=False, url_path=r'parent/(?P<parent_id>[^/]+)(?:/(?P<index>\d+))?', methods=['get'])
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
