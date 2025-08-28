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

export const deleteProduct = (productID) => {
  const url = `${SERVER_URL}/product-api/products/${productID}/`;
  return axios.delete(url);
};

export const editProduct = (formData) => {
  console.log(formData.get("id"))
  const url = `${SERVER_URL}/product-api/products/${formData.get("id")}/`
  return axios.patch(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
} 

export const getStorekeeperProducts = (storekeeperID) => {
  const url = `${SERVER_URL}/product-api/products/storekeeper/${storekeeperID}/`;
  return axios.get(url);
};

export const getProduct = (productID) => {
  const url = `${SERVER_URL}/product-api/products/${productID}`;
  return axios.get(url);
};

export const getCategory = (categoryID) => {
  const url = `${SERVER_URL}/product-api/categories/${categoryID}/`;
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

export const deleteFeature = (featureID) => {
  const url = `${SERVER_URL}/product-api/features/${featureID}/`;
  return axios.delete(url);
};

export const addImage = (image) => {
  const url = `${SERVER_URL}/product-api/images/`;
  return axios.post(url, image, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteImage = (imageID) => {
  const url = `${SERVER_URL}/product-api/images/${imageID}/`;
  return axios.delete(url);
};

export const searchProduct = (query) => {
  const currentURL = window.location.href
  const url = currentURL.includes("category") ? `${SERVER_URL}/product-api/list-products/?category=${query}` : `${SERVER_URL}/product-api/list-products/?search=${query}`;
  console.log()
  return axios.get(url)
}