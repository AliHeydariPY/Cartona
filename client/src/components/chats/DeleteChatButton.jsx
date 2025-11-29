import { FiTrash2 } from "react-icons/fi";

const DeleteChatButton = ({ onClick }) => {
  return (
    <div className="fixed bottom-16 right-3 sm:right-4 md:right-6 z-50">
      <button
        onClick={onClick}
        className="bg-red-500 hover:bg-red-600 text-white p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
        title="Delete Chat"
      >
        <FiTrash2 size={16} className="sm:size-[20px]" />
      </button>
    </div>
  );
};

export default DeleteChatButton;