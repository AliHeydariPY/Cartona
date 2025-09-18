import { useEffect, useState } from "react";
import { Portal } from "react-portal";
import { useNavigate } from "react-router-dom";

import {
  FiCheck,
  FiX,
  FiShoppingCart,
  FiChevronRight,
  FiStar,
} from "react-icons/fi";

const AddToCartPopup = ({ onClose, product }) => {
  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setShow(true), 10);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const stopPropagation = (e) => e.stopPropagation();

  return (
    <Portal>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-colors duration-300 ${
          show ? "bg-black/30" : "bg-black/0"
        }`}
        onClick={handleClose}
      >
        <div
          className={`bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden transform transition-all duration-300 ${
            show ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
          onClick={stopPropagation}
        >
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold flex items-center ">
                <FiCheck
                strokeWidth={4}
                  className="mr-2 bg-white text-green-500 rounded-full p-0.5"
                  size={22}
                />
                Added to Cart!
              </h3>
              <button
                onClick={handleClose}
                className="p-1 cursor-pointer rounded-full hover:bg-white/20 transition-colors duration-200"
              >
                <FiX size={22} />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center mr-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-300 via-cyan-200 to-white rounded-full shadow-inner"></div>
              </div>
              {/* <div className="w-22 h-22 border-2 border-blue-400 rounded-lg flex items-center justify-center mb-4 sm:mb-0 relative overflow-hidden">
                <img
                  src={product.image}
                  alt=""
                  className="max-w-full max-h-full object-contain"
                />
              </div> */}
              <div className="ml-3">
                <h4 className="font-bold text-blue-900">
                  {product.name}
                </h4>
                <p className="text-blue-600">${Number(product.discounted_price).toFixed(2)}</p>
                <div className="flex items-center mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                      key={star}
                      className={`${
                        star <= 4
                          ? "text-amber-400 fill-current"
                          : "text-gray-300"
                      } mr-0.5`}
                      size={14}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  handleClose();
                  navigate("/account/cart");
                }}
                className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center hover:shadow-lg transition-all duration-300"
              >
                <FiShoppingCart className="mr-2 mb-0.5" />
                View Cart & Checkout
                <FiChevronRight className="ml-2" />
              </button>

              <button
                onClick={handleClose}
                className="w-full cursor-pointer bg-white border border-blue-300 text-blue-700 py-3 rounded-lg font-medium flex items-center justify-center hover:bg-blue-50 transition-colors duration-300"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default AddToCartPopup;
