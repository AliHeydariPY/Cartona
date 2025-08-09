import axios from "axios";

const SERVER_URL = "http://127.0.0.1:8000/user-api/users/";

export const createUser = (userData) => {
    const url = `${SERVER_URL}`
    return axios.get(url)
}