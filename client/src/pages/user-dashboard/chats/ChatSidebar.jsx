import { motion, AnimatePresence } from "framer-motion";
import {
  FiMessageSquare,
  FiSearch,

} from "react-icons/fi";
import { MdStorefront } from "react-icons/md";

const ChatSidebar = ({ conversations, setSelectedChat, showSidebar, setShowSidebar, fetchMessages, selectedChat }) => {
  return (
    <AnimatePresence>
      {(showSidebar || window.innerWidth >= 1280) && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-8/12 xl:w-80 border-r border-blue-200 bg-white/50 flex flex-col"
        >
          {/* هدر سایدبار */}
          <div className="p-4 border-b border-blue-200">
            <div className="flex items-center justify-between mb-3 pl-1">
              <h3 className="text-lg font-semibold text-blue-900">
                Conversations
              </h3>
              <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                <FiMessageSquare size={18} />
              </button>
            </div>

            {/* جستجو */}
            <div className="relative">
              <FiSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-900"
              />
            </div>
          </div>

          {/* لیست چت‌ها با اطلاعات محصول */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => {
                  setSelectedChat(conversation);
                  setShowSidebar(false);
                  fetchMessages(conversation.id);
                }}
                className={`p-4 border-b border-blue-100 cursor-pointer transition-colors group hover:bg-blue-50 ${
                  selectedChat?.id === conversation.id ? "bg-blue-100" : ""
                }`}
              >
                <div className="flex items-start space-x-3">
                  {/* تصویر محصول */}
                  <div
                    className={`w-16 h-16 ${
                      selectedChat?.id === conversation.id
                        ? "ring ring-blue-400"
                        : ""
                    } group-hover:ring group-hover:ring-blue-400 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden transition-all duration-300`}
                  >
                    <img
                      src={conversation.product.image}
                      alt={conversation.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* نام فروشگاه و زمان */}
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="flex font-semibold text-blue-900 truncate">
                        {conversation.store.store_name}
                        <span className="mt-1 ml-1 text-blue-800">
                          <MdStorefront size={15} />
                        </span>
                      </h4>
                      <span className="text-xs text-blue-500 whitespace-nowrap">
                        {conversation.time}
                      </span>
                    </div>

                    {/* نام محصول و قیمت */}
                    <div className="mb-2">
                      <p className="text-sm font-medium text-blue-800 truncate">
                        {conversation.product.name}
                      </p>
                      <div className="flex items-center space-x-2">
                        {conversation.product.discounted_price ? (
                          <>
                            <span className="text-sm font-bold text-blue-800">
                              ${conversation.product.discounted_price}
                            </span>
                            <span className="text-xs text-rose-500 line-through">
                              ${conversation.product.price}
                            </span>
                            {conversation.product.discount_percentage && (
                              <span className="text-xs bg-gradient-to-r from-rose-500 to-pink-500 text-white px-2 py-0.5 rounded-full">
                                -{conversation.product.discount_percentage}%
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-sm font-bold text-blue-800">
                            ${conversation.product.price}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* آخرین پیام و وضعیت */}
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-blue-600 truncate max-w-[120px]">
                        {conversation.lastMessage}
                      </p>
                      {conversation.unread > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatSidebar;
