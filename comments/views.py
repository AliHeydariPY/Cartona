from django.http import Http404
from django.db.models import Q, OuterRef, Subquery, Exists
from django.contrib.auth.models import User
from django_filters import rest_framework as filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, mixins, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.exceptions import MethodNotAllowed, ValidationError, PermissionDenied
from rest_framework.response import Response
from .models import (Comment, CommentReply, ProductQuestion, ProductPurchase,
    PurchaseChat, StoreNotificationSubscription, Notification)
from user.models import ProductDeliveryStatus

from .serializers import (CommentSerializer, CommentReplySerializer,
    ProductQuestionSerializer, ProductPurchaseSerializer, PurchaseChatSerializer,
    StoreNotificationSubscriptionSerializer, NotificationSerializer)

class CommentFilter(filters.FilterSet):
    min_rating = filters.CharFilter(method='filter_min_rating', label='Minimum Rating')
    max_rating = filters.CharFilter(method='filter_max_rating', label='Maximum Rating')

    def filter_min_rating(self, queryset, name, value):
        max_rating_value = self.data.get('max_rating')

        if value == 'null':
            if max_rating_value and max_rating_value != 'null':
                try:
                    max_rating = float(max_rating_value)
                    if not (1.0 <= max_rating <= 5.0):
                        raise ValidationError("max_rating must be between 1.0 and 5.0.")
                    return queryset.filter(Q(rating__isnull=True) | Q(rating__lte=max_rating))
                except ValueError:
                    raise ValidationError("max_rating must be a number or 'null'.")
            else:
                return queryset.filter(rating__isnull=True)

        try:
            min_rating = float(value)
            if not (1.0 <= min_rating <= 5.0):
                raise ValidationError("min_rating must be between 1.0 and 5.0.")
            if max_rating_value and max_rating_value != 'null':
                try:
                    max_rating = float(max_rating_value)
                    if not (1.0 <= max_rating <= 5.0):
                        raise ValidationError("max_rating must be between 1.0 and 5.0.")
                    return queryset.filter(rating__gte=min_rating, rating__lte=max_rating)
                except ValueError:
                    raise ValidationError("max_rating must be a number or 'null'.")
            return queryset.filter(rating__gte=min_rating)
        except ValueError:
            raise ValidationError("min_rating must be a number or 'null'.")

    def filter_max_rating(self, queryset, name, value):
        min_rating_value = self.data.get('min_rating')
        if min_rating_value:
            return queryset

        if value == 'null':
            return queryset.filter(rating__isnull=True)

        try:
            max_rating = float(value)
            if not (1.0 <= max_rating <= 5.0):
                raise ValidationError("max_rating must be between 1.0 and 5.0.")
            return queryset.filter(rating__lte=max_rating)
        except ValueError:
            raise ValidationError("max_rating must be a number or 'null'.")

    class Meta:
        model = Comment
        fields = ['min_rating', 'max_rating']

class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = CommentFilter

    def get_permissions(self):
        if self.request.method in ['GET', 'HEAD', 'OPTIONS']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        queryset = Comment.objects.all() if self.request.method in ['GET', 'HEAD', 'OPTIONS'] else Comment.objects.filter(
            user=self.request.user)
        return queryset.order_by('-updated_time')

    def get_serializer_context(self):
        return {"request": self.request}

    def _handle_filtered_request(self, request, queryset, index, label="comment"):
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

    @action(detail=False, url_path=r'product/(?P<product_id>\d+)(?:/(?P<index>\d+))?',
            methods=['get', 'put', 'patch', 'delete'])
    def by_product(self, request, product_id=None, index=None):
        base_queryset = self.get_queryset().filter(product_id=product_id)

        filterset = self.filterset_class(data=request.query_params, queryset=base_queryset, request=request)
        if not filterset.is_valid():
            raise ValidationError(filterset.errors)
        filtered_queryset = filterset.qs

        return self._handle_filtered_request(request, filtered_queryset, index, label="product comment")

