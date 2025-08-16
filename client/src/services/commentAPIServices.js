import axios from "axios";

const SERVER_URL = "http://127.0.0.1:8000";

export const getComments = () => {
  const url = `${SERVER_URL}/comments-api/comments/`;
  return axios.get(url);
};


export const sendComment = (comment) => {
  const url = `${SERVER_URL}/comments-api/comments/`;
  return axios.post(url, comment);
}