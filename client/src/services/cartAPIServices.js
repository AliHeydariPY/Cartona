import axios from "axios";
import api from "../api/api";
const SERVER_URL = "https://127.0.0.1:8000";

export const getCartProducts = () => {
  const url = `/cart-api/cart-items/`;
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

export const totalCartPayment = (payload) => {
  const url = `/cart-api/payments/`;
  return api.post(url, payload);
};

export const singleCartPayment = (payload) => {
  const url = `/cart-api/product-payments/`;
  return api.post(url, payload);
};

export const getPayments = () => {
  const url = `/cart-api/product-payments/`;
  return api.get(url);
};

export const getPayment = (paymentID) => {
  const url = `/cart-api/product-payments/${paymentID}`;
  return api.get(url);
};

export const setAsDelivered = (paymentID, editedData) => {
  const url = `/cart-api/product-payments/${paymentID}/`;
  return api.patch(url, editedData);
};

export const getFavorites = () => {
  const url = `/cart-api/favorite-items/`;
  return api.get(url);
};

export const addFavorite = (productID) => {
  const url = `/cart-api/favorite-items/`;
  return api.post(url, { product: productID });
};

export const deleteFavorite = (FavoriteID) => {
  const url = `/cart-api/favorite-items/${FavoriteID}/`;
  return api.delete(url);
};
