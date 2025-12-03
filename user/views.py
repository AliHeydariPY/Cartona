from django.contrib.auth.models import User
from django.db.models import Sum, OuterRef, Exists, Subquery, Q
from django.http import Http404
from rest_framework import viewsets, status, mixins
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import MethodNotAllowed, PermissionDenied, NotFound
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from .models import StoreKeeper, ProductDeliveryStatus
from cart.models import ProductPayment
from .serializers import (
    UserSerializer,
    StoreKeeperSerializer,
    DeliveryStatusSerializer,
    StoreRelatedPaymentSerializer,
    UserActivitySummarySerializer)

class UserViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet
):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    lookup_field = 'uuid_record__uuid'
    pagination_class = None

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return User.objects.none()
        return User.objects.filter(uuid_record__uuid=user.uuid_record.uuid)

    @action(detail=False, methods=['get', 'put', 'patch'], url_path=r'username/(?P<username>[^/.]+)',
            permission_classes=[IsAuthenticated])
    def by_username(self, request, username=None):
        queryset = self.get_queryset()
        try:
            user = queryset.get(username=username)
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

    @action(detail=False, methods=['get', 'put', 'patch'], url_path=r'role/(?P<role>user|storekeeper)',
            permission_classes=[IsAuthenticated])
    def by_role(self, request, role=None):
        queryset = self.get_queryset()
        user = request.user

        is_storekeeper = StoreKeeper.objects.filter(user=user).exists()

        if role == 'storekeeper' and not is_storekeeper:
            raise PermissionDenied("You are not a storekeeper.")
        elif role == 'user' and is_storekeeper:
            raise PermissionDenied("You are not a regular user.")

        try:
            target_user = queryset.get(id=user.id)
        except User.DoesNotExist:
            raise NotFound("User not found.")

        if request.method == 'GET':
            serializer = self.get_serializer(target_user)
            return Response(serializer.data)

        elif request.method in ['PUT', 'PATCH']:
            partial = request.method == 'PATCH'
            serializer = self.get_serializer(target_user, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)

class StoreKeeperViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet
):
    serializer_class = StoreKeeperSerializer
    filter_backends = [SearchFilter]
    search_fields = ['store_name', 'description']
    pagination_class = None

    def get_permissions(self):
        if self.request.method in ['GET', 'HEAD', 'OPTIONS']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        if self.request.method in ['GET', 'HEAD', 'OPTIONS']:
            return StoreKeeper.objects.all().order_by('-id')
        return StoreKeeper.objects.filter(user=self.request.user).order_by('-id')

    @action(detail=False, methods=['get', 'put', 'patch'], url_path=r'username/(?P<username>[\w.@+-]+)')
    def by_username(self, request, username=None):
        queryset = self.get_queryset()
        try:
            storekeeper = queryset.select_related('user').get(user__username=username)
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

class ProductDeliveryStatusViewSet(viewsets.ModelViewSet):
    serializer_class = DeliveryStatusSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        user = self.request.user
        try:
            storekeeper = StoreKeeper.objects.get(user=user)
        except StoreKeeper.DoesNotExist:
            raise PermissionDenied("You are not a storekeeper.")

        return ProductDeliveryStatus.objects.filter(
            payment__product__storekeeper=storekeeper,
            storekeeper_hidden=False
        ).order_by('-id')

    def get_serializer_context(self):
        return {"request": self.request}

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self._handle_virtual_deletion(request, instance)
        return Response({"detail": "Delivery status has been removed from your view."}, status=status.HTTP_200_OK)

    def _handle_virtual_deletion(self, request, instance):
        user = request.user
        if user != instance.payment.product.storekeeper.user:
            raise PermissionDenied("You are not allowed to delete this delivery status.")
        instance.storekeeper_hidden = True
        instance.save()

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
            if obj is None:
                raise MethodNotAllowed("DELETE", detail="You must specify an index to delete a single item.")
            self._handle_virtual_deletion(request, obj)
            return Response({"detail": "Delivery status has been removed from your view."}, status=status.HTTP_200_OK)

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

