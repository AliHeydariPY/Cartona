import axios from "axios";

const SERVER_URL = "http://127.0.0.1:8000";

export const addNewProduct = (formData) => {
  const url = `${SERVER_URL}/product-api/products/`;
  return axios.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getStorekeeperProducts = (storekeeperID) => {
  const url = `${SERVER_URL}/product-api/products/storekeeper/${storekeeperID}/`;
  return axios.get(url);
};

export const getProduct = (productID) => {
  const url = `${SERVER_URL}/product-api/products/${productID}`;
  return axios.get(url);
};

export const getMainCategories = () => {
  const url = `${SERVER_URL}/product-api/categories/parent/null/`;
  return axios.get(url);
};

export const getSubCategories = (mainCategoriesID) => {
  const url = `${SERVER_URL}/product-api/categories/parent/${mainCategoriesID}/`;
  return axios.get(url);
};

export const addFeature = (feature) => {
  const url = `${SERVER_URL}/product-api/features/`;
  return axios.post(url, feature);
};

export const removeFeature = (featureID) => {
  const url = `${SERVER_URL}/product-api/features/${featureID}/`;
  return axios.delete(url);
};