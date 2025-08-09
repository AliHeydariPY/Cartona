import axios from "axios";
import toast from "react-hot-toast";
import { FiX } from "react-icons/fi";

const SERVER_URL = "http://127.0.0.1:8000/user-api/users/";

export const createUser = (userData) => {
  return axios
    .post(SERVER_URL, userData)
    .then((response) => response.data)
    .catch((error) => {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-4 rounded-xl shadow-lg border border-white/20 backdrop-blur-md flex items-center space-x-3 rtl:space-x-reverse`}
          style={{ fontFamily: "Roboto" }}
        >
          <FiX className="text-xl shrink-0" />
          <span className="font-medium">{error.response?.data.username}</span>
        </div>
      ));
    });
};
