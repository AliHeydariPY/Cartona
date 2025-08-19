import axios from "axios";

const SERVER_URL = "http://127.0.0.1:8000";

export const addNewProduct = (formData) => {
  const url = `${SERVER_URL}/product-api/products/`;
  return axios
    .post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
};


export const getProduct = (id) =>{
  const url = `${SERVER_URL}/product-api/products/${id}`;
  return axios.get(url)
}

export const getMainCategories = () => {
  const url = `${SERVER_URL}/product-api/categories/parent/null/`
  return axios.get(url)
}

export const getSubCategories = (mainCategoriesID) => {
  const url = `${SERVER_URL}/product-api/categories/parent/${mainCategoriesID}/`
  return axios.get(url)
}