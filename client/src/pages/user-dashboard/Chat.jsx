import { convertOffsetToTimes, motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Portal } from "react-portal";
import { FaRegCircleCheck } from "react-icons/fa6";

import { RiEdit2Line } from "react-icons/ri";
import {
  FiMenu,
  FiX,
  FiLock,
  FiRefreshCcw,
  FiTrash2,
  FiMessageSquare,
} from "react-icons/fi";
import { MdStorefront } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { TbEditCircle } from "react-icons/tb";

import {
  getPurchaseChats,
  getPurchasesByStorekeepre,
  sendMessagse,
  deleteMessagse,
  editMessage,
  getPurchases,
  deletePurchases,
} from "../../services/commentAPIServices";
import { getStorekeeperById } from "../../services/userAPIServices";
import { getProduct } from "../../services/productAPIServices";

import ChatSidebar from "./chats/ChatSidebar";
import ChatInput from "./chats/ChatInput";
import { useAtom } from "jotai";
import { userAtom } from "../../atoms/userAtom";
import DeleteChatPopup from "../../components/pop-ups/DeleteChatPopup";
import { errorToast, successToast } from "../../utils/toast";

const Chat = () => {
  const { chatID } = useParams();
  const navigate = useNavigate();
  const [user] = useAtom(userAtom);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showSidebar, setShowSidebar] = useState(
    window.innerWidth >= 1280 ? true : false
  );
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [emojiBox, setEmojiBox] = useState(false);
  const messagesEndRef = useRef(null);
  const [deletePopup, setDeletePopup] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPVs = async () => {
      try {
        let pvsByBuyer = [];
        let pvsByStorekeeper = [];

        try {
          const res = await getPurchases();
          pvsByBuyer = res?.data || [];
        } catch (error) {
          console.warn("getPurchasesByBuyer failed:", error);
        }

        if (user.storekeeper_id) {
          try {
            const res = await getPurchasesByStorekeepre(user.storekeeper_id);
            pvsByStorekeeper = res?.data || [];
          } catch (error) {
            console.warn("getPurchasesByStorekeepre failed:", error);
          }
        }

        const allPVs = [...pvsByBuyer, ...pvsByStorekeeper];
        const pvs = await Promise.all(
          allPVs.map(async (pv) => {
            try {
              const storekeeper = await getStorekeeperById(pv.storekeeper);
              const product = await getProduct(pv.product);

              return {
                store: { ...storekeeper.data },
                ...pv,
                product: { ...product.data },
              };
            } catch (err) {
              console.error("Error fetching pv details:", err);
              return null;
            }
          })
        );
        setIsLoading(false);
        setConversations(pvs.filter(Boolean));
      } catch (error) {
        console.error("fetchPVs failed:", error);
      }
    };

    fetchPVs();
  }, [user]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const results = conversations.filter((conversation) => {
      const productName = conversation.product?.name?.toLowerCase() || "";
      const storeName = conversation.store?.store_name?.toLowerCase() || "";
      const buyerName = conversation.buyer?.toLowerCase() || "";

      return (
        productName.includes(query) ||
        storeName.includes(query) ||
        buyerName.includes(query) ||
        productName.split(/\s+/).some((word) => word.startsWith(query)) ||
        storeName.split(/\s+/).some((word) => word.startsWith(query))
      );
    });

    setSearchResults(results);
  }, [searchQuery, conversations]);

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

  const fetchMessages = async (purchaseID) => {
    try {
      const chatsRes = await getPurchaseChats(purchaseID);
      const sortMessages = await Promise.all(
        chatsRes.data.map(async (message) => {
          return { ...message };
        })
      );
      setMessages(sortMessages.reverse());
    } catch {
      setMessages([]);
    }
  };

  const openInNewTab = (url) => {
    window.open(url, "_blank", "noreferrer");
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
  const [firstSelectMsg, setFirstSelectMsg] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [prevMessage, setPrevMessage] = useState("");

  const handleContextMenu = (e, message) => {
    e.preventDefault();

    if (message.sender != user.username || !selectedChat?.chat_enabled) return;

    const menuWidth = 100;
    const menuHeight = 200;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    let x = e.clientX;
    let y = e.clientY;

    if (x + menuWidth > screenWidth) {
      x = screenWidth - menuWidth - 10;
    }
    if (y + menuHeight > screenHeight) {
      y = screenHeight - menuHeight - 70;
    }

    setContextMenu({
      visible: true,
      x,
      y,
      message,
    });
  };

  const handleClick = () => {
    setContextMenu((prev) => {
      return { ...prev, visible: false };
    });
  };

  const handleTouchStart = (message) => {
    if (message.sender != user.username || !selectedChat?.chat_enabled) return;

    const timer = setTimeout(() => {
      setIsSelectionMode(true);
      setSelectedMessages([message.id]);
    }, 500);

    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleSelectOption = () => {
    setIsSelectionMode(true);
    if (contextMenu.message) {
      setSelectedMessages([contextMenu.message.id]);
    }
    setContextMenu({ visible: false, x: 0, y: 0, message: null });
  };

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
    if (!isSelectionMode || senderId != user.username) return;
    if (firstSelectMsg) {
      setFirstSelectMsg(false);
    } else {
      if (selectedMessages.includes(messageId)) {
        setSelectedMessages(selectedMessages.filter((id) => id !== messageId));
        if (!selectedMessages.filter((id) => id !== messageId)[0]) {
          setIsSelectionMode(false);
          setFirstSelectMsg(true);
        }
      } else {
        setSelectedMessages([...selectedMessages, messageId]);
      }
    }
  };

  const handleEditMessage = () => {
    setMessage(contextMenu.message.message);
    setPrevMessage(contextMenu.message.message);
    setIsEditing(true);
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const handleDeleteChat = (chatId) => {
    deletePurchases(chatId)
      .then(() => {
        setConversations((prev) =>
          prev.filter((conversation) => {
            return conversation.id != chatId;
          })
        );
        setSelectedChat(null);
        navigate("/account/chats");
        successToast("Chat successfully deleted");
      })
      .catch((error) => {
        console.log(error);
        errorToast("There is a problem");
      });
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearchFocused(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="lg:col-span-3"
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg border border-blue-400 hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 overflow-hidden">
        <div className="xl:hidden flex items-center justify-between p-3 sm:p-4 border-b border-blue-200">
          <button
            onClick={() => {
              setShowSidebar(!showSidebar);
              if (!showSidebar) {
                setEmojiBox(false);
              }
              setIsSelectionMode(false);
              setSelectedMessages([]);
            }}
            className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors flex-shrink-0"
          >
            {showSidebar ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
          <h2 className="text-base sm:text-lg font-semibold text-blue-900 truncate px-2">
            Messages
          </h2>
          <div className="w-8 sm:w-10"></div>
        </div>

        <div className="flex h-[500px] xs:h-[550px] sm:h-[600px] lg:h-[695px] xl:h-[764px] 2xl:h-[780px]">
          <ChatSidebar
            isLoading={isLoading}
            conversations={conversations}
            setSelectedChat={setSelectedChat}
            showSidebar={showSidebar}
            setShowSidebar={setShowSidebar}
            selectedChat={selectedChat}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchResults={searchResults}
            isSearchFocused={isSearchFocused}
            setIsSearchFocused={setIsSearchFocused}
            clearSearch={clearSearch}
          />

          <div className="flex-1 flex flex-col min-w-0">
            {selectedChat ? (
              <>
                <div className="p-3 sm:p-4 border-b border-blue-200 bg-white/80 flex-shrink-0">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 ring cursor-pointer ring-blue-400 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden relative`}
                      onClick={() =>
                        openInNewTab(`/product/${selectedChat.product.id}`)
                      }
                    >
                      <img
                        src={selectedChat.product.image}
                        alt={selectedChat.product.name}
                        className="w-full h-full object-cover"
                      />
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
                          onClick={() => fetchMessages(selectedChat.id)}
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
                          {selectedChat.product.name}
                        </p>
                      </div>
                    </div>
                  </div>
                  {!selectedChat.chat_enabled && (
                    <p className="text-xs sm:text-sm text-rose-600 mt-2">
                      This chat conversation is no longer active. You can view
                      previous messages but cannot send new ones.
                    </p>
                  )}
                </div>

                <div
                  className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 custom-chat-scroll min-h-0"
                  ref={messagesContainerRef}
                >
                  {!selectedChat.chat_enabled && (
                    <div className="fixed bottom-16 right-3 sm:right-4 md:right-6 z-50">
                      <button
                        onClick={() => setDeletePopup(selectedChat)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
                        title="Delete Chat"
                      >
                        <FiTrash2 size={16} className="sm:size-[20px]" />
                      </button>
                    </div>
                  )}

                  {messages.map((message) => {
                    const dates = [message.edited_at, message.sent_at];
                    const comparison = dates.map((time) => {
                      const date = new Date(time);
                      const hours = date.getHours().toString().padStart(2, "0");
                      const minutes = date
                        .getMinutes()
                        .toString()
                        .padStart(2, "0");
                      const seconds = date
                        .getSeconds()
                        .toString()
                        .padStart(2, "0");
                      return `${hours}:${minutes}:${seconds}`;
                    });

                    const isEdited = comparison[0] != comparison[1];
                    const editTime = comparison[0].slice(0, 5);
                    const sentTime = comparison[1].slice(0, 5);
                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex py-1 sm:py-2 rounded-r-2xl ${
                          message.sender == user?.username
                            ? "justify-end"
                            : "justify-start"
                        }
                    ${
                      selectedMessages.includes(message.id)
                        ? "bg-blue-100"
                        : null
                    }`}
                        onContextMenu={(e) => handleContextMenu(e, message)}
                        onTouchStart={() => handleTouchStart(message)}
                        onTouchEnd={handleTouchEnd}
                        onMouseDown={() => handleTouchStart(message)}
                        onMouseUp={handleTouchEnd}
                        onMouseLeave={handleTouchEnd}
                        onClick={() =>
                          handleMessageClick(message.id, message.sender)
                        }
                      >
                        <div
                          className={`max-w-[85%] xs:max-w-xs sm:max-w-sm lg:max-w-md px-3 py-2 rounded-xl relative cursor-pointer ${
                            message.sender == user?.username
                              ? "bg-gradient-to-br from-blue-600 to-cyan-500 text-white"
                              : "bg-white border border-blue-200 text-blue-900"
                          } ${
                            selectedMessages.includes(message.id)
                              ? "ring-2 ring-blue-500 ring-offset-1 sm:ring-offset-2"
                              : ""
                          }`}
                        >
                          {isSelectionMode &&
                            message.sender == user?.username && (
                              <div
                                className={`absolute -left-1 -top-1 sm:-left-2 sm:-top-2 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center ${
                                  selectedMessages.includes(message.id)
                                    ? "bg-blue-600 text-white"
                                    : "bg-white border border-gray-300"
                                }`}
                              >
                                {selectedMessages.includes(message.id) && (
                                  <FaCheck
                                    size={10}
                                    className="sm:size-[12px]"
                                  />
                                )}
                              </div>
                            )}

                          <div
                            style={{ whiteSpace: "pre-wrap" }}
                            className="break-words whitespace-pre-wrap text-sm sm:text-base"
                          >{`${message.message}`}</div>

                          <div className="flex items-center space-x-1 mt-1 text-xs">
                            {isEdited ? (
                              <span
                                className={`flex items-center space-x-1 ${
                                  message.sender == user?.username
                                    ? "text-blue-100"
                                    : "text-blue-500"
                                }`}
                              >
                                <RiEdit2Line className="mb-0.5" size={11} />
                                <span>{editTime}</span>
                              </span>
                            ) : (
                              <span
                                className={
                                  message.sender == user?.username
                                    ? "text-blue-100"
                                    : "text-blue-500"
                                }
                              >
                                {sentTime}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {contextMenu.visible && (
                    <Portal>
                      <div
                        className="bg-white/95 backdrop-blur-sm text-blue-950 border border-gray-200 rounded-lg shadow-xl z-50"
                        style={{
                          position: "fixed",
                          top: contextMenu.y,
                          left: Math.max(10, contextMenu.x - 80),
                          right: 10,
                          maxWidth: "200px",
                        }}
                      >
                        <div
                          className="flex items-center gap-2 px-3 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                          onClick={handleSelectOption}
                        >
                          <FaRegCircleCheck
                            className="text-blue-600"
                            size={14}
                          />
                          <span>Select</span>
                        </div>

                        <div
                          className="flex items-center gap-1 px-3 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                          onClick={handleEditMessage}
                        >
                          <TbEditCircle size={16} className="text-green-600" />
                          <span>Edit</span>
                        </div>

                        <div
                          className="flex items-center gap-2 px-3 py-2 hover:bg-blue-100 cursor-pointer text-red-600 text-sm"
                          onClick={() => {
                            setSelectedMessages([contextMenu.message.id, 3]);
                            handleDeleteMessages(contextMenu.message.id);
                          }}
                        >
                          <FiTrash2 size={14} />
                          <span>Delete</span>
                        </div>
                      </div>
                    </Portal>
                  )}

                  {isSelectionMode && selectedMessages.length > 0 && (
                    <div className="fixed top-32 sm:top-36 md:top-40 left-1/2 transform -translate-x-1/2 bg-white px-3 sm:px-4 py-2 rounded-full shadow-lg border border-gray-200 flex items-center space-x-2 sm:space-x-4 text-sm z-50">
                      <span className="text-blue-600 whitespace-nowrap">
                        {selectedMessages.length} selected
                      </span>
                      <button
                        onClick={handleDeleteMessages}
                        className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded-full hover:bg-red-600 transition-colors text-xs sm:text-sm"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => {
                          setIsSelectionMode(false);
                          setSelectedMessages([]);
                        }}
                        className="text-gray-500 hover:text-gray-700 text-xs sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {selectedChat.chat_enabled ? (
                  <ChatInput
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    prevMessage={prevMessage}
                    message={message}
                    setMessage={setMessage}
                    sendMessagse={sendMessagse}
                    editMessage={editMessage}
                    fetchMessages={fetchMessages}
                    chatID={chatID}
                    contextMenu={contextMenu}
                    setContextMenu={setContextMenu}
                    selectedChat={selectedChat}
                    emojiBox={emojiBox}
                    setEmojiBox={setEmojiBox}
                  />
                ) : (
                  <div className="p-3 sm:p-4 border-t border-blue-200 bg-rose-50/80 text-center flex-shrink-0">
                    <p className="text-rose-700 text-xs sm:text-sm">
                      <FiLock
                        className="inline mr-1 sm:mr-2 mb-0.5"
                        size={14}
                      />
                      This chat is closed. You can no longer send messages.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
                <div className="text-center text-blue-600 w-full max-w-[280px] xs:max-w-xs sm:max-w-sm md:max-w-md">
                  <div className="bg-blue-50/70 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200">
                    <FiMessageSquare
                      className="text-blue-400 mx-auto mb-3 sm:mb-4"
                      size={40}
                    />

                    <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-2">
                      Select a conversation
                    </h3>

                    <p className="text-blue-600 text-sm sm:text-base mb-4 sm:mb-6">
                      Choose a product chat to start messaging
                    </p>

                    <div className="flex justify-center space-x-2 opacity-50">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {deletePopup && (
        <DeleteChatPopup
          onClose={() => setDeletePopup(null)}
          chat={deletePopup}
          onConfirm={handleDeleteChat}
        />
      )}
    </motion.div>
  );
};

export default Chat;
