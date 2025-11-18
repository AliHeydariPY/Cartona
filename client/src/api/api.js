import axios from "axios";
import { authAtom } from "../atoms/authAtom";
import { getDefaultStore } from "jotai";
import { tokenAtom } from "../atoms/tokenAtom";

const store = getDefaultStore();

const api = axios.create({
  baseURL: "https://127.0.0.1:8000",
  withCredentials: true,
});

let accessToken = localStorage.getItem("accessToken");

const updateAccessToken = () => {
  accessToken = localStorage.getItem("accessToken");
};

const setupLocalStorageListener = () => {
  window.addEventListener("storage", (event) => {
    if (event.key === "accessToken") {
      updateAccessToken();
    }
  });
};

setupLocalStorageListener();

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
  const currentToken = localStorage.getItem("accessToken");
  if (currentToken && currentToken !== accessToken) {
    accessToken = currentToken;
  }

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

        localStorage.setItem("accessToken", accessToken);
        store.set(tokenAtom, accessToken);
        store.set(authAtom, true);

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
  localStorage.setItem("accessToken", token);
  api.defaults.headers.common["Authorization"] = "Bearer " + token;
};

export const getAccessToken = () => {
  return accessToken;
};

export const refreshAccessToken = () => {
  updateAccessToken();
  return accessToken;
};

export default api;
