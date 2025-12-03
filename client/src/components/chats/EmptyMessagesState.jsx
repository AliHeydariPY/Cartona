import { FiMessageSquare } from "react-icons/fi";

const EmptyMessagesState = () => {
  return (
    <div className="flex-1 flex items-center justify-center ">
      <div className="text-center text-blue-600 w-full max-w-[280px] xs:max-w-xs sm:max-w-sm md:max-w-md">
        <div className="bg-blue-50/70 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200">
          <FiMessageSquare
            className="text-blue-400 mx-auto mb-3 sm:mb-4"
            size={40}
          />

          <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-2">
            No Messages Yet
          </h3>

          <p className="text-blue-600 text-sm sm:text-base mb-4 sm:mb-6">
            Start a conversation by sending your first message.
          </p>

          <div className="flex justify-center space-x-2 opacity-50">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyMessagesState;