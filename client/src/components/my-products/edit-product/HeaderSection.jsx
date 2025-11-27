import { FiEdit } from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa6";

const HeaderSection = ({ onNavigateBack }) => {
  return (
    <div className="flex items-center gap-y-2 flex-wrap-reverse justify-between mb-4 sm:mb-6">
      <div className="flex items-center">
        <span>
          <FiEdit className="text-blue-700 mr-1 sm:mr-3" size={24} />
        </span>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-800">
          Edit Product
        </h2>
      </div>
      <button
        onClick={onNavigateBack}
        className="flex items-center cursor-pointer sm:mb-0 gap-2 px-3 sm:px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors duration-300 text-sm sm:text-base"
      >
        <FaArrowLeft />
        Back
      </button>
    </div>
  );
};

export default HeaderSection;