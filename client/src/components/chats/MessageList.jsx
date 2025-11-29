import { useRef } from "react";
import { useMessageActions } from "../../hooks/useMessageActions";
import MessageBubble from "./MessageBubble";
import ContextMenu from "./ContextMenu";
import SelectionActions from "./SelectionActions";
import DeleteChatButton from "./DeleteChatButton";
import EmptyMessagesState from "./EmptyMessagesState";

const MessagesList = ({
  messages,
  selectedChat,
  isMessagesLoading,
  user,
  fetchMessages,
  chatID,
  setMessage,
  setPrevMessage,
  setIsEditing,
  messagesEndRef,
  setDeletePopup,
  contextMenu,
  setContextMenu,
}) => {
  const messagesContainerRef = useRef(null);

  const {
    selectedMessages,
    isSelectionMode,
    handleContextMenu,
    handleTouchStart,
    handleTouchEnd,
    handleSelectOption,
    handleDeleteMessages,
    handleMessageClick,
    clearSelection,
  } = useMessageActions(
    user,
    selectedChat,
    chatID,
    fetchMessages,
    contextMenu,
    setContextMenu
  );

  const handleEditMessage = () => {
    setMessage(contextMenu.message.message);
    setPrevMessage(contextMenu.message.message);
    setIsEditing(true);
  };

  return (
    <div
      className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 custom-chat-scroll min-h-0"
      ref={messagesContainerRef}
    >
      {!selectedChat.chat_enabled && (
        <DeleteChatButton onClick={() => setDeletePopup(selectedChat)} />
      )}

      {isMessagesLoading ? null : messages.length > 0 ? (
        messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            user={user}
            selectedMessages={selectedMessages}
            isSelectionMode={isSelectionMode}
            onContextMenu={handleContextMenu}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={handleMessageClick}
          />
        ))
      ) : (
        <EmptyMessagesState />
      )}

      <ContextMenu
        contextMenu={contextMenu}
        onSelect={handleSelectOption}
        onEdit={handleEditMessage}
        onDelete={handleDeleteMessages}
      />

      {isSelectionMode && selectedMessages.length > 0 && (
        <SelectionActions
          selectedCount={selectedMessages.length}
          onDelete={handleDeleteMessages}
          onCancel={clearSelection}
        />
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesList;
