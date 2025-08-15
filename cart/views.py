from django.http import Http404
from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from rest_framework.exceptions import MethodNotAllowed
from rest_framework.response import Response
from .models import Cart, CartItem, Payment, ProductPayment
from .serializers import (CartItemSerializer, CartSerializer,
    PaymentSerializer, ProductPaymentSerializer)

class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    queryset = CartItem.objects.all()

    def get_queryset(self):
        return CartItem.objects.all()

    def _handle_filtered_request(self, request, items, index):
        items = items.order_by('-id')
        if not items.exists():
            raise Http404("No cart items found.")

        if not index and request.method != 'GET':
            raise MethodNotAllowed(request.method, detail="Only GET is allowed in list mode.")

        if index:
            try:
                index = int(index)
                if index < 1 or index > items.count():
                    raise Http404("Invalid index.")
                item = items[index - 1]
            except ValueError:
                raise Http404("Index must be a number.")
        else:
            item = None

        if request.method == 'GET':
            if index:
                serializer = self.get_serializer(item)
                return Response(serializer.data)
            else:
                serializer = self.get_serializer(items, many=True)
                return Response(serializer.data)

        elif request.method in ['PUT', 'PATCH']:
            serializer = self.get_serializer(item, data=request.data, partial=(request.method == 'PATCH'))
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

        elif request.method == 'DELETE':
            item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, url_path='cart/(?P<cart_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_cart(self, request, cart_id=None, index=None):
        items = CartItem.objects.filter(cart_id=cart_id)
        return self._handle_filtered_request(request, items, index)

    @action(detail=False, url_path='product/(?P<product_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_product(self, request, product_id=None, index=None):
        items = CartItem.objects.filter(product_id=product_id)
        return self._handle_filtered_request(request, items, index)

class CartViewSet(mixins.CreateModelMixin,
                  mixins.RetrieveModelMixin,
                  mixins.ListModelMixin,
                  mixins.DestroyModelMixin,
                  viewsets.GenericViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer

    @action(detail=False, url_path='user/(?P<user_id>\d+)', methods=['get', 'post'])
    def by_user(self, request, user_id=None):
        try:
            cart = Cart.objects.get(user_id=user_id)
        except Cart.DoesNotExist:
            if request.method == 'GET':
                raise Http404("Cart not found for this user.")
            cart = None

        if request.method == 'GET':
            serializer = self.get_serializer(cart)
            return Response(serializer.data)

        elif request.method == 'POST':
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

    def _handle_filtered_request(self, request, payments, index):
        payments = payments.order_by('-id')
        if not payments.exists():
            raise Http404("No payments found.")

        if not index and request.method != 'GET':
            raise MethodNotAllowed(request.method, detail="Only GET is allowed in list mode.")

        if index:
            try:
                index = int(index)
                if index < 1 or index > payments.count():
                    raise Http404("Invalid index.")
                payment = payments[index - 1]
            except ValueError:
                raise Http404("Index must be a number.")
        else:
            payment = None

        if request.method == 'GET':
            if index:
                serializer = self.get_serializer(payment)
                return Response(serializer.data)
            else:
                serializer = self.get_serializer(payments, many=True)
                return Response(serializer.data)

        elif request.method in ['PUT', 'PATCH']:
            serializer = self.get_serializer(payment, data=request.data, partial=(request.method == 'PATCH'))
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

        elif request.method == 'DELETE':
            payment.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, url_path='cart/(?P<cart_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_cart(self, request, cart_id=None, index=None):
        payments = Payment.objects.filter(cart_id=cart_id)
        return self._handle_filtered_request(request, payments, index)

    @action(detail=False, url_path='is-successful/(?P<is_successful>true|false)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_status(self, request, is_successful=None, index=None):
        value = is_successful.lower() == 'true'
        payments = Payment.objects.filter(is_successful=value)
        return self._handle_filtered_request(request, payments, index)

class ProductPaymentViewSet(viewsets.ModelViewSet):
    queryset = ProductPayment.objects.all()
    serializer_class = ProductPaymentSerializer

    def _handle_filtered_request(self, request, payments, index):
        payments = payments.order_by('-id')
        if not payments.exists():
            raise Http404("No product payments found.")

        if not index and request.method != 'GET':
            raise MethodNotAllowed(request.method, detail="Only GET is allowed in list mode.")

        if index:
            try:
                index = int(index)
                if index < 1 or index > payments.count():
                    raise Http404("Invalid index.")
                payment = payments[index - 1]
            except ValueError:
                raise Http404("Index must be a number.")
        else:
            payment = None

        if request.method == 'GET':
            if index:
                serializer = self.get_serializer(payment)
                return Response(serializer.data)
            else:
                serializer = self.get_serializer(payments, many=True)
                return Response(serializer.data)

        elif request.method in ['PUT', 'PATCH']:
            serializer = self.get_serializer(payment, data=request.data, partial=(request.method == 'PATCH'))
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

        elif request.method == 'DELETE':
            payment.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, url_path='cart/(?P<cart_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_cart(self, request, cart_id=None, index=None):
        payments = ProductPayment.objects.filter(cart_id=cart_id)
        return self._handle_filtered_request(request, payments, index)

    @action(detail=False, url_path='product/(?P<product_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_product(self, request, product_id=None, index=None):
        payments = ProductPayment.objects.filter(product_id=product_id)
        return self._handle_filtered_request(request, payments, index)

    @action(detail=False, url_path='cart-item/(?P<cart_item_id>[^/]+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_cart_item(self, request, cart_item_id=None, index=None):
        if cart_item_id == 'null':
            payments = ProductPayment.objects.filter(cart_item__isnull=True)
        else:
            try:
                cart_item_id = int(cart_item_id)
                payments = ProductPayment.objects.filter(cart_item_id=cart_item_id)
            except ValueError:
                raise Http404("Invalid cart_item_id.")
        return self._handle_filtered_request(request, payments, index)

    @action(detail=False, url_path='is-successful/(?P<is_successful>true|false)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_status(self, request, is_successful=None, index=None):
        value = is_successful.lower() == 'true'
        payments = ProductPayment.objects.filter(is_successful=value)
        return self._handle_filtered_request(request, payments, index)
