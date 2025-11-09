import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { convertOffsetToTimes, motion, number } from "framer-motion";
import { Portal } from "react-portal";
import { FaRegCircleCheck } from "react-icons/fa6";

import { RiEdit2Line } from "react-icons/ri";
import {
  FiMenu,
  FiX,
  FiShoppingBag,
  FiLock,
  FiRefreshCcw,
  FiTrash2,
} from "react-icons/fi";
import { MdStorefront } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { TbEditCircle } from "react-icons/tb";

import {
  getPurchaseChats,
  getPurchasesByBuyer,
  getPurchasesByStorekeepre,
  sendMessagse,
  deleteMessagse,
  editMessage,
  getPurchases,
} from "../../services/commentAPIServices";
import { getStorekeeperById, getBuyer } from "../../services/userAPIServices";
import { getProduct } from "../../services/productAPIServices";

import ChatSidebar from "./chats/ChatSidebar";
import ChatInput from "./chats/ChatInput";
import { useAtom } from "jotai";
import { userAtom } from "../../atoms/userAtom";

const Chat = () => {
  const { chatID } = useParams();
  const [user] = useAtom(userAtom)
  const [selectedChat, setSelectedChat] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [emojiBox, setEmojiBox] = useState(false);
  const messagesEndRef = useRef(null);
  const storekeeperID = localStorage.getItem("storekeeperID");

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
              const storekeeper = await getStorekeeperById(pv.storekeeper);
              const product = await getProduct(pv.product);

              return {
                store: { ...storekeeper.data },
                ...pv,
                product: { ...product.data },
              };
              // if (storekeeper.data.user == user?.username) {
              //   const user = await getBuyer(pv.buyer);
              //   console.log(user)
              //   return {
              //     user: { ...user.data },
              //     ...pv,
              //     product: { ...product.data },
              //   };
              // } else {
              //   return {
              //     store: { ...storekeeper.data },
              //     ...pv,
              //     product: { ...product.data },
              //   };
              // }
            } catch (err) {
              console.error("Error fetching pv details:", err);
              return null;
            }
          })
        );
        console.log(pvs);
        setConversations(pvs.filter(Boolean));
      } catch (error) {
        console.error("fetchPVs failed:", error);
      }
    };

    fetchPVs();
  }, [storekeeperID]);

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
      console.log(sortMessages);
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
    if (!isSelectionMode || senderId != user.username)
      return;
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
            onClick={() => {
              setShowSidebar(!showSidebar);
              if (!showSidebar) {
                setEmojiBox(false);
              }
              setIsSelectionMode(false);
              setSelectedMessages([]);
            }}
            className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
          >
            {showSidebar ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
          <h2 className="text-lg font-semibold text-blue-900">Messages</h2>
          <div className="w-10"></div>
        </div>

        <div className="flex h-[700px] xl:h-[762px] 2xl:h-[785px]">
          <ChatSidebar
            conversations={conversations}
            setSelectedChat={setSelectedChat}
            showSidebar={showSidebar}
            setShowSidebar={setShowSidebar}
            selectedChat={selectedChat}
          />

          <div className="flex-1 flex flex-col">
            {selectedChat ? (
              <>
                <div className="p-4 border-b border-blue-200 bg-white/80 ">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-16 h-16 ring cursor-pointer ring-blue-400 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden relative`}
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
                          <FiX className="text-white" size={24} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-blue-900">
                            {selectedChat.buyer ==
                            user?.username
                              ? selectedChat.store.store_name
                              : selectedChat.buyer}
                          </h4>
                          <div className="flex items-center space-x-2">
                            {selectedChat.buyer ==
                              user?.username && (
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
                  {!selectedChat.chat_enabled && (
                    <p className="text-sm text-rose-600 mt-2">
                      This chat conversation is no longer active. You can view
                      previous messages but cannot send new ones.
                    </p>
                  )}
                </div>

                <div
                  className="flex-1 overflow-y-auto p-4 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 custom-chat-scroll"
                  ref={messagesContainerRef}
                >
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
                        className={`flex py-2 rounded-r-2xl ${
                          message.sender == user?.username
                            ? "justify-end"
                            : "justify-start"
                        }
      ${selectedMessages.includes(message.id) ? "bg-blue-100" : null}`}
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
                          className={`max-w-xs lg:max-w-md px-3 py-2 rounded-xl relative cursor-pointer ${
                            message.sender == user?.username
                              ? "bg-gradient-to-br from-blue-600 to-cyan-500 text-white"
                              : "bg-white border border-blue-200 text-blue-900"
                          } ${
                            selectedMessages.includes(message.id)
                              ? "ring-2 ring-blue-500 ring-offset-2"
                              : ""
                          }`}
                        >
                          {isSelectionMode &&
                            message.sender ==
                              user?.username && (
                              <div
                                className={`absolute -left-2 -top-2 w-5 h-5 rounded-full flex items-center justify-center ${
                                  selectedMessages.includes(message.id)
                                    ? "bg-blue-600 text-white"
                                    : "bg-white border border-gray-300"
                                }`}
                              >
                                {selectedMessages.includes(message.id) && (
                                  <FaCheck size={12} />
                                )}
                              </div>
                            )}

                          <div
                            style={{ whiteSpace: "pre-wrap" }}
                            className="break-words whitespace-pre-wrap"
                          >{`${message.message}`}</div>

                          <div className="flex items-center space-x-1 mt-1 text-xs">
                            {isEdited ? (
                              <span
                                className={`flex items-center space-x-1 ${
                                  message.sender ==
                                  user?.username
                                    ? "text-blue-100"
                                    : "text-blue-500"
                                }`}
                              >
                                <RiEdit2Line className="mb-0.5" size={13} />
                                <span>{editTime}</span>
                              </span>
                            ) : (
                              <span
                                className={
                                  message.sender ==
                                  user?.username
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
                        className="bg-white/95 backdrop-blur-sm text-blue-950 border border-gray-200 rounded-lg shadow-xl  z-50"
                        style={{
                          position: "fixed",
                          top: contextMenu.y,
                          left: contextMenu.x - 90,
                        }}
                      >
                        <div
                          className="flex items-center gap-2 px-3 py-3 hover:bg-blue-100 cursor-pointer"
                          onClick={handleSelectOption}
                        >
                          <FaRegCircleCheck className="text-blue-600 mb-0.5" />
                          <span>Select</span>
                        </div>

                        <div
                          className="flex items-center gap-1 px-3 py-3 hover:bg-blue-100 cursor-pointer"
                          onClick={handleEditMessage}
                        >
                          <TbEditCircle
                            size={20}
                            className="text-green-600 mb-0.5"
                          />
                          <span>Edit</span>
                        </div>

                        <div
                          className="flex items-center gap-2 px-3 py-3 hover:bg-blue-100 cursor-pointer text-red-600"
                          onClick={() => {
                            setSelectedMessages([contextMenu.message.id, 3]);
                            handleDeleteMessages(contextMenu.message.id);
                          }}
                        >
                          <FiTrash2 className="mb-0.5" />
                          <span>Delete</span>
                        </div>
                      </div>
                    </Portal>
                  )}

                  {isSelectionMode && selectedMessages.length > 0 && (
                    <div className="fixed top-44 left-1/2 xl:top-27 xl:left-2/3 2xl:left-3/5 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg border border-gray-200 flex items-center space-x-4">
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
                  <div className="p-4 border-t border-blue-200 bg-rose-50/80 text-center">
                    <p className="text-rose-700 text-sm">
                      <FiLock className="inline mr-2 mb-1" />
                      This chat is closed. You can no longer send messages.
                    </p>
                  </div>
                )}
              </>
            ) : (
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

export default Chat;
