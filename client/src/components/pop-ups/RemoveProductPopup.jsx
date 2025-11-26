import { Portal } from "react-portal";
import { useEffect, useState } from "react";

import { deleteCartProduct } from "../../services/cartAPIServices";
import { deleteProduct } from "../../services/productAPIServices";

import { FiX, FiTrash2, FiStar } from "react-icons/fi";
import { successToast } from "../../utils/toast";

const RemoveProductPopup = ({
  onClose,
  product,
  isRemoveCartItem,
  onSuccess,
}) => {
  const [show, setShow] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => onClose(), 300);
  };

  const handleConfirm = () => {
    if (isDeleting) return;
    setIsDeleting(true);

    const action = isRemoveCartItem
      ? deleteCartProduct(product.id)
      : deleteProduct(product.id);
    action
      .then(() => {
        onSuccess();
        if (!isRemoveCartItem) successToast("Product successfully deleted");
        handleClose();
      })
      .finally(() => setIsDeleting(false));
  };

  const stopPropagation = (e) => e.stopPropagation();

  return (
    <Portal>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center sm:p-4 transition-colors duration-300 ${
          show ? "bg-black/40" : "bg-black/0"
        }`}
        onClick={handleClose}
      >
        <div
          className={`bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden transform transition-all duration-300 ${
            show ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
          onClick={stopPropagation}
        >
          <div className="bg-gradient-to-r from-red-600 to-rose-600 p-5 sm:p-6 text-white">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold flex items-center">
                <div className="bg-white/30 rounded-full p-1.5 mr-2">
                  <FiTrash2 size={18} />
                </div>
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

          <div className="p-4 sm:p-6">
            <div className="flex items-center mb-6">
              <div className="min-w-22 max-w-22 h-22 border-2 border-red-400 rounded-lg flex items-center justify-center mb-4 sm:mb-0 relative overflow-hidden p-1">
                <img
                  src={product.image}
                  alt=""
                  className="max-w-full max-h-full object-contain rounded-md"
                />
              </div>
              <div className="ml-3">
                <h4 className="font-bold text-blue-900">{product.name}</h4>
                <p className="text-rose-600">
                  ${Number(product.price).toFixed(2)}
                </p>
                <div className="flex items-center mt-0.5 gap-2">
                  <div className="flex text-sm items-center bg-red-100 px-2 py-1 rounded-full">
                    <FiStar className="text-yellow-500 fill-yellow-500 mr-1 mb-0.5" />
                    <span className=" text-blue-800">
                      {product.average_rating?.toFixed(1) || "0"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={handleClose}
                className="cursor-pointer w-full bg-white border border-blue-300 text-blue-700 py-3 rounded-lg font-medium flex items-center justify-center hover:bg-blue-50 transition-colors duration-300"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirm}
                disabled={isDeleting}
                className={`cursor-pointer w-full bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center hover:from-red-700 hover:to-rose-700 transition-colors duration-300 ${
                  isDeleting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <FiTrash2 className="mr-2 mb-0.5" />
                {isDeleting ? "Removing..." : "Deleting..."}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default RemoveProductPopup;
