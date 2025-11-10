import EmojiPicker from "emoji-picker-react";
import { useState, useRef, useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { RiSendPlaneFill, RiCloseLine, RiEdit2Line } from "react-icons/ri";
import { FaCheck } from "react-icons/fa";
import { FiSmile } from "react-icons/fi";
import { errorToast } from "../../../utils/toast";

export default function ChatInput({
  isEditing,
  setIsEditing,
  prevMessage,
  message,
  setMessage,
  sendMessagse,
  editMessage,
  fetchMessages,
  chatID,
  contextMenu,
  setContextMenu,
  selectedChat,
  emojiBox,
  setEmojiBox,
}) {
  const [textareaHeight, setTextareaHeight] = useState(0);
  const textareaRef = useRef();

  useEffect(() => {
    setMessage("");
    setIsEditing(false);
    textareaRef.current.focus();
  }, [chatID]);

  useEffect(() => {
    (prev) => {
      console.log(prev.trim());
      if (prev) {
        return prev;
      } else {
        return "";
      }
    };
    textareaRef.current.focus();
  }, [isEditing]);

  const addEmoji = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    textareaRef.current.focus();
  };

  const handleEditMsg = (payload) => {
    editMessage(payload)
      .then(() => {
        fetchMessages(chatID);
        setMessage("");
        setIsEditing(false);
      })
      .catch((err) => {
        setMessage("");
        errorToast(err.response.data.non_field_errors);
      });
  };

  const handleSendMsg = (payload) => {
    sendMessagse(payload)
      .then((res) => {
        fetchMessages(res.data.purchase);
        setMessage("");
      })
      .catch((err) => {
        setMessage("");
        errorToast(err.response.data.non_field_errors);
      });
  };

  return (
    <div className="p-4 border-t border-blue-200 bg-white/90 relative">
      <div
        className={`fixed z-50 right-0 mr-2 emoji-picker-container ${
          emojiBox ? "emoji-enter" : "emoji-exit"
        }`}
        style={{
          bottom: isEditing ? textareaHeight + 42 + 44 : textareaHeight + 42,
        }}
      >
        <EmojiPicker
          theme="light"
          onEmojiClick={addEmoji}
          searchDisabled
          emojiStyle="native"
          height={380}
          width={280}
          previewConfig={{ showPreview: false }}
        />
      </div>

      {isEditing && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-3xl px-3 py-2 mb-2">
          <div className="flex items-center space-x-2">
            <RiEdit2Line className="text-blue-500" />
            <span className="text-sm text-blue-700 truncate max-w-md">
              {prevMessage}
            </span>
          </div>
          <button
            onClick={() => {
              setIsEditing(false);
              setContextMenu({
                visible: false,
                x: 0,
                y: 0,
                message: null,
              });
              setMessage("");
            }}
            className="text-blue-500 hover:text-red-500 transition-colors duration-300"
          >
            <RiCloseLine size={20} />
          </button>
        </div>
      )}

      <div className="flex items-end space-x-3 relative">
        <button
          onClick={() => setEmojiBox(!emojiBox)}
          className={`p-2.5 cursor-pointer rounded-full transition-colors duration-300 ${
            emojiBox
              ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 "
              : "bg-gradient-to-r from-blue-100 to-blue-100 text-blue-500 hover:from-blue-200 hover:to-blue-200"
          }`}
        >
          <FiSmile size={22} />
        </button>

        <TextareaAutosize
          ref={textareaRef}
          minRows={1}
          maxRows={5}
          value={message}
          onHeightChange={(h) => setTextareaHeight(h)}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (message.trim() !== "") {
                if (isEditing) {
                  handleEditMsg({
                    ...contextMenu.message,
                    message: message,
                  });
                } else {
                  handleSendMsg({
                    purchase: selectedChat.id,
                    message: message,
                  });
                }
              }
            }
          }}
          placeholder={isEditing ? "Edit your message..." : "Type a message..."}
          className="flex-1 items-center px-4 py-2.75 border border-blue-300 rounded-3xl
   resize-none overflow-hidden 
   min-h-[43px] leading-[17px]  
   hover:outline-none hover:ring-1 hover:ring-blue-400 
   focus:outline-none focus:ring-1 focus:ring-blue-400 
   transition-all duration-300"
        />

        {isEditing ? (
          <button
            onClick={() =>
              handleEditMsg({
                ...contextMenu.message,
                message: message,
              })
            }
            className={`p-3 rounded-full transition-colors duration-300 ${
              message.trim()
                ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 cursor-pointer"
                : "bg-blue-100 text-blue-400 cursor-not-allowed"
            }`}
          >
            <FaCheck size={18} />
          </button>
        ) : (
          <button
            onClick={() => {
              if (message.trim()) {
                handleSendMsg({
                  purchase: selectedChat.id,
                  message: message,
                });
              }
            }}
            className={`p-3 rounded-full transition-colors duration-300 ${
              message.trim()
                ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 cursor-pointer"
                : "bg-blue-100 text-blue-500 cursor-not-allowed"
            }`}
          >
            <RiSendPlaneFill size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
