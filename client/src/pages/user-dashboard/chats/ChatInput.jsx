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
    <div className="p-3 sm:p-4 border-t border-blue-200 bg-white/90 relative flex-shrink-0">
      <div
        className={`fixed z-50 right-2 sm:right-4 emoji-picker-container ${
          emojiBox ? "emoji-enter" : "emoji-exit"
        }`}
        style={{
          bottom: isEditing ? textareaHeight + 36 + 40 : textareaHeight + 36,
        }}
      >
        <EmojiPicker
          theme="light"
          onEmojiClick={addEmoji}
          searchDisabled
          emojiStyle="native"
          height={320}
          width={260}
          previewConfig={{ showPreview: false }}
          className="text-sm"
        />
      </div>

      {isEditing && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-2xl sm:rounded-3xl px-3 py-2 mb-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <RiEdit2Line className="text-blue-500 flex-shrink-0" size={16} />
            <span className="text-xs sm:text-sm text-blue-700 truncate">
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
            className="text-blue-500 hover:text-red-500 transition-colors duration-300 flex-shrink-0 ml-2"
          >
            <RiCloseLine size={18} className="sm:size-[20px]" />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2 sm:gap-3 relative">
        <button
          onClick={() => setEmojiBox(!emojiBox)}
          className={`p-2 sm:p-2.5 cursor-pointer rounded-full transition-colors duration-300 flex-shrink-0 ${
            emojiBox
              ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600"
              : "bg-gradient-to-r from-blue-100 to-blue-100 text-blue-500 hover:from-blue-200 hover:to-blue-200"
          }`}
        >
          <FiSmile size={18} className="sm:size-[22px]" />
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
          className="flex-1 items-center px-3 sm:px-4 py-2 sm:py-2.75 border border-blue-300 rounded-2xl sm:rounded-3xl
        resize-none overflow-hidden 
        min-h-[34px] sm:min-h-[43px] leading-[16px] sm:leading-[17px] text-sm sm:text-base
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
            className={`p-2.5 sm:p-3 rounded-full transition-colors duration-300 flex-shrink-0 ${
              message.trim()
                ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 cursor-pointer"
                : "bg-blue-100 text-blue-400 cursor-not-allowed"
            }`}
          >
            <FaCheck size={16} className="sm:size-[18px]" />
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
            className={`p-2.5 sm:p-3 rounded-full transition-colors duration-300 flex-shrink-0 ${
              message.trim()
                ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 cursor-pointer"
                : "bg-blue-100 text-blue-500 cursor-not-allowed"
            }`}
          >
            <RiSendPlaneFill size={16} className="sm:size-[18px]" />
          </button>
        )}
      </div>
    </div>
  );
}
