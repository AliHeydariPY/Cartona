import { useState, useCallback, useEffect } from "react";
import { deleteMessagse } from "../../services/commentAPIServices";

export const useMessageActions = (
  user,
  selectedChat,
  chatID,
  fetchMessages,
  contextMenu,
  setContextMenu
) => {
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const [longPressTimer, setLongPressTimer] = useState(null);
  const [firstSelectMsg, setFirstSelectMsg] = useState(true);

  const handleContextMenu = useCallback(
    (e, message) => {
      e.preventDefault();

      if (message.sender !== user.username || !selectedChat?.chat_enabled)
        return;

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
    },
    [user.username, selectedChat?.chat_enabled]
  );

  const handleTouchStart = useCallback(
    (message) => {
      if (message.sender !== user.username || !selectedChat?.chat_enabled)
        return;

      const timer = setTimeout(() => {
        setIsSelectionMode(true);
        setSelectedMessages([message.id]);
      }, 500);

      setLongPressTimer(timer);
    },
    [user.username, selectedChat?.chat_enabled]
  );

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  }, [longPressTimer]);

  const handleSelectOption = useCallback(() => {
    setIsSelectionMode(true);
    if (contextMenu.message) {
      setSelectedMessages([contextMenu.message.id]);
    }
    setContextMenu({ visible: false, x: 0, y: 0, message: null });
  }, [contextMenu.message]);

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

  const handleDeleteMessages = useCallback(
    async (messageID) => {
      if (typeof messageID === "number") {
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
    },
    [selectedMessages, chatID, fetchMessages]
  );

  const handleMessageClick = useCallback(
    (messageId, senderId) => {
      if (!isSelectionMode || senderId !== user.username) return;

      if (firstSelectMsg) {
        setFirstSelectMsg(false);
      } else {
        if (selectedMessages.includes(messageId)) {
          const newSelected = selectedMessages.filter((id) => id !== messageId);
          setSelectedMessages(newSelected);
          if (newSelected.length === 0) {
            setIsSelectionMode(false);
            setFirstSelectMsg(true);
          }
        } else {
          setSelectedMessages([...selectedMessages, messageId]);
        }
      }
    },
    [isSelectionMode, user.username, firstSelectMsg, selectedMessages]
  );

  const clearSelection = useCallback(() => {
    setIsSelectionMode(false);
    setSelectedMessages([]);
    setFirstSelectMsg(true);
  }, []);

  return {
    selectedMessages,
    setSelectedMessages,
    isSelectionMode,
    setIsSelectionMode,
    contextMenu,
    setContextMenu,
    longPressTimer,
    setLongPressTimer,
    firstSelectMsg,
    setFirstSelectMsg,
    handleContextMenu,
    handleTouchStart,
    handleTouchEnd,
    handleSelectOption,
    handleDeleteMessages,
    handleMessageClick,
    clearSelection,
  };
};
