import { motion, AnimatePresence } from "framer-motion";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { FiMessageSquare, FiSearch, FiX, FiLock } from "react-icons/fi";
import { MdStorefront } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { userAtom } from "../../../atoms/userAtom";
import { SectionLoader } from "../../../components/SectionLoader";

const ChatSidebar = ({
  isLoading,
  conversations,
  setSelectedChat,
  showSidebar,
  setShowSidebar,
  selectedChat,
  searchQuery,
  setSearchQuery,
  searchResults,
  isSearchFocused,
  setIsSearchFocused,
  clearSearch,
}) => {
  const navigate = useNavigate();
  const [user] = useAtom(userAtom);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        if (!showSidebar) {
          setShowSidebar(true);
        }
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [showSidebar]);

  const displayedConversations =
    isSearchFocused && searchQuery ? searchResults : conversations;

  return (
    <>
      {showSidebar && (
        <AnimatePresence>
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`w-full xs:w-10/12 sm:w-8/12 md:w-6/12 lg:w-5/12 xl:w-80 2xl:w-96 border-r border-blue-200 bg-white/80 backdrop-blur-sm flex flex-col`}
          >
            <div className="p-3 sm:p-4 border-b border-blue-200">
              <div className="flex items-center justify-between mb-3 pl-1">
                <div className="flex items-center">
                  <h3 className="text-base sm:text-lg font-semibold text-blue-900 mr-2">
                    Conversations
                  </h3>
                  <FiMessageSquare
                    size={16}
                    className="sm:size-[18px] text-blue-600"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  {searchQuery && (
                    <span className="text-xs bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-2 py-1 rounded-full whitespace-nowrap">
                      {displayedConversations.length} found
                    </span>
                  )}
                </div>
              </div>

              <div className="relative">
                {searchQuery ? (
                  <FiX
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 cursor-pointer"
                    size={16}
                    onClick={clearSearch}
                  />
                ) : (
                  <FiSearch
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400"
                    size={14}
                  />
                )}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search products, stores..."
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-900 text-sm sm:text-base"
                />
              </div>

              {searchQuery && !isSearchFocused && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-center"
                >
                  <p className="text-xs text-blue-600">
                    Showing {displayedConversations.length} of{" "}
                    {conversations.length} conversations
                  </p>
                </motion.div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto custom-chat-scroll">
              {isLoading ? (
                <SectionLoader chatLoader={true} title="Conversation"/>
              ) : displayedConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-blue-600 p-4">
                  <FiMessageSquare
                    size={28}
                    className="sm:size-8 opacity-50 mb-2"
                  />
                  <p className="text-sm font-medium text-center">
                    {searchQuery
                      ? "No conversations found"
                      : "No conversations"}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="text-xs text-cyan-600 hover:text-cyan-700 mt-1"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              ) : (
                displayedConversations.map((conversation, inx) => (
                  <div
                    key={inx}
                    onClick={() => {
                      if (window.innerWidth < 1280) {
                        setShowSidebar(false);
                      }
                      setSelectedChat(conversation);
                      navigate(`/account/chats/${conversation.id}`);
                    }}
                    className={`p-3 sm:p-4 border-b border-blue-100 transition-colors group ${
                      conversation.chat_enabled
                        ? "cursor-pointer hover:bg-blue-50"
                        : "cursor-not-allowed opacity-70"
                    } ${
                      selectedChat?.id === conversation.id ? "bg-blue-100" : ""
                    }`}
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 ${
                          selectedChat?.id === conversation.id
                            ? "ring ring-blue-400"
                            : ""
                        } ${
                          conversation.chat_enabled
                            ? "group-hover:ring group-hover:ring-blue-400"
                            : ""
                        } rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden transition-all duration-300 relative`}
                      >
                        <img
                          src={conversation.product.image}
                          alt={conversation.product.name}
                          className="w-full h-full object-cover"
                        />

                        {!conversation.chat_enabled && (
                          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                            <FiX className="text-white" size={16} />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1 gap-2">
                          <div className="flex items-center min-w-0 flex-1">
                            <h4 className="text-sm sm:text-base font-semibold text-blue-900 truncate">
                              {conversation.buyer == user?.username
                                ? conversation.store.store_name
                                : conversation.buyer}
                            </h4>
                            <div className="flex items-center gap-1 ml-1 sm:ml-2 flex-shrink-0">
                              {conversation.buyer == user?.username && (
                                <span className="text-blue-800 mt-0.5">
                                  <MdStorefront
                                    size={12}
                                    className="sm:size-[15px]"
                                  />
                                </span>
                              )}
                              {!conversation.chat_enabled && (
                                <span className="flex justify-center items-center bg-gray-500 text-white text-xs w-5 h-5 sm:w-6 sm:h-6 rounded-full">
                                  <FiLock size={10} />
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-xs text-blue-500 whitespace-nowrap flex-shrink-0">
                            {conversation.time}
                          </span>
                        </div>

                        <div className="mb-1 sm:mb-2">
                          <p className="text-xs sm:text-sm font-medium text-blue-800 truncate">
                            {conversation.product.name}
                          </p>
                          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                            {conversation.product.discounted_price ? (
                              <>
                                <span className="text-xs sm:text-sm font-bold text-blue-800">
                                  ${conversation.product.discounted_price}
                                </span>
                                <span className="text-xs text-rose-500 line-through">
                                  ${conversation.product.price}
                                </span>
                                {conversation.product.discount_percentage && (
                                  <span className="text-xs bg-gradient-to-r from-rose-500 to-pink-500 text-white px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap">
                                    -{conversation.product.discount_percentage}%
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="text-xs sm:text-sm font-bold text-blue-800">
                                ${conversation.product.price}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs sm:text-sm text-blue-600 truncate flex-1 min-w-0">
                            {conversation.lastMessage}
                          </p>
                          {conversation.unread > 0 &&
                            conversation.chat_enabled && (
                              <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center flex-shrink-0 text-[10px] sm:text-xs">
                                {conversation.unread}
                              </span>
                            )}
                        </div>

                        {!conversation.chat_enabled && (
                          <p className="text-xs text-rose-600 mt-1">
                            Chat is no longer available
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {searchQuery && (
              <div className="p-3 border-t border-blue-200 bg-blue-50/50">
                <button
                  onClick={clearSearch}
                  className="w-full text-sm bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-2 rounded-lg hover:shadow-lg transition-all duration-300 font-medium"
                >
                  Clear Search
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
};

export default ChatSidebar;
