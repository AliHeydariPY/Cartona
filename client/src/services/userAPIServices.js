import axios from "axios";

const SERVER_URL = "http://127.0.0.1:8000";

export const createUser = (userData) => {
  const url = `${SERVER_URL}/user-api/users/`;
  return axios
    .post(url, userData)
    
};

export const upgradeToSeller = (formData) => {
  const url = `${SERVER_URL}/user-api/storekeepers/`;
  return axios
    .post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
};

export const getShopkeeper = (storekeeperID) => {
  const url = `${SERVER_URL}/user-api/storekeepers/${storekeeperID}/`;
  return axios
    .get(url)
    
}

export const getBuyer = (buyerID) => {
  const url = `${SERVER_URL}/user-api/users/${buyerID}`;
  return axios
    .get(url)
    
}