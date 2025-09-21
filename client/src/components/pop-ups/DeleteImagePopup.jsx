import { Portal } from "react-portal";
import { useEffect, useState } from "react";
import { FiX, FiTrash2, FiImage } from "react-icons/fi";

const DeleteImagePopup = ({ onClose, image, removeImage }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 10);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => onClose(), 300);
  };

  const stopPropagation = (e) => e.stopPropagation();

  const handleConfirm = () => {
    handleClose();
    removeImage();
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
                Remove Image?
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
              <div className="min-w-24 max-w-24 h-24 sm:w-28 sm:h-28 border-2 border-red-400 rounded-lg flex items-center justify-center overflow-hidden p-2">
                <img
                  src={image.image}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain rounded-md"
                />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-blue-900 font-semibold">Image Preview</p>
                <p className="text-sm text-gray-500 mt-1">
                  This image will be removed permanently.
                </p>
              </div>
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
                className="cursor-pointer bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center hover:from-red-700 hover:to-rose-700 transition-colors duration-300"
              >
                <FiTrash2 className="mr-2 mb-0.5" />
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default DeleteImagePopup;
