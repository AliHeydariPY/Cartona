import axios from "axios";
import api from "../api/api";

const SERVER_URL = "https://127.0.0.1:8000";

export const login = async (userData) => {
  const response = await api.post("/api/token/", userData);
  console.log(response.data);
  sessionStorage.setItem("accessToken", response.data.access);
  return response;
};

export const refreshToken = async () => {
  const response = await api.post("/api/token/refresh/");
  localStorage.setItem("accessToken", response.data.access);
  return response;
};

export const createUser = (userData) => {
  console.log(userData)
  const url = `${SERVER_URL}/user-api/users/`;
  return axios.post(url, userData);
};

export const upgradeToSeller = (formData) => {
  const url = `/user-api/storekeepers/`;

  return api.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getShopkeeper = (storekeeperID) => {
  const url = `${SERVER_URL}/user-api/storekeepers/${storekeeperID}/`;
  return axios.get(url);
};

export const getBuyer = (buyerID) => {
  const url = `${SERVER_URL}/user-api/users/${buyerID}`;
  return axios.get(url);
};

export const productSubmission = (payload) => {
  const url = `${SERVER_URL}/user-api/delivery-status/`;
  return axios.post(url, payload);
};
