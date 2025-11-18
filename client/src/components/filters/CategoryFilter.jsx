import { useState, useEffect } from "react";
import { FiChevronLeft } from "react-icons/fi";
import {
  getMainCategories,
  getSubCategories,
} from "../../services/productAPIServices";
import { FiX } from "react-icons/fi";
import { useParams } from "react-router-dom";

const CategoryFilter = ({ selectedCategory, onSelect }) => {
  const { query } = useParams();
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(selectedCategory ? true : false);

  useEffect(() => {
    getMainCategories().then((res) => setMainCategories(res.data));
  }, [query]);

  useEffect(() => {
    if (!selectedMainCategory) return;
    getSubCategories(selectedMainCategory.id).then((res) =>
      setSubCategories(res.data)
    );
  }, [selectedMainCategory]);

  return (
    <div className="space-y-2">
      {selectedCategory && isOpen && (
        <div className="flex items-center justify-between px-3 py-2 rounded-md bg-blue-100 border border-blue-400 text-blue-700">
          Selected: {selectedCategory.name}
          <span
            onClick={() => {
              onSelect({});
              setIsOpen(false);
            }}
            className="cursor-pointer hover:text-red-500 transition-colors duration-200"
          >
            <FiX size={18} />
          </span>
        </div>
      )}

      {!selectedMainCategory && (
        <div className="max-h-64 overflow-y-auto pr-1">
          {mainCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`flex items-center w-full text-left px-3 py-2 rounded-md border ${
                selectedCategory?.id === cat.id
                  ? "bg-blue-100 border-blue-400 text-blue-700"
                  : "border-transparent hover:bg-blue-50 text-blue-800"
              }`}
              onClick={() => {
                setSelectedMainCategory(cat);
              }}
            >
              <FiChevronLeft className="mr-1 mb-0.5" size={16} />
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {selectedMainCategory && (
        <>
          <div className="flex items-center justify-between px-3 py-2 border-b border-blue-300">
            <button
              type="button"
              onClick={() => setSelectedMainCategory(null)}
              className="text-blue-600 hover:text-blue-800 flex items-center cursor-pointer"
            >
              <FiChevronLeft className="mr-0.5 mb-0.5" /> Back
            </button>
            <p className="font-medium text-blue-700 break-words whitespace-normal flex-1 text-right">
              {selectedMainCategory.name}
            </p>
          </div>

          <div className="max-h-64 overflow-y-auto pr-1">
            {subCategories.map((sub) => (
              <button
                key={sub.id}
                type="button"
                className={`block w-full text-left px-3 py-2 rounded-md border ${
                  selectedCategory?.id === sub.id
                    ? "bg-blue-100 border-blue-400 text-blue-700"
                    : "border-transparent hover:bg-blue-50 text-blue-800"
                }`}
                onClick={() => {
                  onSelect(sub);
                  setIsOpen(true);
                }}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryFilter;
