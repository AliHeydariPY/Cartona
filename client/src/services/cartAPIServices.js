import axios from "axios";

const SERVER_URL = "http://127.0.0.1:8000";

export const addToCart = (data) => {
  const url = `${SERVER_URL}/cart-api/cart-items/`;
  return axios.post(url, data);
};

export const getCartProducts = () => {
  const url = `${SERVER_URL}/cart-api/cart-items/`;
  return axios.get(url);
};
