import { FiBox, FiRefreshCcw, FiX } from "react-icons/fi";
import { MdStorefront } from "react-icons/md";
import { errorToast } from "../../utils/toast";

const ChatHeader = ({ selectedChat, user, fetchMessages }) => {
  const openInNewTab = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };
  return (
    <div className="p-3 sm:p-4 border-b border-blue-200 bg-white/80 flex-shrink-0">
      <div className="flex items-center gap-2 sm:gap-3">
        <div
          className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 ring cursor-pointer ring-blue-400 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden relative`}
          onClick={() => {
            if (selectedChat?.product) {
              openInNewTab(`/product/${selectedChat.product.id}`);
            } else {
              errorToast("This product does not exist");
            }
          }}
        >
          {selectedChat.product?.image ? (
            <img
              src={selectedChat.product?.image}
              alt={selectedChat.product_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <FiBox className="text-blue-600" size={28} />
            </div>
          )}
          {!selectedChat.chat_enabled && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <FiX className="text-white" size={18} />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1 gap-2">
            <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
              <h4 className="font-semibold text-blue-900 text-sm sm:text-base truncate">
                {selectedChat.buyer == user?.username
                  ? selectedChat.store.store_name
                  : selectedChat.buyer}
              </h4>
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                {selectedChat.buyer == user?.username && (
                  <span className="px-2 py-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold rounded-full flex items-center">
                    <MdStorefront className="sm:mr-1" size={12} />
                    <span className="hidden sm:inline">SELLER</span>
                  </span>
                )}
                {!selectedChat.chat_enabled && (
                  <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
                    Closed
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => fetchMessages(selectedChat.id, true)}
              className="p-1.5 sm:p-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow hover:from-blue-600 hover:to-cyan-600 transition-colors duration-300 flex-shrink-0"
              title="Refresh messages"
            >
              <FiRefreshCcw
                size={16}
                className="sm:size-[18px] animate-spin-slow-once"
              />
            </button>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-xs sm:text-sm text-blue-800 font-medium truncate min-w-0">
              {selectedChat.product_name}
            </p>
          </div>
        </div>
      </div>
      {!selectedChat.chat_enabled && (
        <p className="text-xs sm:text-sm text-rose-600 mt-2">
          This chat conversation is no longer active. You can view previous
          messages but cannot send new ones.
        </p>
      )}
    </div>
  );
};

export default ChatHeader;
