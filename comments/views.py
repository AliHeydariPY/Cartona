from django.http import Http404
from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from rest_framework.exceptions import MethodNotAllowed
from rest_framework.response import Response
from .models import (Comment, CommentReply, ProductQuestion, ProductPurchase,
    PurchaseChat, StoreNotificationSubscription, Notification)

from .serializers import (CommentSerializer, CommentReplySerializer,
    ProductQuestionSerializer, ProductPurchaseSerializer, PurchaseChatSerializer,
    StoreNotificationSubscriptionSerializer, NotificationSerializer)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def _handle_filtered_request(self, request, comments, index):
        comments = comments.order_by('-id')
        if not comments.exists():
            raise Http404("No comments found.")

        if not index and request.method != 'GET':
            raise MethodNotAllowed(request.method, detail="Only GET is allowed in list mode.")

        if index:
            try:
                index = int(index)
                if index < 1 or index > comments.count():
                    raise Http404("Invalid index.")
                comment = comments[index - 1]
            except ValueError:
                raise Http404("Index must be a number.")
        else:
            comment = None

        if request.method == 'GET':
            serializer = self.get_serializer(comment if index else comments, many=not index)
            return Response(serializer.data)

        elif request.method in ['PUT', 'PATCH']:
            serializer = self.get_serializer(comment, data=request.data, partial=(request.method == 'PATCH'))
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

        elif request.method == 'DELETE':
            comment.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, url_path='product/(?P<product_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_product(self, request, product_id=None, index=None):
        comments = Comment.objects.filter(product_id=product_id)
        return self._handle_filtered_request(request, comments, index)

    @action(detail=False, url_path='user/(?P<user_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_user(self, request, user_id=None, index=None):
        comments = Comment.objects.filter(user_id=user_id)
        return self._handle_filtered_request(request, comments, index)

    @action(detail=False, url_path='rating/(?P<rating>([0-9]+|null))(?:/(?P<index>\d+))?',
            methods=['get', 'put', 'patch', 'delete'])
    def by_rating(self, request, rating=None, index=None):
        if rating == 'null':
            comments = Comment.objects.filter(rating__isnull=True)
        else:
            try:
                rating_value = int(rating)
                if rating_value < 1 or rating_value > 5:
                    return Response(
                        {"detail": "Rating must be between 1 and 5 or 'null'."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                comments = Comment.objects.filter(rating=rating_value)
            except ValueError:
                return Response(
                    {"detail": "Rating must be a number between 1 and 5 or 'null'."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        return self._handle_filtered_request(request, comments, index)

class CommentReplyViewSet(viewsets.ModelViewSet):
    queryset = CommentReply.objects.all()
    serializer_class = CommentReplySerializer

    def _handle_filtered_request(self, request, replies, index):
        replies = replies.order_by('-id')
        if not replies.exists():
            raise Http404("No replies found.")

        if not index and request.method != 'GET':
            raise MethodNotAllowed(request.method, detail="Only GET is allowed in list mode.")

        if index:
            try:
                index = int(index)
                if index < 1 or index > replies.count():
                    raise Http404("Invalid index.")
                reply = replies[index - 1]
            except ValueError:
                raise Http404("Index must be a number.")
        else:
            reply = None

        if request.method == 'GET':
            if index:
                serializer = self.get_serializer(reply)
                return Response(serializer.data)
            else:
                serializer = self.get_serializer(replies, many=True)
                return Response(serializer.data)

        elif request.method in ['PUT', 'PATCH']:
            serializer = self.get_serializer(reply, data=request.data, partial=(request.method == 'PATCH'))
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

        elif request.method == 'DELETE':
            reply.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, url_path='user/(?P<user_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_user(self, request, user_id=None, index=None):
        replies = CommentReply.objects.filter(user_id=user_id)
        return self._handle_filtered_request(request, replies, index)

    @action(detail=False, url_path='comment/(?P<comment_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_comment(self, request, comment_id=None, index=None):
        replies = CommentReply.objects.filter(comment_id=comment_id)
        return self._handle_filtered_request(request, replies, index)

class ProductQuestionViewSet(viewsets.ModelViewSet):
    queryset = ProductQuestion.objects.all()
    serializer_class = ProductQuestionSerializer

    def _handle_filtered_request(self, request, questions, index):
        questions = questions.order_by('-id')
        if not questions.exists():
            raise Http404("No questions found.")

        if not index and request.method != 'GET':
            raise MethodNotAllowed(request.method, detail="Only GET is allowed in list mode.")

        if index:
            try:
                index = int(index)
                if index < 1 or index > questions.count():
                    raise Http404("Invalid index.")
                question = questions[index - 1]
            except ValueError:
                raise Http404("Index must be a number.")
        else:
            question = None

        if request.method == 'GET':
            if index:
                serializer = self.get_serializer(question)
                return Response(serializer.data)
            else:
                serializer = self.get_serializer(questions, many=True)
                return Response(serializer.data)

        elif request.method in ['PUT', 'PATCH']:
            serializer = self.get_serializer(question, data=request.data, partial=(request.method == 'PATCH'))
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

        elif request.method == 'DELETE':
            question.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, url_path='user/(?P<user_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_user(self, request, user_id=None, index=None):
        questions = ProductQuestion.objects.filter(user_id=user_id)
        return self._handle_filtered_request(request, questions, index)

    @action(detail=False, url_path='storekeeper/(?P<storekeeper_id>([0-9]+|null))(?:/(?P<index>\d+))?',
            methods=['get', 'put', 'patch', 'delete'])
    def by_storekeeper(self, request, storekeeper_id=None, index=None):
        if storekeeper_id == 'null':
            questions = ProductQuestion.objects.filter(storekeeper__isnull=True)
        else:
            try:
                storekeeper_id = int(storekeeper_id)
                questions = ProductQuestion.objects.filter(storekeeper_id=storekeeper_id)
            except ValueError:
                return Response(
                    {"detail": "Storekeeper must be a number or 'null'."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        return self._handle_filtered_request(request, questions, index)

    @action(detail=False, url_path='product/(?P<product_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_product(self, request, product_id=None, index=None):
        questions = ProductQuestion.objects.filter(product_id=product_id)
        return self._handle_filtered_request(request, questions, index)

class ProductPurchaseViewSet(mixins.RetrieveModelMixin,
                  mixins.ListModelMixin,
                  mixins.DestroyModelMixin,
                  mixins.CreateModelMixin,
                  viewsets.GenericViewSet):
    queryset = ProductPurchase.objects.all()
    serializer_class = ProductPurchaseSerializer

    def _handle_filtered_request(self, request, purchases, index):
        purchases = purchases.order_by('-id')
        if not purchases.exists():
            raise Http404("No purchases found.")

        if not index and request.method != 'GET':
            raise MethodNotAllowed(request.method, detail="Only GET is allowed in list mode.")

        if index:
            try:
                index = int(index)
                if index < 1 or index > purchases.count():
                    raise Http404("Invalid index.")
                purchase = purchases[index - 1]
            except ValueError:
                raise Http404("Index must be a number.")
        else:
            purchase = None

        if request.method == 'GET':
            if index:
                serializer = self.get_serializer(purchase)
                return Response(serializer.data)
            else:
                serializer = self.get_serializer(purchases, many=True)
                return Response(serializer.data)

        elif request.method == 'DELETE':
            purchase.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, url_path='buyer/(?P<buyer_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_buyer(self, request, buyer_id=None, index=None):
        purchases = ProductPurchase.objects.filter(buyer_id=buyer_id)
        return self._handle_filtered_request(request, purchases, index)

    @action(detail=False, url_path='storekeeper/(?P<storekeeper_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_storekeeper(self, request, storekeeper_id=None, index=None):
        purchases = ProductPurchase.objects.filter(storekeeper_id=storekeeper_id)
        return self._handle_filtered_request(request, purchases, index)

    @action(detail=False, url_path='product/(?P<product_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_product(self, request, product_id=None, index=None):
        purchases = ProductPurchase.objects.filter(product_id=product_id)
        return self._handle_filtered_request(request, purchases, index)

    @action(detail=False, url_path='payment/(?P<payment_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_payment(self, request, payment_id=None, index=None):
        purchases = ProductPurchase.objects.filter(payment_id=payment_id)
        return self._handle_filtered_request(request, purchases, index)

class PurchaseChatViewSet(viewsets.ModelViewSet):
    queryset = PurchaseChat.objects.all()
    serializer_class = PurchaseChatSerializer

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
            if index:
                serializer = self.get_serializer(chat)
                return Response(serializer.data)
            else:
                serializer = self.get_serializer(chats, many=True)
                return Response(serializer.data)

        elif request.method in ['PUT', 'PATCH']:
            serializer = self.get_serializer(chat, data=request.data, partial=(request.method == 'PATCH'))
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

        elif request.method == 'DELETE':
            chat.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, url_path='purchase/(?P<purchase_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_purchase(self, request, purchase_id=None, index=None):
        chats = PurchaseChat.objects.filter(purchase_id=purchase_id)
        return self._handle_filtered_request(request, chats, index)

    @action(detail=False, url_path='sender/(?P<sender_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'put', 'patch', 'delete'])
    def by_sender(self, request, sender_id=None, index=None):
        chats = PurchaseChat.objects.filter(sender_id=sender_id)
        return self._handle_filtered_request(request, chats, index)

class StoreNotificationSubscriptionViewSet(
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    mixins.DestroyModelMixin,
    mixins.CreateModelMixin,
    viewsets.GenericViewSet
):
    queryset = StoreNotificationSubscription.objects.all()
    serializer_class = StoreNotificationSubscriptionSerializer

    def _handle_filtered_request(self, request, subscriptions, index):
        subscriptions = subscriptions.order_by('-id')
        if not subscriptions.exists():
            raise Http404("No subscriptions found.")

        if not index and request.method != 'GET':
            raise MethodNotAllowed(request.method, detail="Only GET is allowed in list mode.")

        if index:
            try:
                index = int(index)
                if index < 1 or index > subscriptions.count():
                    raise Http404("Invalid index.")
                subscription = subscriptions[index - 1]
            except ValueError:
                raise Http404("Index must be a number.")
        else:
            subscription = None

        if request.method == 'GET':
            if index:
                serializer = self.get_serializer(subscription)
                return Response(serializer.data)
            else:
                serializer = self.get_serializer(subscriptions, many=True)
                return Response(serializer.data)

        elif request.method == 'DELETE':
            subscription.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, url_path='user/(?P<user_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'delete'])
    def by_user(self, request, user_id=None, index=None):
        subscriptions = StoreNotificationSubscription.objects.filter(user_id=user_id)
        return self._handle_filtered_request(request, subscriptions, index)

    @action(detail=False, url_path='storekeeper/(?P<storekeeper_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'delete'])
    def by_storekeeper(self, request, storekeeper_id=None, index=None):
        subscriptions = StoreNotificationSubscription.objects.filter(storekeeper_id=storekeeper_id)
        return self._handle_filtered_request(request, subscriptions, index)

class NotificationViewSet(
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet
):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

    def _handle_filtered_request(self, request, notifications, index):
        notifications = notifications.order_by('-id')
        if not notifications.exists():
            raise Http404("No notifications found.")

        if not index and request.method != 'GET':
            raise MethodNotAllowed(request.method, detail="Only GET is allowed in list mode.")

        if index:
            try:
                index = int(index)
                if index < 1 or index > notifications.count():
                    raise Http404("Invalid index.")
                notification = notifications[index - 1]
            except ValueError:
                raise Http404("Index must be a number.")
        else:
            notification = None

        if request.method == 'GET':
            if index:
                serializer = self.get_serializer(notification)
                return Response(serializer.data)
            else:
                serializer = self.get_serializer(notifications, many=True)
                return Response(serializer.data)

        elif request.method == 'DELETE':
            notification.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, url_path='user/(?P<user_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'delete'])
    def by_user(self, request, user_id=None, index=None):
        notifications = Notification.objects.filter(user_id=user_id)
        return self._handle_filtered_request(request, notifications, index)

    @action(detail=False, url_path='storekeeper-id/(?P<storekeeper_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'delete'])
    def by_storekeeper(self, request, storekeeper_id=None, index=None):
        notifications = Notification.objects.filter(storekeeper_id=storekeeper_id)
        return self._handle_filtered_request(request, notifications, index)

    @action(detail=False, url_path='product-id/(?P<product_id>\d+)(?:/(?P<index>\d+))?', methods=['get', 'delete'])
    def by_product(self, request, product_id=None, index=None):
        notifications = Notification.objects.filter(product_id=product_id)
        return self._handle_filtered_request(request, notifications, index)

    @action(detail=False, url_path='notification/(?P<notification_id>[^/]+)(?:/(?P<index>\d+))?', methods=['get', 'delete'])
    def by_notification(self, request, notification_id=None, index=None):
        if notification_id == 'null':
            notifications = Notification.objects.filter(notification__isnull=True)
        else:
            try:
                notifications = Notification.objects.filter(notification_id=int(notification_id))
            except ValueError:
                raise Http404("Invalid notification ID.")
        return self._handle_filtered_request(request, notifications, index)