class CommentReplyViewSet(viewsets.ModelViewSet):
    serializer_class = CommentReplySerializer

    def get_permissions(self):
        if self.request.method in ['GET', 'HEAD', 'OPTIONS']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        queryset = CommentReply.objects.all() if self.request.method in ['GET', 'HEAD', 'OPTIONS'] else CommentReply.objects.filter(
            user=self.request.user)
        return queryset.order_by('-updated_time')

    def get_serializer_context(self):
        return {"request": self.request}

    def _handle_filtered_request(self, request, queryset, index, label="reply"):
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

    @action(detail=False, url_path=r'comment/(?P<comment_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_comment(self, request, comment_id=None, index=None):
        queryset = self.get_queryset().filter(comment_id=comment_id)
        return self._handle_filtered_request(request, queryset, index, label="comment reply")

class ProductQuestionViewSet(viewsets.ModelViewSet):
    serializer_class = ProductQuestionSerializer

    def get_permissions(self):
        if self.request.method in ['GET', 'HEAD', 'OPTIONS']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        queryset = ProductQuestion.objects.all() if self.request.method in ['GET', 'HEAD', 'OPTIONS'] else ProductQuestion.objects.filter(
            Q(user=user) | Q(product__storekeeper__user=user)
        )
        return queryset.order_by('-updated_time')

    def get_serializer_context(self):
        return {"request": self.request}

    def _handle_filtered_request(self, request, queryset, index, label="product question"):
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
        queryset = self.get_queryset().filter(product_id=product_id)
        return self._handle_filtered_request(request, queryset, index, label="product question")

class ProductPurchaseViewSet(
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    mixins.DestroyModelMixin,
    mixins.CreateModelMixin,
    viewsets.GenericViewSet
):
    serializer_class = ProductPurchaseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return ProductPurchase.objects.none()

        return ProductPurchase.objects.filter(
            Q(buyer=user) | Q(storekeeper__user=user)
        ).order_by('-id')

    def get_serializer_context(self):
        return {"request": self.request}

    def _handle_filtered_request(self, request, queryset, index, label="purchase"):
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
        queryset = self.get_queryset().filter(product_id=product_id)
        return self._handle_filtered_request(request, queryset, index, label="product purchase")

    @action(detail=False, url_path=r'payment/(?P<payment_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_payment(self, request, payment_id=None, index=None):
        queryset = self.get_queryset().filter(payment_id=payment_id)
        return self._handle_filtered_request(request, queryset, index, label="payment purchase")

    @action(detail=False, url_path=r'chat-enabled/(?P<enabled>true|false)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_chat_enabled(self, request, enabled=None, index=None):
        value = enabled.lower() == 'true'
        queryset = self.get_queryset().filter(chat_enabled=value)
        return self._handle_filtered_request(request, queryset, index, label="chat-enabled purchase")

    @action(detail=False, url_path=r'storekeeper-delivery/(?P<sent>true|false)(?:/(?P<index>\d+))?',
            methods=['get', 'put', 'patch', 'delete'])
    def by_storekeeper_delivery(self, request, sent=None, index=None):
        value = sent.lower() == 'true'
        delivery_qs = ProductDeliveryStatus.objects.filter(payment=OuterRef('payment'))
        queryset = self.get_queryset().annotate(
            has_delivery=Exists(delivery_qs),
            is_sent=Subquery(delivery_qs.values('is_sent')[:1])
        )
        if value:
            queryset = queryset.filter(is_sent=True)
        else:
            queryset = queryset.filter(Q(has_delivery=False) | Q(is_sent=False))
        return self._handle_filtered_request(request, queryset, index, label="storekeeper delivery")

    @action(detail=False, url_path=r'buyer-delivery/(?P<delivered>true|false)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_buyer_delivery(self, request, delivered=None, index=None):
        value = delivered.lower() == 'true'
        queryset = self.get_queryset().filter(payment__is_delivered=value)
        return self._handle_filtered_request(request, queryset, index, label="buyer delivery")

class PurchaseChatViewSet(viewsets.ModelViewSet):
    serializer_class = PurchaseChatSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        user_purchases = ProductPurchase.objects.filter(
            Q(buyer=user) | Q(product__storekeeper__user=user)
        ).values_list("id", flat=True)

        return PurchaseChat.objects.filter(purchase_id__in=user_purchases).order_by('-edited_at')

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user

        if user != instance.sender:
            raise PermissionDenied("You can only delete your own messages.")

        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def _handle_filtered_request(self, request, chats, index):
        chats = chats.order_by('-id')

        if not chats.exists():
            raise Http404("No chats found.")

        if not index and request.method != 'GET':
            raise MethodNotAllowed(request.method, detail="Only GET is allowed in list mode.")

        if index:
            try:
                index = int(index)
                if index < 1 or index > chats.count():
                    raise Http404("Invalid index.")
                chat = chats[index - 1]
            except ValueError:
                raise Http404("Index must be a number.")
        else:
            chat = None

        if request.method == 'GET':
            serializer = self.get_serializer(chat if index else chats, many=not index)
            return Response(serializer.data)

        elif request.method in ['PUT', 'PATCH']:
            serializer = self.get_serializer(chat, data=request.data, partial=(request.method == 'PATCH'))
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

        elif request.method == 'DELETE':
            chat.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, url_path=r'purchase/(?P<purchase_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_purchase(self, request, purchase_id=None, index=None):
        chats = self.get_queryset().filter(purchase_id=purchase_id)
        return self._handle_filtered_request(request, chats, index)

    @action(detail=False, url_path=r'sender/(?P<username>[^/]+)(?:/(?P<index>\d+))?',
            methods=['get', 'put', 'patch', 'delete'])
    def by_sender(self, request, username=None, index=None):
        try:
            sender = User.objects.get(username=username)
        except User.DoesNotExist:
            raise Http404("User with this username does not exist.")

        chats = self.get_queryset().filter(sender=sender)
        return self._handle_filtered_request(request, chats, index)

class StoreNotificationSubscriptionViewSet(
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    mixins.DestroyModelMixin,
    mixins.CreateModelMixin,
    viewsets.GenericViewSet
):
    serializer_class = StoreNotificationSubscriptionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return StoreNotificationSubscription.objects.filter(user=self.request.user).order_by('-id')

class NotificationViewSet(
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    mixins.DestroyModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet
):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-id')

    def _handle_filtered_request(self, request, queryset, index, label="notification"):
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

    @action(detail=False, url_path=r'product/(?P<product_id>\d+)(?:/(?P<index>\d+))?',
            methods=['get', 'put', 'patch', 'delete'])
    def by_product(self, request, product_id=None, index=None):
        queryset = self.get_queryset().filter(product_id=product_id)
        return self._handle_filtered_request(request, queryset, index, label="product notification")

    @action(detail=False, url_path=r'storekeeper/(?P<storekeeper_id>\d+)(?:/(?P<index>\d+))?',
            methods=['get', 'put', 'patch', 'delete'])
    def by_storekeeper(self, request, storekeeper_id=None, index=None):
        queryset = self.get_queryset().filter(storekeeper_id=storekeeper_id)
        return self._handle_filtered_request(request, queryset, index, label="storekeeper notification")

    @action(detail=False, url_path=r'is-read/(?P<is_read>true|false)(?:/(?P<index>\d+))?',
            methods=['get', 'put', 'patch', 'delete'])
    def by_is_read(self, request, is_read=None, index=None):
        value = is_read.lower() == 'true'
        queryset = self.get_queryset().filter(is_read=value)
        return self._handle_filtered_request(request, queryset, index, label="read-status notification")

    @action(detail=False, url_path=r'notification/(?P<notification_id>\d+)(?:/(?P<index>\d+))?',
            methods=['get', 'put', 'patch', 'delete'])
    def by_notification(self, request, notification_id=None, index=None):
        queryset = self.get_queryset().filter(id=notification_id)
        return self._handle_filtered_request(request, queryset, index, label="notification")
