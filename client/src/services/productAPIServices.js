import axios from "axios";
const SERVER_URL = "https://127.0.0.1:8000";
import api from "../api/api";

export const addNewProduct = (formData) => {
  const url = `/product-api/products/`;
  return api.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteProduct = (productID) => {
  const url = `/product-api/products/${productID}/`;
  return api.delete(url);
};

export const editProduct = (formData) => {
  const url = `/product-api/products/${formData.get("id")}/`;
  return api.patch(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getStorekeeperProducts = (storekeeperID) => {
  const url = `/product-api/products/storekeeper/${storekeeperID}/`;
  return api.get(url);
};

export const getProduct = (productID) => {
  const url = `${SERVER_URL}/product-api/products/${productID}`;
  return axios.get(url);
};

export const getCategory = (categoryID) => {
  const url = `/product-api/categories/${categoryID}/`;
  return api.get(url);
};

export const getMainCategories = () => {
  const url = `/product-api/categories/parent/null/`;
  return api.get(url);
};

export const getSubCategories = (mainCategoriesID) => {
  const url = `/product-api/categories/parent/${mainCategoriesID}/`;
  return api.get(url);
};

export const getProductFeatures = (productID) => {
  const url = `${SERVER_URL}/product-api/features/product/${productID}`;
  return axios.get(url);
};

export const addFeature = (feature) => {
  const url = `/product-api/features/`;
  return api.post(url, feature);
};

export const deleteFeature = (featureID) => {
  const url = `/product-api/features/${featureID}/`;
  return api.delete(url);
};

export const addImage = (image) => {
  const url = `/product-api/images/`;
  return api.post(url, image, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteImage = (imageID) => {
  const url = `/product-api/images/${imageID}/`;
  return api.delete(url);
};

export const searchProduct = (query) => {
  const url = `/product-api/products/?${query}`;
  return api.get(url);
};

export const getListProducts = () => {
  const url = `/product-api/products/`;
  return api.get(url);
};


export const getSubCategoryItems = (categoryID) => {
  const url = `/product-api/products/?category=${categoryID}`;
  return api.get(url);
};

export const getProducImages = (productID) => {
  const url = `/product-api/images/product/${productID}`;
  return api.get(url);
};