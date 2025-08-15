from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.http import Http404
from django.db.models import Q
from rest_framework import viewsets, status
from rest_framework.exceptions import ValidationError, MethodNotAllowed
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter
from .models import StoreKeeper, Images, Features, FrequentlyAskedQuestions, ProductDeliveryStatus
from cart.models import ProductPayment
from .serializers import (
    UserSerializer,
    StoreKeeperSerializer,
    StoreImageSerializer,
    StoreFeatureSerializer,
    StoreFAQSerializer,
    StoreKeeperReadOnlySerializer,
    DeliveryStatusSerializer,
    StoreRelatedPaymentSerializer)

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def get_object(self):
        lookup_value = self.kwargs.get('pk')
        if lookup_value.isdigit():
            return get_object_or_404(User, id=lookup_value)
        return get_object_or_404(User, username=lookup_value)

    def create(self, request, *args, **kwargs):
        username = request.data.get('username')
        if User.objects.filter(username=username).exists():
            raise ValidationError({'username': 'This username is already registered.'})
        return super().create(request, *args, **kwargs)

class StoreKeeperViewSet(viewsets.ModelViewSet):
    queryset = StoreKeeper.objects.all().order_by('-created_time')
    serializer_class = StoreKeeperSerializer
    lookup_field = 'pk'

    def get_object(self):
        lookup_value = self.kwargs.get(self.lookup_field)
        if lookup_value.isdigit():
            try:
                return StoreKeeper.objects.get(id=lookup_value)
            except StoreKeeper.DoesNotExist:
                pass
        try:
            return StoreKeeper.objects.get(store_name=lookup_value)
        except StoreKeeper.DoesNotExist:
            raise Http404("StoreKeeper not found.")

    @action(detail=False, url_path='user/(?P<user_id>[^/.]+)', methods=['get', 'put', 'patch', 'delete'])
    def by_user(self, request, user_id=None):
        try:
            store = StoreKeeper.objects.get(user_id=user_id)
        except StoreKeeper.DoesNotExist:
            raise Http404("StoreKeeper with this user not found.")

        if request.method == 'GET':
            serializer = self.get_serializer(store)
            return Response(serializer.data)

        elif request.method in ['PUT', 'PATCH']:
            serializer = self.get_serializer(store, data=request.data, partial=(request.method == 'PATCH'))
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

        elif request.method == 'DELETE':
            store.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

