import axios from "axios";
import { captureOwnerStack } from "react";

const SERVER_URL = "http://127.0.0.1:8000";

export const getComments = (productID) => {
  const url = `${SERVER_URL}/comments-api/comments/product/${productID}/`;
  return axios.get(url);
};

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
