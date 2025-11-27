import { Portal } from "react-portal";
import { useEffect, useState } from "react";
import { FiX, FiTrash2 } from "react-icons/fi";

const DeleteFeaturePopup = ({ onClose, feature, removeFeature }) => {
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

  const stopPropagation = (e) => e.stopPropagation();

  const handleConfirm = () => {
    if (isDeleting) return;
    setIsDeleting(true);
    removeFeature();
    handleClose();
  };

  return (
    <Portal>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center sm:p-4 transition-colors duration-300 ${
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
          <div className="bg-gradient-to-r from-red-600 to-rose-600 p-5 sm:p-6 text-white">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold flex items-center">
                <div className="bg-white/30 rounded-full p-1.5 mr-2">
                  <FiTrash2 size={18} />
                </div>
                Remove Feature?
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
            <div className="mb-4">
              <p className="text-blue-900 font-semibold">
                Feature Name: {feature.feature_name}
              </p>
              <p className="text-gray-700 mt-1">
                Feature Value: {feature.feature_value}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This feature will be removed permanently.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                onClick={handleClose}
                className="cursor-pointer bg-white border border-blue-300 text-blue-700 py-3 rounded-lg font-medium flex items-center justify-center hover:bg-blue-50 transition-colors duration-300"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirm}
                disabled={isDeleting}
                className={`cursor-pointer bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center hover:from-red-700 hover:to-rose-700 transition-colors duration-300 ${
                  isDeleting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <FiTrash2 className="mr-2 mb-0.5" />
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default DeleteFeaturePopup;
