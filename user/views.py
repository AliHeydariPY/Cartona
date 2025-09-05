from django.contrib.auth.models import User
from django.http import Http404
from django.db.models import Q
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import MethodNotAllowed, PermissionDenied, NotFound
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter
from .models import StoreKeeper, ProductDeliveryStatus
from cart.models import ProductPayment
from .serializers import (
    UserSerializer,
    StoreKeeperSerializer,
    DeliveryStatusSerializer,
    StoreRelatedPaymentSerializer)

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return User.objects.none()
        return User.objects.filter(id=user.id)

    @action(detail=False, methods=['get', 'put', 'patch', 'delete'], url_path=r'username/(?P<username>[^/.]+)', permission_classes=[IsAuthenticated])
    def by_username(self, request, username=None):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise NotFound("User not found.")

        if user != request.user:
            raise PermissionDenied("You can only manage your own profile.")

        if request.method == 'GET':
            serializer = self.get_serializer(user)
            return Response(serializer.data)

        elif request.method in ['PUT', 'PATCH']:
            partial = request.method == 'PATCH'
            serializer = self.get_serializer(user, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)

        elif request.method == 'DELETE':
            raise PermissionDenied("User deletion is not allowed via this endpoint.")

class StoreKeeperViewSet(viewsets.ModelViewSet):
    serializer_class = StoreKeeperSerializer
    filter_backends = [SearchFilter]
    search_fields = ['store_name', 'description']

    def get_permissions(self):
        if self.request.method in ['GET', 'HEAD', 'OPTIONS']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        if self.request.method in ['GET', 'HEAD', 'OPTIONS']:
            return StoreKeeper.objects.all().order_by('-id')
        return StoreKeeper.objects.filter(user=self.request.user).order_by('-id')

    @action(detail=False, methods=['get', 'put', 'patch', 'delete'], url_path=r'username/(?P<username>[\w.@+-]+)')
    def by_username(self, request, username=None):
        try:
            storekeeper = StoreKeeper.objects.select_related('user').get(user__username=username)
        except StoreKeeper.DoesNotExist:
            raise NotFound("StoreKeeper with this username not found.")

        if request.method == 'GET':
            serializer = self.get_serializer(storekeeper)
            return Response(serializer.data)

        if not request.user.is_authenticated:
            raise PermissionDenied("Authentication required.")

        if storekeeper.user != request.user:
            raise PermissionDenied("You do not have permission to modify this storekeeper.")

        if request.method in ['PUT', 'PATCH']:
            serializer = self.get_serializer(storekeeper, data=request.data, partial=(request.method == 'PATCH'))
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

        elif request.method == 'DELETE':
            storekeeper.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        else:
            raise MethodNotAllowed(request.method)

class ProductDeliveryStatusViewSet(viewsets.ModelViewSet):
    serializer_class = DeliveryStatusSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        try:
            storekeeper = StoreKeeper.objects.get(user=user)
        except StoreKeeper.DoesNotExist:
            raise PermissionDenied("You are not a storekeeper.")

        return ProductDeliveryStatus.objects.filter(
            payment__product__storekeeper=storekeeper
        ).order_by('-id')

    def get_serializer_context(self):
        return {"request": self.request}

    def _handle_filtered_request(self, request, queryset, index, label="item"):
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

    @action(detail=False, url_path=r'is-sent/(?P<is_sent>true|false)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_sent_status(self, request, is_sent=None, index=None):
        value = is_sent.lower() == 'true'
        queryset = self.get_queryset().filter(is_sent=value)
        return self._handle_filtered_request(request, queryset, index, label="delivery status")

    @action(detail=False, url_path=r'payment/(?P<payment_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_payment(self, request, payment_id=None, index=None):
        try:
            payment_id = int(payment_id)
        except ValueError:
            raise Http404("Invalid payment ID.")

        queryset = self.get_queryset().filter(payment_id=payment_id)
        return self._handle_filtered_request(request, queryset, index, label="payment delivery status")

class StorePaymentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = StoreRelatedPaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        try:
            storekeeper = StoreKeeper.objects.get(user=user)
        except StoreKeeper.DoesNotExist:
            raise PermissionDenied("You are not a storekeeper.")

        return ProductPayment.objects.filter(
            product__storekeeper=storekeeper,
            is_successful=True
        ).order_by('-paid_at')

    def get_serializer_context(self):
        return {"request": self.request}

    def _handle_filtered_request(self, request, queryset, index, label="item"):
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
    def by_product(self, request, product_id=None, index=None):
        try:
            product_id = int(product_id)
        except ValueError:
            raise Http404("Invalid product ID.")

        queryset = self.get_queryset().filter(product_id=product_id)
        return self._handle_filtered_request(request, queryset, index, label="store payment")

    @action(detail=False, url_path=r'buyer/(?P<username>[\w.@+-]+)(?:/(?P<index>\d+))?',
            methods=['get', 'put', 'patch', 'delete'])
    def by_buyer(self, request, username=None, index=None):
        if not username:
            raise Http404("Username is required.")

        queryset = self.get_queryset().filter(cart__user__username=username)
        return self._handle_filtered_request(request, queryset, index, label="buyer payment")

    @action(
        detail=False,
        url_path=r'end-of-sending/(?P<end_of_sending>true|false)(?:/(?P<index>\d+))?',
        methods=['get', 'put', 'patch', 'delete']
    )
    def end_of_sending(self, request, end_of_sending=None, index=None):
        value = end_of_sending.lower() == 'true'
        queryset = self.get_queryset().filter(end_of_sending=value)
        return self._handle_filtered_request(request, queryset, index, label="end_of_sending payment")
