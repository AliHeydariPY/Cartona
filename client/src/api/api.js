import axios from "axios";
import { getStorekeeper, getUserById } from "../services/userAPIServices";
import { authAtom } from "../atoms/authAtom";
import { getDefaultStore } from "jotai";

const store = getDefaultStore();

const api = axios.create({
  baseURL: "https://127.0.0.1:8000",
  withCredentials: true,
});

let accessToken = sessionStorage.getItem("accessToken");

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(
          "https://127.0.0.1:8000/api/token/refresh/",
          {},
          { withCredentials: true }
        );

        accessToken = res.data.access;

        sessionStorage.setItem("accessToken", accessToken);
        store.set(authAtom, true);

        //coming soon
        const userData = JSON.parse(atob(accessToken.split(".")[1]));
        console.log("refresh", userData);
        getUserById(userData.user_id)
          .then((res) => {
            console.log(res.data.username)
            localStorage.setItem("username", res.data.username);
          })
          

        getStorekeeper(userData.user_id)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });

        api.defaults.headers.common["Authorization"] = "Bearer " + accessToken;
        processQueue(null, accessToken);

        originalRequest.headers["Authorization"] = "Bearer " + accessToken;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        store.set(authAtom, false);

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const setAccessToken = (token) => {
  accessToken = token;
  sessionStorage.setItem("accessToken", token);
  api.defaults.headers.common["Authorization"] = "Bearer " + token;
};

export default api;
