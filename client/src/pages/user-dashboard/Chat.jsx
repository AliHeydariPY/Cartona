import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { FiMenu, FiX, FiLock, FiMessageSquare } from "react-icons/fi";

import {
  getPurchaseChats,
  sendMessagse,
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
import useDebounce from "../../hooks/useDebounce";
import ChatHeader from "../../components/chats/ChatHeader";
import MessagesList from "../../components/chats/MessageList";

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
  const [searchResults, setSearchResults] = useState({});

  const [isConversationLoading, setIsConversationLoading] = useState(true);
  const [isMessagesLoading, setIsMessagesLoading] = useState(true);

  const debouncedSearch = useDebounce(searchQuery, 600);

  useEffect(() => {
    if (!user) return;
    const fetchPVs = async () => {
      try {
        let allPVs = [];

        try {
          const res = await getPurchases();
          allPVs = res?.data || [];
        } catch (error) {
          console.warn("getPurchasesByBuyer failed:", error);
        }

        const pvs = await Promise.all(
          allPVs.map(async (pv) => {
            const storekeeper = await getStorekeeperById(pv.storekeeper);
            try {
              const product = await getProduct(pv.product);

              return {
                store: { ...storekeeper.data },
                ...pv,
                product: { ...product.data },
              };
            } catch {
              return {
                store: { ...storekeeper.data },
                ...pv,
                product: null,
              };
            }
          })
        );
        setIsConversationLoading(false);
        setConversations(pvs.filter(Boolean));
      } catch (error) {
        console.error("fetchPVs failed:", error);
      }
    };

    fetchPVs();
  }, [user]);

  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setSearchResults({});
      return;
    }

    const query = debouncedSearch.toLowerCase().trim();

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

    setSearchResults({ result: results, status: "done" });
  }, [debouncedSearch, conversations]);

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

  const bumpConversation = (chatId) => {
    setConversations((prev) => {
      const target = prev.find((c) => c.id == chatId);
      if (!target) return prev;

      const rest = prev.filter((c) => c.id != chatId);

      return [target, ...rest];
    });
  };

  const fetchMessages = async (purchaseID, isRefresh) => {
    try {
      const chatsRes = await getPurchaseChats(purchaseID);

      if (isRefresh && chatsRes.data.length != messages.length) {
        bumpConversation(purchaseID);
      }

      const sortMessages = await Promise.all(
        chatsRes.data.map(async (message) => {
          return { ...message };
        })
      );
      setMessages(sortMessages.reverse());
    } catch {
      setMessages([]);
    } finally {
      setIsMessagesLoading(false);
    }
  };

  ///////////////////////////FIX////////////////////////////////

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    message: null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [prevMessage, setPrevMessage] = useState("");
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const handleClick = () => {
    setContextMenu((prev) => {
      return { ...prev, visible: false };
    });
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
      .catch(() => {
        errorToast("There is a problem");
      });
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults({});
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
            isConversationLoading={isConversationLoading}
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
            setIsMessagesLoading={setIsMessagesLoading}
          />

          <div className="flex-1 flex flex-col min-w-0">
            {selectedChat ? (
              <>
                <ChatHeader
                  selectedChat={selectedChat}
                  user={user}
                  fetchMessages={fetchMessages}
                />

                <MessagesList
                  messages={messages}
                  selectedChat={selectedChat}
                  isMessagesLoading={isMessagesLoading}
                  user={user}
                  setSelectedMessages={setSelectedMessages}
                  setIsSelectionMode={setIsSelectionMode}
                  setContextMenu={setContextMenu}
                  contextMenu={contextMenu}
                  fetchMessages={fetchMessages}
                  selectedMessages={selectedMessages}
                  chatID={chatID}
                  isSelectionMode={isSelectionMode}
                  setMessage={setMessage}
                  setPrevMessage={setPrevMessage}
                  setIsEditing={setIsEditing}
                  messagesEndRef={messagesEndRef}
                  setDeletePopup={setDeletePopup}
                />

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
                    bumpConversation={bumpConversation}
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
