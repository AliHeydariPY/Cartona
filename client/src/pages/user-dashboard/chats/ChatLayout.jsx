import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  FiMenu,
  FiX,
  FiShoppingBag,
  FiLock,
  FiRefreshCcw,
} from "react-icons/fi";
import { RiSendPlaneFill } from "react-icons/ri";
import { MdStorefront } from "react-icons/md";
import ChatSidebar from "./ChatSidebar";
import {
  getPurchaseChats,
  getPurchasesByBuyer,
  getPurchasesByStorekeepre,
  sendMessagse,
} from "../../../services/commentAPIServices";
import { getShopkeeper, getBuyer } from "../../../services/userAPIServices";
import { getProduct } from "../../../services/productAPIServices";

const ChatLayout = ({ reloadComponent, setReloadComponent }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const userID = localStorage.getItem("userID");
  const storekeeperID = localStorage.getItem("storekeeperID");

  // وقتی لیست پیام‌ها تغییر کرد => اسکرول کن به آخر
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const fetchPVs = async () => {
      if (!storekeeperID) {
        const pvsRes = await getPurchasesByBuyer(userID);

        console.log(pvsRes.data);

        const pvs = await Promise.all(
          pvsRes.data.map(async (pv) => {
            const storekeeper = await getShopkeeper(pv.storekeeper);
            const product = await getProduct(pv.product);

            return {
              store: { ...storekeeper.data },
              ...pv,
              product: { ...product.data },
            };
          })
        );
        setConversations(pvs);
      } else {
        const pvsRes = await getPurchasesByStorekeepre(storekeeperID);

        console.log(pvsRes);

        const pvs = await Promise.all(
          pvsRes.data.map(async (pv) => {
            const user = await getBuyer(pv.buyer);
            const product = await getProduct(pv.product);

            return {
              user: { ...user.data },
              ...pv,
              product: { ...product.data },
            };
          })
        );
        setConversations(pvs);
      }
    };

    fetchPVs();
  }, [reloadComponent]);
  // داده‌های نمونه
  // const conversations = [
  //   { id: 1, name: "John Doe", lastMessage: "Hello there!", unread: 2, time: "2:30 PM" },
  //   { id: 2, name: "Alice Smith", lastMessage: "Thanks for your help!", unread: 0, time: "Yesterday" },
  //   { id: 3, name: "Tech Support", lastMessage: "Your issue has been resolved", unread: 1, time: "12:45 PM" },
  //   { id: 4, name: "Sarah Johnson", lastMessage: "Let's meet tomorrow", unread: 0, time: "Monday" },

  // ];

  // const messages = selectedChat
  //   ? [
  //       {
  //         id: 1,
  //         text: "Hello! How can I help you today?",
  //         sender: "them",
  //         time: "2:25 PM",
  //       },
  //       {
  //         id: 2,
  //         text: "I have a question about my order",
  //         sender: "me",
  //         time: "2:26 PM",
  //       },
  //       {
  //         id: 3,
  //         text: "Sure, I'd be happy to help. What's your order number?",
  //         sender: "them",
  //         time: "2:27 PM",
  //       },
  //     ]
  //   : [];

  const fetchMessages = async (purchaseID) => {
    try {
      const chatsRes = await getPurchaseChats(purchaseID);
      const sortMessages = await Promise.all(
        chatsRes.data.map(async (message) => {
          const dateStr = message.sent_at;
          const date = new Date(dateStr.replace(" ", "T"));

          const hours = date.getHours().toString().padStart(2, "0");
          const minutes = date.getMinutes().toString().padStart(2, "0");

          const sent_at = `${hours}:${minutes}`;

          return { ...message, sent_at };
        })
      );
      setMessages(sortMessages.reverse());
    } catch {
      setMessages([]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="lg:col-span-3"
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg border border-blue-400 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 overflow-hidden">
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

        <div className="flex h-[700px] xl:h-[762px] 2xl:h-[785px]">
          {/* Sidebar */}
          <ChatSidebar
            conversations={conversations}
            setSelectedChat={setSelectedChat}
            showSidebar={showSidebar}
            setShowSidebar={setShowSidebar}
            fetchMessages={fetchMessages}
            selectedChat={selectedChat}
          />

          {/* بخش اصلی چت */}
          <div className="flex-1 flex flex-col">
            {selectedChat ? (
              <>
                {/* هدر چت با وضعیت */}
                <div className="p-4 border-b border-blue-200 bg-white/80">
                  <div className="flex items-center space-x-3">
                    {/* تصویر محصول با وضعیت */}
                    <div
                      className={`w-16 h-16 ring ring-blue-400 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden relative`}
                    >
                      <img
                        src={selectedChat.product.image}
                        alt={selectedChat.product.name}
                        className="w-full h-full object-cover"
                      />
                      {!selectedChat.chat_enabled && (
                        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                          <FiX className="text-white" size={24} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <h4 className="font-semibold text-blue-900">
                            {storekeeperID
                              ? selectedChat.user.username
                              : selectedChat.store.store_name}
                          </h4>
                          <div className="flex items-center space-x-2">
                            {!storekeeperID && (
                              <span className="ml-2 px-2 py-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold rounded-full flex items-center">
                                <MdStorefront
                                  className="mr-1 mb-0.25"
                                  size={15}
                                />{" "}
                                SELLER
                              </span>
                            )}
                            {!selectedChat.chat_enabled && (
                              <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                                Chat Closed
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => fetchMessages(selectedChat.id)}
                          className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
                          title="Refresh messages"
                        >
                          <FiRefreshCcw
                            size={18}
                            className="animate-spin-slow-once"
                          />
                        </button>
                      </div>

                      <div className="flex justify-between">
                        <p className="text-sm text-blue-800 font-medium mb-1">
                          {selectedChat.product.name}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* پیام وضعیت برای چت غیرفعال */}
                  {!selectedChat.chat_enabled && (
                    <p className="text-sm text-rose-600 mt-2">
                      This chat conversation is no longer active. You can view
                      previous messages but cannot send new ones.
                    </p>
                  )}
                </div>

                {/* پیام‌ها */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-blue-50/50 to-cyan-50/50">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${
                        message.sender == userID
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-3 py-2 rounded-xl ${
                          message.sender == userID
                            ? "bg-gradient-to-br from-blue-600 to-cyan-500 text-white"
                            : "bg-white border border-blue-200 text-blue-900"
                        }`}
                      >
                        <p>{message.message}</p>
                        <span
                          className={`text-xs ${
                            message.sender == userID
                              ? "text-blue-100"
                              : "text-blue-500"
                          }`}
                        >
                          {message.sent_at}
                        </span>
                      </div>
                    </motion.div>
                  ))}

                  {/* اینجا ref قرار می‌گیره برای اسکرول به آخر */}
                  <div ref={messagesEndRef} />
                </div>

                {/* input ارسال پیام - غیرفعال برای چت‌های بسته */}
                {selectedChat.chat_enabled ? (
                  <div className="p-4 border-t border-blue-200 bg-white/80">
                    <div className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={message}
                        onKeyDown={(e) => {
                          if (e.code == "Enter") {
                            if (message.trim() !== "") {
                              sendMessagse({
                                purchase: selectedChat.id,
                                sender: userID,
                                message: message,
                              }).then((res) => {
                                fetchMessages(res.data.purchase);
                                setMessage("");
                              });
                            }
                          }
                        }}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-blue-300 rounded-full hover:outline-none hover:ring-1 hover:ring-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-all duration-300"
                      />
                      <button
                        onClick={() => {
                          if (message.trim()) {
                            sendMessagse({
                              purchase: selectedChat.id,
                              sender: localStorage.getItem("userID"),
                              message: message,
                            }).then((res) => {
                              fetchMessages(res.data.purchase);
                              setMessage("");
                            });
                          }
                        }}
                        className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-3 rounded-full hover:from-blue-700 hover:to-cyan-600 cursor-pointer transition-colors duration-300"
                      >
                        <RiSendPlaneFill size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border-t border-blue-200 bg-rose-50/80 text-center">
                    <p className="text-rose-700 text-sm">
                      <FiLock className="inline mr-2 mb-1" />
                      This chat is closed. You can no longer send messages.
                    </p>
                  </div>
                )}
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
