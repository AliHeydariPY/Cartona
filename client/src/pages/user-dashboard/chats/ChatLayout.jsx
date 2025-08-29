import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion, number } from "framer-motion";
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
  deleteMessagse,
} from "../../../services/commentAPIServices";
import { getShopkeeper, getBuyer } from "../../../services/userAPIServices";
import { getProduct } from "../../../services/productAPIServices";

const ChatLayout = () => {
  const { chatID } = useParams();
  const [selectedChat, setSelectedChat] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const userID = localStorage.getItem("userID");
  const storekeeperID = localStorage.getItem("storekeeperID");

  useEffect(() => {
    const fetchPVs = async () => {
      try {
        let pvsByBuyer = [];
        let pvsByStorekeeper = [];

        try {
          const res = await getPurchasesByBuyer(userID);
          pvsByBuyer = res?.data || [];
        } catch (error) {
          console.warn("getPurchasesByBuyer failed:", error);
        }

        if (storekeeperID) {
          try {
            const res = await getPurchasesByStorekeepre(storekeeperID);
            pvsByStorekeeper = res?.data || [];
          } catch (error) {
            console.warn("getPurchasesByStorekeepre failed:", error);
          }
        }

        const allPVs = [...pvsByBuyer, ...pvsByStorekeeper];

        const pvs = await Promise.all(
          allPVs.map(async (pv) => {
            try {
              const storekeeper = await getShopkeeper(pv.storekeeper);
              const product = await getProduct(pv.product);

              if (storekeeper.data.id == storekeeperID) {
                const user = await getBuyer(pv.buyer);
                return {
                  user: { ...user.data },
                  ...pv,
                  product: { ...product.data },
                };
              } else {
                return {
                  store: { ...storekeeper.data },
                  ...pv,
                  product: { ...product.data },
                };
              }
            } catch (err) {
              console.error("Error fetching pv details:", err);
              return null; // اینجوری اون یکی pv خراب می‌افته بیرون
            }
          })
        );

        // حذف nullها
        setConversations(pvs.filter(Boolean));
      } catch (error) {
        console.error("fetchPVs failed:", error);
      }
    };

    fetchPVs();
  }, [userID, storekeeperID]);

  useEffect(() => {
    if (!conversations[0]) return;
    const chat = conversations.find((conversation) => {
      return conversation.id == chatID;
    });
    setSelectedChat(chat);
    fetchMessages(chatID);
  }, [conversations, chatID]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
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

  ///////////////////////////FIX////////////////////////////////

  const [selectedMessages, setSelectedMessages] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    message: null,
  });
  const [longPressTimer, setLongPressTimer] = useState(null);
  const messagesContainerRef = useRef(null);

  // هندلر راست کلیک
  const handleContextMenu = (e, message) => {
    e.preventDefault();

    // فقط برای پیام‌های کاربر
    if (message.sender != userID) return;

    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      message: message,
    });
  };

  // هندلر کلیک برای بستن منوی راست کلیک
  const handleClick = () => {
    setContextMenu({ visible: false, x: 0, y: 0, message: null });
  };

  // هندلر شروع نگه‌داشتن (لمس یا ماوس)
  const handleTouchStart = (message) => {
    if (message.sender != userID) return;

    const timer = setTimeout(() => {
      setIsSelectionMode(true);
      setSelectedMessages([message.id]);
    }, 500); // 500ms delay for long press

    setLongPressTimer(timer);
  };

  // هندلر پایان نگه‌داشتن
  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  // هندلر انتخاب از منوی راست کلیک
  const handleSelectOption = () => {
    setIsSelectionMode(true);
    if (contextMenu.message) {
      setSelectedMessages([contextMenu.message.id]);
    }
    setContextMenu({ visible: false, x: 0, y: 0, message: null });
  };

  // هندلر حذف پیام‌ها
  const handleDeleteMessages = async (messageID) => {
    if (typeof messageID == "number") {
      deleteMessagse(messageID).then(() => {
        fetchMessages(chatID);
      });
    } else {
      await Promise.all(
        selectedMessages.map(async (msgID) => {
          await deleteMessagse(msgID);
        })
      );
      fetchMessages(chatID);
    }

    setSelectedMessages([]);
    setIsSelectionMode(false);
    setContextMenu({ visible: false, x: 0, y: 0, message: null });
  };

  const handleMessageClick = (messageId, senderId) => {
    if (!isSelectionMode || senderId != userID) return;

    if (selectedMessages.includes(messageId)) {
      setSelectedMessages(selectedMessages.filter((id) => id !== messageId));
      if (!selectedMessages.filter((id) => id !== messageId)[0]) {
        setIsSelectionMode(false);
      }
    } else {
      setSelectedMessages([...selectedMessages, messageId]);
    }
  };

  // اضافه کردن event listener برای کلیک
  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

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
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-blue-900">
                            {selectedChat.user
                              ? selectedChat.user.username
                              : selectedChat.store.store_name}
                          </h4>
                          <div className="flex items-center space-x-2">
                            {!selectedChat.user && (
                              <span className="px-2 py-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold rounded-full flex items-center">
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
                <div
                  className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-blue-50/50 to-cyan-50/50"
                  ref={messagesContainerRef}
                >
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
                      onContextMenu={(e) => handleContextMenu(e, message)}
                      onTouchStart={() => handleTouchStart(message)}
                      onTouchEnd={handleTouchEnd}
                      onMouseDown={() => handleTouchStart(message)}
                      onMouseUp={handleTouchEnd}
                      onMouseLeave={handleTouchEnd}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-3 py-2 rounded-xl relative cursor-pointer ${
                          message.sender == userID
                            ? "bg-gradient-to-br from-blue-600 to-cyan-500 text-white"
                            : "bg-white border border-blue-200 text-blue-900"
                        } ${
                          selectedMessages.includes(message.id)
                            ? "ring-2 ring-blue-500 ring-offset-2"
                            : ""
                        }`}
                        onClick={() =>
                          handleMessageClick(message.id, message.sender)
                        }
                      >
                        {/* نشانگر انتخاب برای پیام‌های کاربر */}
                        {isSelectionMode && message.sender == userID && (
                          <div
                            className={`absolute -left-2 -top-2 w-5 h-5 rounded-full flex items-center justify-center ${
                              selectedMessages.includes(message.id)
                                ? "bg-blue-600 text-white"
                                : "bg-white border border-gray-300"
                            }`}
                          >
                            {selectedMessages.includes(message.id) && (
                              <span className="text-xs">✓</span>
                            )}
                          </div>
                        )}

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

                  {/* منوی راست کلیک */}
                  {contextMenu.visible && (
                    <div
                      className="fixed bg-white rounded-lg shadow-lg py-2 z-50"
                      style={{
                        top: contextMenu.y - 125,
                        left: contextMenu.x - 385,
                      }}
                    >
                      <div
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={handleSelectOption}
                      >
                        Select
                      </div>
                      <div
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
                        onClick={() => {
                          setSelectedMessages([contextMenu.message.id, 3]);
                          handleDeleteMessages(contextMenu.message.id);
                        }}
                      >
                        Delete
                      </div>
                    </div>
                  )}

                  {/* نوار ابزار انتخاب */}
                  {isSelectionMode && selectedMessages.length > 0 && (
                    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg border border-gray-200 flex items-center space-x-4">
                      <span className="text-blue-600">
                        {selectedMessages.length} selected
                      </span>
                      <button
                        onClick={handleDeleteMessages}
                        className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => {
                          setIsSelectionMode(false);
                          setSelectedMessages([]);
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

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
