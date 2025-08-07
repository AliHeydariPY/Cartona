from rest_framework import viewsets
from .models import Comment, CommentReply, ProductQuestion, ProductPurchase, PurchaseChat
from .serializers import (CommentSerializer, CommentReplySerializer,
    ProductQuestionSerializer, ProductPurchaseSerializer, PurchaseChatSerializer)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

class CommentReplyViewSet(viewsets.ModelViewSet):
    queryset = CommentReply.objects.all()
    serializer_class = CommentReplySerializer

class ProductQuestionViewSet(viewsets.ModelViewSet):
    queryset = ProductQuestion.objects.all()
    serializer_class = ProductQuestionSerializer

class ProductPurchaseViewSet(viewsets.ModelViewSet):
    queryset = ProductPurchase.objects.all()
    serializer_class = ProductPurchaseSerializer

class PurchaseChatViewSet(viewsets.ModelViewSet):
    queryset = PurchaseChat.objects.all()
    serializer_class = PurchaseChatSerializer
