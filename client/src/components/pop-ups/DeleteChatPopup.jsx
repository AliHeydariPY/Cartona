import { Portal } from "react-portal";
import { useEffect, useState } from "react";
import { FiX, FiTrash2, FiMessageCircle } from "react-icons/fi";

const DeleteChatPopup = ({ onClose, chat, onConfirm }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 10);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => onClose(), 300);
  };

  const handleConfirm = () => {
    onConfirm(chat.id);
    handleClose();
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
                Delete Chat?
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
            <div className="flex items-start mb-6">
              <div className="min-w-20 max-w-20 h-20 border border-red-400 rounded-lg flex items-center justify-center mb-4 sm:mb-0 relative overflow-hidden p-1 bg-gradient-to-br from-blue-100 to-cyan-100">
                {chat?.product?.image ? (
                  <img
                    src={chat.product.image}
                    alt={chat.product.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <FiMessageCircle className="text-blue-600" size={32} />
                )}
                {!chat?.chat_enabled && (
                  <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                    <FiX className="text-white" size={20} />
                  </div>
                )}
              </div>

              <div className="ml-4 flex-1">
                <h4 className="font-bold text-blue-900 text-lg mb-1">
                  {chat?.buyer === chat?.currentUser?.username
                    ? chat?.store?.store_name
                    : chat?.buyer}
                </h4>

                <p className="text-blue-700 font-medium text-sm mb-2">
                  {chat?.product?.name}
                </p>

                <div className="flex flex-wrap gap-2">
                  {!chat?.chat_enabled && (
                    <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                      Chat Closed
                    </span>
                  )}
                  {chat?.buyer === chat?.currentUser?.username && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      Seller
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="mb-3 text-sm text-gray-600">
              <p>
                This action cannot be undone. All messages will be permanently
                deleted.
              </p>
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
                className="cursor-pointer w-full bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center hover:from-red-700 hover:to-rose-700 transition-colors duration-300"
              >
                <FiTrash2 className="mr-2 mb-0.5" />
                Delete Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default DeleteChatPopup;