class StoreImageViewSet(viewsets.ModelViewSet):
    queryset = Images.objects.all()
    serializer_class = StoreImageSerializer
    lookup_field = 'pk'

    @action(detail=False, url_path=r'storekeeper/(?P<storekeeper_id>[^/.]+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def storekeeper(self, request, storekeeper_id=None, index=None):
        try:
            store = StoreKeeper.objects.get(id=storekeeper_id)
        except StoreKeeper.DoesNotExist:
            raise Http404("StoreKeeper not found.")

        images = Images.objects.filter(storekeeper=store).order_by('-id')
        if not images.exists():
            raise Http404("No images found for this storekeeper.")

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

class StoreFeatureViewSet(viewsets.ModelViewSet):
    queryset = Features.objects.all()
    serializer_class = StoreFeatureSerializer
    lookup_field = 'pk'

    @action(detail=False, url_path=r'storekeeper/(?P<storekeeper_id>[^/.]+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def storekeeper(self, request, storekeeper_id=None, index=None):
        try:
            store = StoreKeeper.objects.get(id=storekeeper_id)
        except StoreKeeper.DoesNotExist:
            raise Http404("StoreKeeper not found.")

        features = Features.objects.filter(storekeeper=store).order_by('-id')
        if not features.exists():
            raise Http404("No features found for this storekeeper.")

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

class StoreFAQViewSet(viewsets.ModelViewSet):
    queryset = FrequentlyAskedQuestions.objects.all()
    serializer_class = StoreFAQSerializer
    lookup_field = 'pk'

    @action(detail=False, url_path=r'storekeeper/(?P<storekeeper_id>[^/.]+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def storekeeper(self, request, storekeeper_id=None, index=None):
        try:
            store = StoreKeeper.objects.get(id=storekeeper_id)
        except StoreKeeper.DoesNotExist:
            raise Http404("StoreKeeper not found.")

        faqs = FrequentlyAskedQuestions.objects.filter(storekeeper=store).order_by('-id')
        if not faqs.exists():
            raise Http404("No FAQs found for this storekeeper.")

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

class StoreKeeperReadOnlyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = StoreKeeper.objects.all()
    serializer_class = StoreKeeperReadOnlySerializer
    filter_backends = [SearchFilter]
    search_fields = ['store_name', 'description']

class ProductDeliveryStatusViewSet(viewsets.ModelViewSet):
    queryset = ProductDeliveryStatus.objects.all()
    serializer_class = DeliveryStatusSerializer

    @action(detail=False, url_path='payment/(?P<payment_id>\d+)', methods=['get', 'put', 'patch', 'delete'])
    def by_payment(self, request, payment_id=None):
        try:
            delivery = ProductDeliveryStatus.objects.get(payment_id=payment_id)
        except ProductDeliveryStatus.DoesNotExist:
            raise Http404("No delivery status found for this payment.")

        if request.method == 'GET':
            serializer = self.get_serializer(delivery)
            return Response(serializer.data)

        elif request.method in ['PUT', 'PATCH']:
            serializer = self.get_serializer(delivery, data=request.data, partial=(request.method == 'PATCH'))
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

        elif request.method == 'DELETE':
            delivery.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

    def _handle_filtered_request(self, request, deliveries, index):
        deliveries = deliveries.order_by('-id')
        if not deliveries.exists():
            raise Http404("No delivery statuses found.")

        if not index and request.method != 'GET':
            raise MethodNotAllowed(request.method, detail="Only GET is allowed in list mode.")

        if index:
            try:
                index = int(index)
                if index < 1 or index > deliveries.count():
                    raise Http404("Invalid index.")
                delivery = deliveries[index - 1]
            except ValueError:
                raise Http404("Index must be a number.")
        else:
            delivery = None

        if request.method == 'GET':
            if index:
                serializer = self.get_serializer(delivery)
                return Response(serializer.data)
            else:
                serializer = self.get_serializer(deliveries, many=True)
                return Response(serializer.data)

        elif request.method in ['PUT', 'PATCH']:
            serializer = self.get_serializer(delivery, data=request.data, partial=(request.method == 'PATCH'))
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

        elif request.method == 'DELETE':
            delivery.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, url_path='is-sent/(?P<is_sent>true|false)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_status(self, request, is_sent=None, index=None):
        value = is_sent.lower() == 'true'
        deliveries = ProductDeliveryStatus.objects.filter(is_sent=value)
        return self._handle_filtered_request(request, deliveries, index)

class StorePaymentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = StoreRelatedPaymentSerializer

    def get_queryset(self):
        return ProductPayment.objects.filter(
            is_successful=True
        ).filter(
            Q(delivery_status__isnull=True) | Q(delivery_status__is_sent=False)
        )

    def _handle_filtered_request(self, request, payments, index):
        payments = payments.order_by('-id')
        if not payments.exists():
            raise Http404("No matching payments found.")

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

    @action(detail=False, url_path=r'product/(?P<product_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_product(self, request, product_id=None, index=None):
        payments = self.get_queryset().filter(product__id=product_id)
        return self._handle_filtered_request(request, payments, index)

    @action(detail=False, url_path=r'storekeeper/(?P<storekeeper_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_storekeeper(self, request, storekeeper_id=None, index=None):
        payments = self.get_queryset().filter(product__storekeeper_id=storekeeper_id)
        return self._handle_filtered_request(request, payments, index)

    @action(detail=False, url_path=r'user/(?P<user_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_user(self, request, user_id=None, index=None):
        payments = self.get_queryset().filter(cart__user_id=user_id)
        return self._handle_filtered_request(request, payments, index)
