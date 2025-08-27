import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageSquare, FiUsers, FiMenu, FiX, FiSearch, FiSend } from "react-icons/fi";
import { RiSendPlaneFill } from "react-icons/ri";

const ChatLayout = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [message, setMessage] = useState("");

  // داده‌های نمونه
  const conversations = [
    { id: 1, name: "John Doe", lastMessage: "Hello there!", unread: 2, time: "2:30 PM" },
    { id: 2, name: "Alice Smith", lastMessage: "Thanks for your help!", unread: 0, time: "Yesterday" },
    { id: 3, name: "Tech Support", lastMessage: "Your issue has been resolved", unread: 1, time: "12:45 PM" },
    { id: 4, name: "Sarah Johnson", lastMessage: "Let's meet tomorrow", unread: 0, time: "Monday" },
    
  ];

  const messages = selectedChat ? [
    { id: 1, text: "Hello! How can I help you today?", sender: "them", time: "2:25 PM" },
    { id: 2, text: "I have a question about my order", sender: "me", time: "2:26 PM" },
    { id: 3, text: "Sure, I'd be happy to help. What's your order number?", sender: "them", time: "2:27 PM" },
  ] : [];

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
          <div className="w-10"></div> {/* برای بالانس */}
        </div>

        <div className="flex h-[785px]">
          {/* Sidebar - نمایش در xl به بالا یا وقتی منو باز است */}
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
                    <h3 className="text-lg font-semibold text-blue-900">Conversations</h3>
                    <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                      <FiMessageSquare size={18} />
                    </button>
                  </div>
                  
                  {/* جستجو */}
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search conversations..."
                      className="w-full pl-10 pr-4 py-2 bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-900"
                    />
                  </div>
                </div>

                {/* لیست چت‌ها */}
                <div className="flex-1 overflow-y-auto">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => {
                        setSelectedChat(conversation);
                        setShowSidebar(false);
                      }}
                      className={`p-4 border-b border-blue-100 cursor-pointer transition-colors hover:bg-blue-50 ${
                        selectedChat?.id === conversation.id ? "bg-blue-100" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-semibold">
                            {conversation.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-medium text-blue-900">{conversation.name}</h4>
                            <p className="text-sm text-blue-600 truncate max-w-[150px]">
                              {conversation.lastMessage}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-blue-500">{conversation.time}</span>
                          {conversation.unread > 0 && (
                            <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {conversation.unread}
                            </span>
                          )}
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
                {/* هدر چت */}
                <div className="p-4 border-b border-blue-200 bg-white/80">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-semibold">
                      {selectedChat.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900">{selectedChat.name}</h4>
                      <p className="text-sm text-blue-600">Online</p>
                    </div>
                  </div>
                </div>

                {/* پیام‌ها */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-blue-50/50 to-cyan-50/50">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          message.sender === "me"
                            ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                            : "bg-white border border-blue-200 text-blue-900"
                        }`}
                      >
                        <p>{message.text}</p>
                        <span className={`text-xs ${message.sender === "me" ? "text-blue-100" : "text-blue-500"}`}>
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
                      <RiSendPlaneFill  size={18} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* حالت انتخاب نشدن چت */
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
                <div className="text-center text-blue-600">
                  <FiMessageSquare size={48} className="mx-auto mb-4 opacity-60" />
                  <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                  <p>Choose a chat from the sidebar to start messaging</p>
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