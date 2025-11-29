import { motion } from "framer-motion";
import { RiEdit2Line } from "react-icons/ri";
import { FaCheck } from "react-icons/fa6";

const MessageBubble = ({
  message,
  user,
  selectedMessages,
  isSelectionMode,
  onContextMenu,
  onTouchStart,
  onTouchEnd,
  onClick
}) => {
  const dates = [message.edited_at, message.sent_at];
  const comparison = dates.map((time) => {
    const date = new Date(time);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  });

  const isEdited = comparison[0] !== comparison[1];
  const editTime = comparison[0].slice(0, 5);
  const sentTime = comparison[1].slice(0, 5);
  const isOwnMessage = message.sender === user?.username;
  const isSelected = selectedMessages.includes(message.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex py-1 sm:py-2 rounded-r-2xl ${
        isOwnMessage ? "justify-end" : "justify-start"
      } ${isSelected ? "bg-blue-100" : ""}`}
      onContextMenu={(e) => onContextMenu(e, message)}
      onTouchStart={() => onTouchStart(message)}
      onTouchEnd={onTouchEnd}
      onMouseDown={() => onTouchStart(message)}
      onMouseUp={onTouchEnd}
      onMouseLeave={onTouchEnd}
      onClick={() => onClick(message.id, message.sender)}
    >
      <div
        className={`max-w-[85%] xs:max-w-xs sm:max-w-sm lg:max-w-md px-3 py-2 rounded-xl relative cursor-pointer ${
          isOwnMessage
            ? "bg-gradient-to-br from-blue-600 to-cyan-500 text-white"
            : "bg-white border border-blue-200 text-blue-900"
        } ${
          isSelected
            ? "ring-2 ring-blue-500 ring-offset-1 sm:ring-offset-2"
            : ""
        }`}
      >
        {isSelectionMode && isOwnMessage && (
          <SelectionIndicator isSelected={isSelected} />
        )}

        <div
          style={{ whiteSpace: "pre-wrap" }}
          className="break-words whitespace-pre-wrap text-sm sm:text-base"
        >
          {message.message}
        </div>

        <MessageTime 
          isEdited={isEdited}
          editTime={editTime}
          sentTime={sentTime}
          isOwnMessage={isOwnMessage}
        />
      </div>
    </motion.div>
  );
};

const SelectionIndicator = ({ isSelected }) => (
  <div
    className={`absolute -left-1 -top-1 sm:-left-2 sm:-top-2 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center ${
      isSelected
        ? "bg-blue-600 text-white"
        : "bg-white border border-gray-300"
    }`}
  >
    {isSelected && <FaCheck size={10} className="sm:size-[12px]" />}
  </div>
);

const MessageTime = ({ isEdited, editTime, sentTime, isOwnMessage }) => (
  <div className="flex items-center space-x-1 mt-1 text-xs">
    {isEdited ? (
      <span
        className={`flex items-center space-x-1 ${
          isOwnMessage ? "text-blue-100" : "text-blue-500"
        }`}
      >
        <RiEdit2Line className="mb-0.5" size={11} />
        <span>{editTime}</span>
      </span>
    ) : (
      <span className={isOwnMessage ? "text-blue-100" : "text-blue-500"}>
        {sentTime}
      </span>
    )}
  </div>
);

export default MessageBubble;