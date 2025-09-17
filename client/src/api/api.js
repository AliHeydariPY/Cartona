import axios from "axios";

const api = axios.create({
  baseURL: "https://127.0.0.1:8000",
  withCredentials: true, // چون رفرش توی کوکیه
});

// ✅ دسترسی به توکن از sessionStorage
let accessToken = sessionStorage.getItem("accessToken");

// متغیر برای جلوگیری از چندبار رفرش همزمان
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

// ====== interceptor برای request ======
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

// ====== interceptor برای response ======
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

        // ✅ ذخیره در sessionStorage
        sessionStorage.setItem("accessToken", accessToken);
        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        console.log(payload);
        
        api.defaults.headers.common["Authorization"] = "Bearer " + accessToken;
        processQueue(null, accessToken);

        originalRequest.headers["Authorization"] = "Bearer " + accessToken;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ====== تابعی برای ست کردن توکن موقع لاگین ======
export const setAccessToken = (token) => {
  accessToken = token;
  sessionStorage.setItem("accessToken", token);
  api.defaults.headers.common["Authorization"] = "Bearer " + token;
};

export default api;
