const SelectionActions = ({ selectedCount, onDelete, onCancel }) => {
  return (
    <div className="fixed top-32 sm:top-36 md:top-40 left-1/2 transform -translate-x-1/2 bg-white px-3 sm:px-4 py-2 rounded-full shadow-lg border border-gray-200 flex items-center space-x-2 sm:space-x-4 text-sm z-50">
      <span className="text-blue-600 whitespace-nowrap">
        {selectedCount} selected
      </span>
      <button
        onClick={onDelete}
        className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded-full hover:bg-red-600 transition-colors text-xs sm:text-sm"
      >
        Delete
      </button>
      <button
        onClick={onCancel}
        className="text-gray-500 hover:text-gray-700 text-xs sm:text-sm"
      >
        Cancel
      </button>
    </div>
  );
};

export default SelectionActions;