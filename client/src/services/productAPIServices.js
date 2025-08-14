import axios from "axios";

const SERVER_URL = "http://127.0.0.1:8000/";

export const addNewProduct = (formData) => {
  const url = `${SERVER_URL}product-api/products/`;
  return axios
    .post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
};
