import axios from "axios";
import { captureOwnerStack } from "react";
import api from "../api/api";
const SERVER_URL = "https://127.0.0.1:8000";

export const getComments = (productID) => {
  const url = `${SERVER_URL}/comments-api/comments/product/${productID}/`;
  return axios.get(url);
  // .then(async () => {
  //   console.log("yes");
  //   // const commentsWithReplies = await Promise.all(
  //   //   comments.data.map(async (comment) => {
  //   //     try {
  //   //       const repliesResponse = await getCommentReplies(comment.id);
  //   //       const replies = repliesResponse.data;
  //   //       return { ...comment, replies };
  //   //     } catch {
  //   //       return { ...comment };
  //   //     }
  //   //   })
  //   // );
  //   // console.log(commentsWithReplies);
  //   // setProductComments(commentsWithReplies);
  // })
  // .catch((err) => {
  //   console.log("hello");
  //   // setProductComments([]);
  // });
};

export const getCommentsByUser = (userID) => {
  const url = `/comments-api/comments/user/${userID}/`;
  return api.get(url);
};

export const sendComment = (comment) => {
  const url = `/comments-api/comments/`;
  return api.post(url, comment);
};

export const getProductQuestions = () => {
  const url = `/comments-api/product-questions/`;
  return api.get(url);
};

export const sendProductQuestion = (question) => {
  const url = `/comments-api/product-questions/`;
  return api.post(url, question);
};

export const answerProductQuestion = (answer, questionID) => {
  console.log(questionID);
  const url = `/comments-api/product-questions/${questionID}/`;
  return api.patch(url, answer);
};

export const getCommentReplies = (commentID) => {
  const url = `/comments-api/comment-replies/comment/${commentID}/`;
  return api.get(url);
};

export const sendCommentReply = (reply) => {
  const url = `/comments-api/comment-replies/`;
  return api.post(url, reply);
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

export const getPurchasesByStorekeepre = (storekeeperID) => {
  const url = `/comments-api/purchases/storekeeper/${storekeeperID}/`;
  return api.get(url);
};

export const getPurchases = (storekeeperID) => {
  const url = `/comments-api/purchases/`;
  return api.get(url);
};

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