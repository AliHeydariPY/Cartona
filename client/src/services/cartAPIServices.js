import axios from "axios";
import api from "../api/api";
const SERVER_URL = "https://127.0.0.1:8000";

export const getCartProducts = (userID) => {
  const url = `/cart-api/cart-items/`;
  // const url = `api/cart-api/cart/4/`;
  return api.get(url);
};

export const addToCart = (data) => {
  const url = `/cart-api/cart-items/`;
  return api.post(url, data);
};

export const editCartProduct = (payload) => {
  const url = `/cart-api/cart-items/${payload.id}/`;
  return api.put(url, payload);
};

export const deleteCartProduct = (productID) => {
  const url = `/cart-api/cart-items/${productID}/`;
  return api.delete(url);
};

export const totalCartPayment = (cartID) => {
  const url = `/cart-api/payments/`;
  return api.post(url, {
    address: "ugd",
    is_successful: true,
    cart: cartID,
  });
};

export const getPayments = (path) => {
  const url = `/cart-api/product-payments/${path}`;
  return api.get(url);
};