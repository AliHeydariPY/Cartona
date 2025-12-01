from django.http import Http404
from rest_framework import viewsets, mixins, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.exceptions import MethodNotAllowed, PermissionDenied, NotFound
from rest_framework.response import Response
from .models import Cart, CartItem, Payment, ProductPayment, Favorite, FavoriteItem
from .serializers import (CartItemSerializer, CartSerializer,
    PaymentSerializer, ProductPaymentSerializer, FavoriteSerializer, FavoriteItemSerializer)

class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        user = self.request.user
        try:
            cart = Cart.objects.get(user=user)
        except Cart.DoesNotExist:
            return CartItem.objects.none()
        return CartItem.objects.filter(cart=cart).order_by('-id')

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if ProductPayment.objects.filter(cart_item=instance).exists():
            raise PermissionDenied("This cart item has already been paid for and cannot be deleted.")
        return super().destroy(request, *args, **kwargs)

    @action(detail=False, methods=['get', 'put', 'patch', 'delete'], url_path=r'product/(?P<product_id>\d+)')
    def by_product(self, request, product_id=None):
        try:
            item = self.get_queryset().get(product_id=product_id)
        except CartItem.DoesNotExist:
            raise NotFound("Cart item not found for this product.")

        if request.method == 'GET':
            serializer = self.get_serializer(item)
            return Response(serializer.data)

        elif request.method == 'PUT':
            serializer = self.get_serializer(item, data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)

        elif request.method == 'PATCH':
            serializer = self.get_serializer(item, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)

        elif request.method == 'DELETE':
            if ProductPayment.objects.filter(cart_item=item).exists():
                raise PermissionDenied("This cart item has already been paid for and cannot be deleted.")
            self.perform_destroy(item)
            return Response(status=status.HTTP_204_NO_CONTENT)

class CartViewSet(
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

class FavoriteItemViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        try:
            favorite = Favorite.objects.get(user=user)
        except Favorite.DoesNotExist:
            return FavoriteItem.objects.none()
        return FavoriteItem.objects.filter(favorite=favorite).order_by('-id')

    @action(detail=False, methods=['get', 'put', 'patch', 'delete'], url_path=r'product/(?P<product_id>\d+)')
    def by_product(self, request, product_id=None):
        try:
            item = self.get_queryset().get(product_id=product_id)
        except FavoriteItem.DoesNotExist:
            raise NotFound("Favorite item not found for this product.")

        if request.method == 'GET':
            serializer = self.get_serializer(item)
            return Response(serializer.data)

        elif request.method == 'PUT':
            serializer = self.get_serializer(item, data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)

        elif request.method == 'PATCH':
            serializer = self.get_serializer(item, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)

        elif request.method == 'DELETE':
            self.perform_destroy(item)
            return Response(status=status.HTTP_204_NO_CONTENT)

class FavoriteViewSet(
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return Payment.objects.filter(cart__user=self.request.user).order_by('-paid_at')

    def get_serializer_context(self):
        return {"request": self.request}

    def _handle_filtered_request(self, request, queryset, index, label="payment"):
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

    @action(detail=False, url_path=r'is-successful/(?P<value>true|false)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_successful(self, request, value=None, index=None):
        is_successful = value.lower() == 'true'
        queryset = self.get_queryset().filter(is_successful=is_successful)
        return self._handle_filtered_request(request, queryset, index, label="successful payment")

class ProductPaymentViewSet(viewsets.ModelViewSet):
    serializer_class = ProductPaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ProductPayment.objects.filter(cart__user=self.request.user, buyer_hidden=False).order_by('-paid_at')

    def get_serializer_context(self):
        return {"request": self.request}

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if not instance.is_successful:
            serializer = self.get_serializer(instance)
            serializer.perform_delete(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)

        if not instance.is_delivered:
            raise PermissionDenied("You cannot delete this payment until the product is delivered.")

        instance.buyer_hidden = True

        if instance.storekeeper_hidden and instance.buyer_hidden:
            instance.delete()
        else:
            instance.save()

        return Response(status=status.HTTP_204_NO_CONTENT)

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

            if not obj.is_successful:
                serializer = self.get_serializer(obj)
                serializer.perform_delete(obj)
                return Response(status=status.HTTP_204_NO_CONTENT)

            if not obj.is_delivered:
                raise PermissionDenied("You cannot delete this payment until the product is delivered.")

            obj.buyer_hidden = True

            if obj.storekeeper_hidden and obj.buyer_hidden:
                obj.delete()
            else:
                obj.save()

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

        return self._handle_filtered_request(request, queryset, index, label="product payment")

    @action(detail=False, url_path=r'product-name/(?P<name>[^/]+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_product_name(self, request, name=None, index=None):
        queryset = self.get_queryset().filter(product_name__iexact=name.strip())
        return self._handle_filtered_request(request, queryset, index, label="product name")

    @action(detail=False, url_path=r'is-delivered/(?P<is_delivered>true|false)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_delivery_status(self, request, is_delivered=None, index=None):
        value = is_delivered.lower() == 'true'
        queryset = self.get_queryset().filter(is_delivered=value)
        return self._handle_filtered_request(request, queryset, index, label="delivery status")

    @action(detail=False, url_path=r'is-successful/(?P<is_successful>true|false)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_success_status(self, request, is_successful=None, index=None):
        value = is_successful.lower() == 'true'
        queryset = self.get_queryset().filter(is_successful=value)
        return self._handle_filtered_request(request, queryset, index, label="success status")

    @action(detail=False, url_path=r'cart-item/(?P<cart_item_id>null|\d+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_cart_item(self, request, cart_item_id=None, index=None):
        if cart_item_id == 'null':
            queryset = self.get_queryset().filter(cart_item__isnull=True)
        else:
            try:
                cart_item_id = int(cart_item_id)
                queryset = self.get_queryset().filter(cart_item_id=cart_item_id)
            except ValueError:
                raise Http404("Invalid cart item ID.")

        return self._handle_filtered_request(request, queryset, index, label="cart item")

    @action(detail=False, url_path=r'storekeeper-delivery/(?P<is_sent>true|false)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_storekeeper_delivery(self, request, is_sent=None, index=None):
        value = is_sent.lower() == 'true'

        filtered_ids = [
            pp.id for pp in self.get_queryset()
            if ProductPaymentSerializer(pp, context=self.get_serializer_context()).data.get('storekeeper_delivery') == value
        ]

        queryset = self.get_queryset().filter(id__in=filtered_ids)
        return self._handle_filtered_request(request, queryset, index, label="storekeeper delivery status")

    @action(detail=False, url_path=r'storekeeper/(?P<storekeeper_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_storekeeper(self, request, storekeeper_id=None, index=None):
        try:
            storekeeper_id = int(storekeeper_id)
            queryset = self.get_queryset().filter(storekeeper_id=storekeeper_id)
        except ValueError:
            raise Http404("Invalid storekeeper ID.")

        return self._handle_filtered_request(request, queryset, index, label="storekeeper")

