from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (CommentViewSet, CommentReplyViewSet, ProductQuestionViewSet,
    ProductPurchaseViewSet, PurchaseChatViewSet)

router = DefaultRouter()
router.register(r'comments', CommentViewSet, basename='comments')
router.register(r'comment-replies', CommentReplyViewSet, basename='comment-reply')
router.register(r'product-questions', ProductQuestionViewSet, basename='product-question')
router.register(r'purchases', ProductPurchaseViewSet, basename='purchase')
router.register(r'purchase-chats', PurchaseChatViewSet, basename='purchase-chat')

urlpatterns = [
    path('comments-api/', include(router.urls)),
]
