import { Portal } from "react-portal";
import { useEffect, useState } from "react";

import { deleteCartProduct } from "../services/cartAPIServices";

import { FiX, FiTrash2 } from "react-icons/fi";

const RemoveFromCartPopup = ({ onClose, product , setRemoveInDOM}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 10);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => onClose(), 300);
  };

  const handleConfirm = () => {
    deleteCartProduct(product.id);
    setRemoveInDOM(product.id)
    handleClose();
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
          <div className="bg-gradient-to-r from-rose-600 to-red-500 p-6 text-white">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold flex items-center">
                <FiTrash2
                  className="mr-2 bg-white/30 rounded-full p-1"
                  size={27}
                />
                Remove Item?
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
              <div className="w-22 h-22 border-2 border-red-400 rounded-lg flex items-center justify-center mb-4 sm:mb-0 relative overflow-hidden">
                <img
                  src={product.image}
                  alt=""
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="ml-3">
                <h4 className="font-bold text-blue-900">{product.name}</h4>
                <p className="text-rose-600">${product.price.toFixed(2)}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Qty: {product.quantity}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleClose}
                className="cursor-pointer bg-white border border-blue-300 text-blue-700 py-3 rounded-lg font-medium flex items-center justify-center hover:bg-blue-50 transition-colors duration-300"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirm}
                className="cursor-pointer bg-gradient-to-r from-rose-600 to-red-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center hover:from-rose-700 hover:to-red-600 transition-colors duration-300"
              >
                <FiTrash2 className="mr-2" />
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default RemoveFromCartPopup;