class StorePaymentViewSet(
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet
):
    serializer_class = StoreRelatedPaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        try:
            storekeeper = StoreKeeper.objects.get(user=user)
        except StoreKeeper.DoesNotExist:
            raise PermissionDenied("You are not a storekeeper.")

        return ProductPayment.objects.filter(
            is_successful=True,
            storekeeper_hidden=False
        ).filter(
            Q(product__storekeeper=storekeeper) | Q(storekeeper=storekeeper)
        ).order_by('-paid_at')

    def get_serializer_context(self):
        return {"request": self.request}

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self._handle_virtual_deletion(request, instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def _handle_virtual_deletion(self, request, instance):
        user = request.user

        if user != instance.product.storekeeper.user:
            raise PermissionDenied("You are not allowed to delete this payment.")

        if not instance.is_delivered:
            raise PermissionDenied("You cannot delete this payment until the buyer confirms delivery.")

        instance.storekeeper_hidden = True

        if instance.buyer_hidden and instance.storekeeper_hidden:
            instance.delete()
        else:
            instance.save()

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
            if obj:
                serializer = self.get_serializer(obj)
                return Response(serializer.data)
            else:
                page = self.paginate_queryset(queryset)
                if page is not None:
                    serializer = self.get_serializer(page, many=True)
                    return self.get_paginated_response(serializer.data)
                serializer = self.get_serializer(queryset, many=True)
                return Response(serializer.data)

        elif request.method in ['PUT', 'PATCH']:
            serializer = self.get_serializer(obj, data=request.data, partial=(request.method == 'PATCH'))
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

        elif request.method == 'DELETE':
            if obj is None:
                raise MethodNotAllowed("DELETE", detail="You must specify an index to delete a single item.")
            self._handle_virtual_deletion(request, obj)
            return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, url_path=r'product/(?P<product_id>null|\d+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_product(self, request, product_id=None, index=None):
        if product_id == 'null':
            queryset = self.get_queryset().filter(product__isnull=True)
        else:
            try:
                product_id = int(product_id)
                queryset = self.get_queryset().filter(product_id=product_id)
            except ValueError:
                raise Http404("Invalid product ID.")
        return self._handle_filtered_request(request, queryset, index, label="store payment")

    @action(detail=False, url_path=r'product-name/(?P<name>[^/]+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_product_name(self, request, name=None, index=None):
        queryset = self.get_queryset().filter(product_name__iexact=name.strip())
        return self._handle_filtered_request(request, queryset, index, label="product name")

    @action(detail=False, url_path=r'buyer/(?P<username>[\w.@+-]+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_buyer(self, request, username=None, index=None):
        if not username:
            raise Http404("Username is required.")

        queryset = self.get_queryset().filter(cart__user__username=username)
        return self._handle_filtered_request(request, queryset, index, label="buyer payment")

    @action(detail=False, url_path=r'storekeeper-delivery/(?P<is_sent>true|false)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_storekeeper_delivery(self, request, is_sent=None, index=None):
        value = is_sent.lower() == 'true'

        filtered_ids = [
            pp.id for pp in self.get_queryset()
            if StoreRelatedPaymentSerializer(pp, context=self.get_serializer_context()).data.get('storekeeper_delivery') == value
        ]

        queryset = self.get_queryset().filter(id__in=filtered_ids)
        return self._handle_filtered_request(request, queryset, index, label="storekeeper delivery status")

    @action(detail=False, url_path=r'buyer-delivery/(?P<is_delivered>true|false)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_buyer_delivery(self, request, is_delivered=None, index=None):
        value = is_delivered.lower() == 'true'
        queryset = self.get_queryset().filter(is_delivered=value)
        return self._handle_filtered_request(request, queryset, index, label="buyer delivery status")

    @action(detail=False, url_path=r'storekeeper/(?P<storekeeper_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_storekeeper(self, request, storekeeper_id=None, index=None):
        try:
            storekeeper_id = int(storekeeper_id)
        except ValueError:
            raise Http404("Invalid storekeeper ID.")

        queryset = self.get_queryset().filter(storekeeper_id=storekeeper_id)
        return self._handle_filtered_request(request, queryset, index, label="storekeeper payment")

    @action(detail=False, url_path=r'buyer-not-delivery/(?P<value>true|false)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def buyer_not_delivery(self, request, value=None, index=None):
        delivery_qs = ProductDeliveryStatus.objects.filter(payment=OuterRef('pk'))
        queryset = self.get_queryset().annotate(
            storekeeper_delivery=Exists(delivery_qs.filter(is_sent=True)),
            is_sent=Subquery(delivery_qs.values('is_sent')[:1])
        )

        if value.lower() == 'true':
            queryset = queryset.filter(is_delivered=True)
        else:
            queryset = queryset.filter(storekeeper_delivery=True, is_delivered=False)

        return self._handle_filtered_request(request, queryset, index, label="buyer-not-delivery payment")

    @action(detail=False, methods=['get'], url_path='delivery-summary')
    def delivery_summary(self, request):
        delivery_qs = ProductDeliveryStatus.objects.filter(payment=OuterRef('pk'))
        queryset = self.get_queryset().annotate(
            storekeeper_delivery=Exists(delivery_qs.filter(is_sent=True)),
            is_sent=Subquery(delivery_qs.values('is_sent')[:1])
        )

        pending_count = queryset.filter(storekeeper_delivery=False).count()
        shipped_count = queryset.filter(storekeeper_delivery=True, is_delivered=False).count()
        delivered_count = queryset.filter(is_delivered=True).count()

        total_amount = queryset.aggregate(total=Sum('total_price'))['total'] or 0

        data = {
            "pending": pending_count,
            "shipped": shipped_count,
            "delivered": delivered_count,
            "amount": total_amount
        }
        return Response(data)

class UserActivitySummaryViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        serializer = UserActivitySummarySerializer({}, context={'request': request})
        return Response(serializer.data)

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        refresh_token = response.data.get('refresh')

        response.data.pop('refresh', None)

        response.set_cookie(
            key='refresh_token',
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite='None',
            max_age=10 * 24 * 60 * 60
        )

        return response

class RefreshAccessTokenView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            return Response({'detail': 'Refresh token not found.'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            refresh = RefreshToken(refresh_token)
            new_access = str(refresh.access_token)
            new_refresh = str(refresh)

            response = Response({'access': new_access})

            response.set_cookie(
                key='refresh_token',
                value=new_refresh,
                httponly=True,
                secure=True,
                samesite='None',
                max_age=10 * 24 * 60 * 60
            )

            return response

        except TokenError:
            return Response({'detail': 'Invalid or expired refresh token.'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            return Response({'detail': 'Refresh token not found.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()

            response = Response({'detail': 'Logout successful.'}, status=status.HTTP_200_OK)

            response.delete_cookie('refresh_token')

            return response

        except TokenError:
            return Response({'detail': 'Invalid or expired refresh token.'}, status=status.HTTP_400_BAD_REQUEST)
