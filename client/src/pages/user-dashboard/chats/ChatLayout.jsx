import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMessageSquare,
  FiUsers,
  FiMenu,
  FiX,
  FiSearch,
  FiSend,
  FiShoppingBag,
} from "react-icons/fi";
import { RiSendPlaneFill } from "react-icons/ri";
import { MdStorefront, MdOutlineWorkspacePremium } from "react-icons/md";

import { getPurchases } from "../../../services/commentAPIServices";
import { getShopkeeper } from "../../../services/userAPIServices";
import { getProduct } from "../../../services/productAPIServices";

const ChatLayout = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPVs = async () => {
      const pvsRes = await getPurchases(localStorage.getItem("userID"));
      console.log(pvsRes.data);

      const pvs = await Promise.all(
        pvsRes.data.map(async (pv) => {
          const storekeeper = await getShopkeeper(pv.storekeeper);
          const product = await getProduct(pv.product);
          console.log(pv);
          console.log(storekeeper.data);
          console.log(product.data);

          console.log({
            store: { ...storekeeper.data },
            ...pv,
            product: { ...product.data },
          });

          return {
            store: { ...storekeeper.data },
            ...pv,
            product: { ...product.data },
          };
        })
      );
      setConversations(pvs);
    };

    fetchPVs();
  }, []);
  // داده‌های نمونه
  // const conversations = [
  //   { id: 1, name: "John Doe", lastMessage: "Hello there!", unread: 2, time: "2:30 PM" },
  //   { id: 2, name: "Alice Smith", lastMessage: "Thanks for your help!", unread: 0, time: "Yesterday" },
  //   { id: 3, name: "Tech Support", lastMessage: "Your issue has been resolved", unread: 1, time: "12:45 PM" },
  //   { id: 4, name: "Sarah Johnson", lastMessage: "Let's meet tomorrow", unread: 0, time: "Monday" },

  // ];

  const messages = selectedChat
    ? [
        {
          id: 1,
          text: "Hello! How can I help you today?",
          sender: "them",
          time: "2:25 PM",
        },
        {
          id: 2,
          text: "I have a question about my order",
          sender: "me",
          time: "2:26 PM",
        },
        {
          id: 3,
          text: "Sure, I'd be happy to help. What's your order number?",
          sender: "them",
          time: "2:27 PM",
        },
      ]
    : [];

  if (!conversations[0]) return <p>loading...</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="lg:col-span-3"
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg border border-blue-400 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 overflow-hidden">
        {/* هدر برای موبایل */}
        <div className="xl:hidden flex items-center justify-between p-4 border-b border-blue-200">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
          >
            {showSidebar ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
          <h2 className="text-lg font-semibold text-blue-900">Messages</h2>
          <div className="w-10"></div>
        </div>

        <div className="flex h-[785px]">
          {/* Sidebar */}
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
                      }}
                      className={`p-4 border-b border-blue-100 cursor-pointer transition-colors group hover:bg-blue-50 ${
                        selectedChat?.id === conversation.id
                          ? "bg-blue-100"
                          : ""
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
                                      -
                                      {conversation.product.discount_percentage}
                                      %
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

          {/* بخش اصلی چت */}
          <div className="flex-1 flex flex-col">
            {selectedChat ? (
              <>
                {/* هدر چت با اطلاعات محصول */}
                <div className="p-4 border-b border-blue-200 bg-white/80">
                  <div className="flex items-center space-x-3">
                    {/* تصویر محصول */}
                    <div className="w-16 ring ring-blue-400 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img
                        src={selectedChat.product.image}
                        alt={selectedChat.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-blue-900">
                          {selectedChat.store.store_name}
                        </h4>
                        <span className="ml-2 px-2 py-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold rounded-full flex items-center">
                          <MdStorefront className="mr-1 mb-0.25" size={15} />{" "}
                          SELLER
                        </span>
                      </div>

                      <p className="text-sm text-blue-800 font-medium mb-1">
                        {selectedChat.product.name}
                      </p>

                      <div className="flex items-center space-x-2">
                        {selectedChat.product.discounted_price ? (
                          <>
                            <span className="text-lg font-bold text-blue-800">
                              ${selectedChat.product.discounted_price}
                            </span>
                            <span className="text-sm text-rose-500 line-through">
                              ${selectedChat.product.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-blue-800">
                            ${selectedChat.product.price}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* پیام‌ها */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-blue-50/50 to-cyan-50/50">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${
                        message.sender === "me"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          message.sender === "me"
                            ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                            : "bg-white border border-blue-200 text-blue-900"
                        }`}
                      >
                        <p>{message.text}</p>
                        <span
                          className={`text-xs ${
                            message.sender === "me"
                              ? "text-blue-100"
                              : "text-blue-500"
                          }`}
                        >
                          {message.time}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* input ارسال پیام */}
                <div className="p-4 border-t border-blue-200 bg-white/80">
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-blue-300 rounded-full hover:outline-none hover:ring-1 hover:ring-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-all duration-300"
                    />
                    <button
                      onClick={() => {
                        if (message.trim()) {
                          // ارسال پیام
                          setMessage("");
                        }
                      }}
                      className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-3 rounded-full hover:from-blue-700 hover:to-cyan-600 cursor-pointer transition-colors duration-300"
                    >
                      <RiSendPlaneFill size={18} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* حالت انتخاب نشدن چت */
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
                <div className="text-center text-blue-600">
                  <FiShoppingBag
                    size={48}
                    className="mx-auto mb-4 opacity-60"
                  />
                  <h3 className="text-xl font-semibold mb-2">
                    Select a conversation
                  </h3>
                  <p>Choose a product chat to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatLayout;
