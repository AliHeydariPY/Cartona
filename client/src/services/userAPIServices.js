import axios from "axios";
import api from "../api/api";
import { getDefaultStore } from "jotai";
import { authAtom } from "../atoms/authAtom";

const SERVER_URL = "https://127.0.0.1:8000";

const store = getDefaultStore();

export const login = async (userData) => {
  const response = await api.post("/api/token/", userData);

  localStorage.setItem("accessToken", response.data.access);
  store.set(authAtom, true);
  return response;
};

export const logout = async () => {
  const response = await api.post("/api/logout/");
  localStorage.removeItem("username");
  localStorage.removeItem("accessToken");

  store.set(authAtom, false);
  return response;
};

export const createUser = (userData) => {
  const url = `${SERVER_URL}/user-api/users/`;
  return axios.post(url, userData);
};

export const getUser = () => {
  const url = `/user-api/users/`;
  return api.get(url);
};

export const ChangeUserPassword = (userData, username) => {
  const url = `/user-api/users/username/${username}/`;
  return api.patch(url, userData);
};

export const ChangeUserName = (userData, username) => {
  const url = `/user-api/users/username/${username}/`;
  return api.patch(url, userData);
};

export const changeStoreInfo = (storeData, storekeeperName) => {
  const url = `/user-api/storekeepers/username/${storekeeperName}/`;
  return api.patch(url, storeData);
};

export const upgradeToSeller = (formData) => {
  const url = `/user-api/storekeepers/`;

  return api.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getStorekeeper = (storekeeperName) => {
  const url = `${SERVER_URL}/user-api/storekeepers/username/${storekeeperName}/`;
  return axios.get(url);
};

export const getStorekeeperById = (storekeeperID) => {
  const url = `${SERVER_URL}/user-api/storekeepers/${storekeeperID}/`;
  return axios.get(url);
};

export const getStorekeeperPayments = (page) => {
  const url = `/user-api/storekeeper-payments/?page=${page}`;
  return api.get(url);
};

export const getStorekeeperDeliveryPayments = (page = 1) => {
  const url = `/user-api/storekeeper-payments/storekeeper-delivery/false/?page=${page}`;
  return api.get(url);
};

export const getNotDeliveredPayments = (page = 1) => {
  const url = `/user-api/storekeeper-payments/buyer-not-delivery/false/?page=${page}`;
  return api.get(url);
};

export const getDeliveredPayments = (page = 1) => {
  const url = `/user-api/storekeeper-payments/buyer-delivery/true/?page=${page}`;
  return api.get(url);
};

export const getDeliverySummary = () => {
  const url = `/user-api/storekeeper-payments/delivery-summary/`;
  return api.get(url);
};

export const deliveryStatus = () => {
  const url = `/user-api/delivery-status/`;
  return api.get(url);
};

export const getBuyer = (buyerID) => {
  const url = `${SERVER_URL}/user-api/users/${buyerID}`;
  return axios.get(url);
};

export const productSubmission = (payload) => {
  const url = `/user-api/delivery-status/`;
  return api.post(url, payload);
};

export const userActivitySummary = () => {
  const url = `/user-api/user-activity-summary/`;
  return api.get(url);
};
