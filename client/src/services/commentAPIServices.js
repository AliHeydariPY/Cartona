import axios from "axios";
import { captureOwnerStack } from "react";
import api from "../api/api";
const SERVER_URL = "https://127.0.0.1:8000";

export const getComments = (productID) => {
  const url = `${SERVER_URL}/comments-api/comments/product/${productID}/`;
  return axios.get(url);
};

export const sendComment = (comment) => {
  const url = `/comments-api/comments/`;
  return api.post(url, comment);
};

export const editComment = (editedComment, commentID) => {
  const url = `/comments-api/comments/${commentID}/`;
  return api.patch(url, editedComment);
};

export const deleteComment = (commentID) => {
  const url = `/comments-api/comments/${commentID}/`;
  return api.delete(url);
};

export const getProductQuestions = () => {
  const url = `${SERVER_URL}/comments-api/product-questions/`;
  return axios.get(url);
};

export const sendProductQuestion = (question) => {
  const url = `/comments-api/product-questions/`;
  return api.post(url, question);
};

export const deleteProductQuestion = (questionID) => {
  const url = `/comments-api/product-questions/${questionID}/`;
  return api.delete(url);
};

export const editProductQuestion = (editedQuestion, questionID) => {
  const url = `/comments-api/product-questions/${questionID}/`;
  return api.patch(url, editedQuestion);
};

export const answerProductQuestion = (answer, questionID) => {
  const url = `/comments-api/product-questions/${questionID}/`;
  return api.patch(url, answer);
};

export const getCommentReplies = (commentID) => {
  const url = `${SERVER_URL}/comments-api/comment-replies/comment/${commentID}/`;
  return axios.get(url);
};

export const sendCommentReply = (reply) => {
  const url = `/comments-api/comment-replies/`;
  return api.post(url, reply);
};

export const editCommentReply = (editedReply, replyID) => {
  const url = `/comments-api/comment-replies/${replyID}/`;
  return api.patch(url, editedReply);
};

export const deleteCommentReply = (replyID) => {
  const url = `/comments-api/comment-replies/${replyID}/`;
  return api.delete(url);
};

export const getSubscriptions = () => {
  const url = `/comments-api/subscriptions/`;
  return api.get(url);
};

export const getSubscriptionsByStorekeeper = (storekeeperID) => {
  const url = `/comments-api/subscriptions/storekeeper/${storekeeperID}`;
  return api.get(url);
};

export const enableNotifications = (payload) => {
  const url = `/comments-api/subscriptions/`;
  return api.post(url, payload);
};

export const disableNotifications = (srotekeeperID) => {
  const url = `/comments-api/subscriptions/${srotekeeperID}/`;
  return api.delete(url);
};

export const getPurchasesByBuyer = (userID) => {
  const url = `/comments-api/purchases/buyer/${userID}/`;
  return api.get(url);
};

export const getPurchases = () => {
  const url = `/comments-api/purchases/`;
  return api.get(url);
};


export const deletePurchases = (chatID) => {
  const url = `/comments-api/purchases/${chatID}/`;
  return api.delete(url);
}

export const getPurchaseByPayment = (paymentID) => {
  const url = `/comments-api/purchases/payment/${paymentID}/`;
  return api.get(url);
};

export const getPurchaseChats = (purchaseID) => {
  const url = `/comments-api/purchase-chats/purchase/${purchaseID}/`;
  return api.get(url);
};

export const sendMessagse = (payload) => {
  const url = `/comments-api/purchase-chats/`;
  return api.post(url, payload);
};

export const deleteMessagse = (msgID) => {
  const url = `/comments-api/purchase-chats/${msgID}/`;
  return api.delete(url);
};

export const editMessage = (editedMsg) => {
  const url = `/comments-api/purchase-chats/${editedMsg.id}/`;
  return api.patch(url, editedMsg);
};

export const getNotifications = () => {
  const url = `/comments-api/notifications/`;
  return api.get(url);
};

export const notificationMarkAsRead = (notifID) => {
  const url = `/comments-api/notifications/${notifID}/`;
  return api.patch(url, { is_read: true });
};

export const deleteNotification = (notifID) => {
  const url = `/comments-api/notifications/${notifID}/`;
  return api.delete(url);
};
