import axios from "axios";
import toast from "react-hot-toast";

import { FiCheckCircle, FiX } from "react-icons/fi";

const SERVER_URL = "http://127.0.0.1:8000/";

export const createUser = (userData) => {
  const url = `${SERVER_URL}user-api/users/`;
  return axios
    .post(url, userData)
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

export const upgradeToSeller = (formData) => {
  const url = `${SERVER_URL}user-api/storekeepers/`;
  return axios
    .post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      console.log(res.data);
      toast.custom((t) => (
        <div
          className={`${t.visible ? "animate-enter" : "animate-leave"} 
      transform transition-all duration-300`}
        >
          <div className="bg-gradient-to-r from-green-500 to-cyan-400 text-white px-6 py-3 rounded-xl shadow-lg border border-white/30 backdrop-blur-md flex items-center space-x-3">
            <div className="bg-blue-500/20 p-2 rounded-full">
              <FiCheckCircle className="text-xl text-white" />
            </div>
            <div>
              <p className="font-medium">
                Account upgraded to seller successfully!
              </p>
            </div>
          </div>
        </div>
      ));
    })
    .catch((err) => {
      console.error(err);

      toast.custom((t) => (
        <div
          className={`${t.visible ? "animate-enter" : "animate-leave"} 
      transform transition-all duration-300`}
        >
          <div className="bg-gradient-to-r from-red-600 to-rose-500 text-white px-6 py-4 rounded-xl shadow-lg border border-white/30 backdrop-blur-md flex items-center space-x-3">
            <FiX className="text-xl shrink-0" />
            <span className="font-medium">
              {err.response?.data?.message ||
                "Upgrade failed. Please try again."}
            </span>
          </div>
        </div>
      ));
    });
};

export const addNewProduct = (formData, onSubmitProps, setImages) => {
  const url = `${SERVER_URL}product-api/products/`;
  return axios
    .post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      console.log(res.data);
      onSubmitProps.resetForm()
      setImages({})
      toast.custom((t) => (
        <div
          className={`${t.visible ? "animate-enter" : "animate-leave"} 
      transform transition-all duration-300`}
        >
          <div className="bg-gradient-to-r from-green-500 to-cyan-400 text-white px-6 py-3 rounded-xl shadow-lg border border-white/30 backdrop-blur-md flex items-center space-x-3">
            <div className="bg-blue-500/20 p-2 rounded-full">
              <FiCheckCircle className="text-xl text-white" />
            </div>
            <div>
              <p className="font-medium">
                Product added successfully
              </p>
            </div>
          </div>
        </div>
      ));
    })
    // .catch((err) => {
    //   console.error(err);

    //   toast.custom((t) => (
    //     <div
    //       className={`${t.visible ? "animate-enter" : "animate-leave"} 
    //   transform transition-all duration-300`}
    //     >
    //       <div className="bg-gradient-to-r from-red-600 to-rose-500 text-white px-6 py-4 rounded-xl shadow-lg border border-white/30 backdrop-blur-md flex items-center space-x-3">
    //         <FiX className="text-xl shrink-0" />
    //         <span className="font-medium">
    //           {err.response?.data?.message ||
    //             "Upgrade failed. Please try again."}
    //         </span>
    //       </div>
    //     </div>
    //   ));
    // });
};