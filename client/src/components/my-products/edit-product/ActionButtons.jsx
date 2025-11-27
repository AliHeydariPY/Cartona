import { FiSave } from "react-icons/fi";

const ActionButtons = () => {
  return (
    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
      <button
        type="submit"
        className="px-6 py-3 cursor-pointer bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white rounded-lg hover:shadow-lg transition-colors duration-300 font-medium flex items-center justify-center"
      >
        <FiSave className="mr-2 mb-0.5" size={18} />
        Update Product
      </button>
      <button
        type="reset"
        className="px-6 py-3 cursor-pointer bg-white border border-rose-400 text-rose-700 rounded-lg hover:bg-rose-50 transition-colors duration-300 sm:ml-auto"
      >
        Cancel
      </button>
    </div>
  );
};

export default ActionButtons;
