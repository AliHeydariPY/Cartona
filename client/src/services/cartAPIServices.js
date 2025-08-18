import axios from "axios";

const SERVER_URL = "http://127.0.0.1:8000";

// export const createCart = (user) => {
//   const url = `${SERVER_URL}/cart-api/cart/`;
//   return axios.post(url, user);
// };

export const getCartProducts = (cartID) => {
  const url = `${SERVER_URL}/cart-api/cart/${cartID}/`;
  // const url = `${SERVER_URL}/cart-api/cart/4/`;
  return axios.get(url);
};

export const addToCart = (data) => {
  const url = `${SERVER_URL}/cart-api/cart-items/`;
  return axios.post(url, data);
};

export const editCartProduct = (payload) => {
  const url = `${SERVER_URL}/cart-api/cart-items/${payload.id}/`;
  return axios.put(url, payload)
};

export const deleteCartProduct = (productID) => {
    const url = `${SERVER_URL}/cart-api/cart-items/${productID}/`;
  return axios.delete(url)
}