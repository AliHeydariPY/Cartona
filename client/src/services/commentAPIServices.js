import axios from "axios";
import { captureOwnerStack } from "react";

const SERVER_URL = "http://127.0.0.1:8000";

export const getComments = (productID) => {
  const url = `${SERVER_URL}/comments-api/comments/product/${productID}/`;
  return axios
    .get(url)
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
  const url = `${SERVER_URL}/comments-api/comments/user/${userID}/`;
  return axios
    .get(url)
}

export const sendComment = (comment) => {
  const url = `${SERVER_URL}/comments-api/comments/`;
  return axios.post(url, comment);
};

export const getProductQuestions = () => {
  const url = `${SERVER_URL}/comments-api/product-questions/`;
  return axios.get(url);
};

export const sendProductQuestion = (question) => {
  const url = `${SERVER_URL}/comments-api/product-questions/`;
  return axios.post(url, question);
};

export const answerProductQuestion = (answer, questionID) => {
  console.log(questionID);
  const url = `${SERVER_URL}/comments-api/product-questions/${questionID}/`;
  return axios.patch(url, answer);
};

export const getCommentReplies = (commentID) => {
  const url = `${SERVER_URL}/comments-api/comment-replies/comment/${commentID}/`;
  return axios.get(url);
};

export const sendCommentReply = (reply) => {
  const url = `${SERVER_URL}/comments-api/comment-replies/`;
  return axios.post(url, reply);
};

export const getSubscriptions = (userID) => {
  const url = `${SERVER_URL}/comments-api/subscriptions/user/${userID}/`;
  return axios.get(url);
};

export const enableNotifications = (payload) => {
  const url = `${SERVER_URL}/comments-api/subscriptions/`;
  return axios.post(url, payload);
};

export const disableNotifications = (srotekeeperID) => {
  const url = `${SERVER_URL}/comments-api/subscriptions/${srotekeeperID}/`;
  return axios.delete(url);
};

export const getPurchasesByBuyer = (userID) => {
  const url = `${SERVER_URL}/comments-api/purchases/buyer/${userID}/`
  return axios.get(url)
}

export const getPurchasesByStorekeepre = (storekeeperID) => {
  const url = `${SERVER_URL}/comments-api/purchases/storekeeper/${storekeeperID}/`
  return axios.get(url)
}

export const getPurchaseByPayment = (paymentID) => {
  const url = `${SERVER_URL}/comments-api/purchases/payment/${paymentID}/`
  return axios.get(url)
}

export const getPurchaseChats = (purchaseID) => {
  const url = `${SERVER_URL}/comments-api/purchase-chats/purchase/${purchaseID}/`
  return axios.get(url)
}

export const sendMessagse = (payload) => {
  const url = `${SERVER_URL}/comments-api/purchase-chats/`
  return axios.post(url, payload)
}

export const deleteMessagse = (msgID) => {
  const url = `${SERVER_URL}/comments-api/purchase-chats/${msgID}/`
  return axios.delete(url)
}

export const editMessage = (editedMsg) => {
  const url = `${SERVER_URL}/comments-api/purchase-chats/${editedMsg.id}/`
  return axios.patch(url, editedMsg)
}

export const getNotifications = (userID) => {
  const url = `${SERVER_URL}/comments-api/notifications/user/${userID}/`
  return axios.get(url)
}