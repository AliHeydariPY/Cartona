import { FiTag, FiChevronDown, FiChevronLeft } from "react-icons/fi";
import { BiCategory } from "react-icons/bi";
import { Field, ErrorMessage } from "formik";

const BasicInfoSection = ({
  selectedCategory,
  isCategoryOpen,
  setIsCategoryOpen,
  selectedMainCategory,
  setSelectedMainCategory,
  mainCategories,
  subCategories,
  setSelectedCategory,
  setFieldValue,
}) => {
  return (
    <>
      <div className="space-y-2">
        <label className="flex items-center text-blue-800 font-medium">
          <FiTag className="mr-2" /> Product Name*
        </label>
        <Field
          name="name"
          type="text"
          className="w-full px-4 py-3 text-blue-800 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
          placeholder="Product title"
        />
        <ErrorMessage
          name="name"
          component="div"
          className="text-red-500 text-sm ml-0.5"
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center text-blue-800 font-medium">
          <BiCategory size={18} className="mr-2 mb-0.5" /> Category*
        </label>

        <Field type="hidden" name="category" />

        <div className="relative group w-full">
          <button
            type="button"
            className="flex justify-between w-full items-center bg-white border border-blue-300 rounded-lg px-4 py-3 text-blue-800 hover:border-blue-400 transition-colors duration-300 text-left"
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          >
            <span>
              {selectedCategory ? selectedCategory.name : "Select a category"}
            </span>
            <FiChevronDown
              className={`ml-2 transform ${
                isCategoryOpen ? "rotate-180" : ""
              } transition-transform duration-300`}
              size={16}
            />
          </button>

          {isCategoryOpen && (
            <div className="absolute w-full z-20 mt-1 bg-white rounded-lg shadow-xl border border-blue-200 max-h-64 overflow-y-auto">
              {!selectedMainCategory &&
                mainCategories.reverse().map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    className="w-full cursor-pointer text-left px-4 py-2 hover:bg-blue-50 text-blue-800 transition-colors duration-200"
                    onClick={() => setSelectedMainCategory(category)}
                  >
                    {category.name}
                  </button>
                ))}

              {selectedMainCategory && (
                <>
                  <div className="flex items-center px-4 py-2 border-b border-blue-100">
                    <button
                      type="button"
                      onClick={() => setSelectedMainCategory(null)}
                      className="flex items-center cursor-pointer text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <FiChevronLeft className="mr-1 mb-0.5 " /> Back
                    </button>
                    <span className="ml-2 font-semibold text-blue-700">
                      {selectedMainCategory.name}
                    </span>
                  </div>
                  {subCategories.map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      className="w-full cursor-pointer text-left px-4 py-2 hover:bg-blue-50 text-blue-800 transition-colors duration-200"
                      onClick={() => {
                        setSelectedCategory(sub);
                        setIsCategoryOpen(false);
                        setFieldValue("category", sub.id);
                        setSelectedMainCategory(null);
                      }}
                    >
                      {sub.name}
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
        <ErrorMessage
          name="category"
          component="div"
          className="text-red-500 text-sm mt-1 ml-0.5"
        />
      </div>
    </>
  );
};

export default BasicInfoSection;
