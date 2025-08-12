import {
  FiPlusCircle,
  FiImage,
  FiTag,
  FiDollarSign,
  FiAlignLeft,
  FiLayers,
  FiTrash2,
  FiPackage,
  FiClock,
  FiPercent,
  FiZap,
  FiChevronDown,
} from "react-icons/fi";
import { useState } from "react";

const AddProduct = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [images, setImages] = useState({});
  const [hasDiscount, setHasDiscount] = useState(false);
  const [isAmazingOffer, setIsAmazingOffer] = useState(false);

  const handleImageUpload = (e, slot) => {
    const file = e.target.files[0];
    if (file) {
      setImages((prev) => ({ ...prev, [slot]: file }));
    }
  };

  const handleRemoveImage = (slot) => {
    setImages((prev) => {
      const newImages = { ...prev };
      delete newImages[slot];
      return newImages;
    });
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl p-5 sm:p-6 2xl:p-8 border border-blue-400 hover:shadow-lg hover:shadow-blue-400/50 transition-all duration-300 lg:col-span-3">
      <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-6 sm:mb-8 flex items-center">
        <FiPlusCircle className="mr-2 sm:mr-3 text-green-500" size={24} />
        Add New Product
      </h2>

      <form className="space-y-6">
        {/* بخش تصویر محصول */}
        <div className="space-y-2">
          <label className="flex items-center text-blue-900 font-medium">
            <FiImage className="mr-2" /> Product Images (Max 5)
          </label>
          <div className="flex flex-wrap gap-4">
            {/* اسلات‌های تصویر */}
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="relative group">
                <label
                  className={`block w-24 h-24 ${
                    !images[item]
                      ? "border-2 border-dashed border-blue-400 cursor-pointer"
                      : "border border-blue-200"
                  } rounded-lg flex items-center justify-center overflow-hidden hover:bg-blue-50 transition-colors duration-300`}
                >
                  {images[item] ? (
                    <>
                      <img
                        src={URL.createObjectURL(images[item])}
                        alt={`Preview ${item}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute cursor-pointer top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(item);
                        }}
                      >
                        <FiTrash2 size={12} />
                      </button>
                    </>
                  ) : (
                    <>
                      <FiPlusCircle
                        className="text-blue-500 group-hover:text-blue-700"
                        size={28}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, item)}
                      />
                    </>
                  )}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* نام محصول */}
        <div className="space-y-2">
          <label className="flex items-center text-blue-900 font-medium">
            <FiTag className="mr-2" /> Product Name*
          </label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 text-blue-900 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            placeholder="Enter product name"
          />
        </div>

        {/* دسته‌بندی */}
        <div className="space-y-2">
          <label className="flex items-center text-blue-900 font-medium">
            <FiPackage className="mr-2" /> Category*
          </label>

          <div className="relative group w-full">
            <button
              type="button"
              className="flex justify-between w-full items-center bg-white border border-blue-300 rounded-lg px-4 py-3 text-blue-900 hover:border-blue-400 transition-colors duration-300 text-left"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            >
              <span>{selectedCategory || "Select a category"}</span>
              <FiChevronDown
                className={`ml-2 transform ${
                  isCategoryOpen ? "rotate-180" : ""
                } transition-transform duration-300`}
                size={16}
              />
            </button>

            {isCategoryOpen && (
              <div className="absolute w-full z-20 mt-1 bg-white rounded-lg shadow-xl border border-blue-200">
                {[
                  "Electronics",
                  "Fashion",
                  "Home & Garden",
                  "Beauty",
                  "Sports",
                ].map((category) => (
                  <button
                    key={category}
                    type="button"
                    className="w-full cursor-pointer text-left px-4 py-2 hover:bg-blue-50 text-blue-900 transition-colors duration-200"
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsCategoryOpen(false);
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* قیمت‌ها */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* قیمت اصلی */}
          <div className="space-y-2">
            <label className="flex items-center text-blue-900 font-medium">
              <FiDollarSign className="mr-2" /> Price*
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500">
                $
              </span>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                className="w-full pl-8 text-blue-900 pr-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* تخفیف */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center text-blue-900 font-medium">
                <FiPercent className="mr-2" /> Discount
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={hasDiscount}
                  onChange={() => setHasDiscount(!hasDiscount)}
                />
                <div className="relative w-11 h-6 text-blue-900 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            {hasDiscount && (
              <>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full pl-8 text-blue-900 pr-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    placeholder="Discounted price"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="number"
                      step="1"
                      min="0"
                      max="100"
                      className="w-full pl-4 text-blue-900 pr-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                      placeholder="Discount %"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                      <input
                        type="text"
                        className="w-full pl-10 text-blue-900 pr-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                        placeholder="Period"
                        onFocus={(e) => (e.target.type = "date")}
                        onBlur={(e) => (e.target.type = "text")}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* موجودی */}
          <div className="space-y-2">
            <label className="flex items-center text-blue-900 font-medium">
              <FiLayers className="mr-2" /> Stock Quantity*
            </label>
            <input
              type="number"
              required
              min="0"
              className="w-full px-4 py-3 text-blue-900 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              placeholder="100"
            />
          </div>
        </div>

        {/* پیشنهاد ویژه */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="flex items-center text-blue-900 font-medium">
              <FiZap className="mr-2 text-amber-500" /> Amazing Offer
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer text-blue-900"
                checked={isAmazingOffer}
                onChange={() => setIsAmazingOffer(!isAmazingOffer)}
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>
          {isAmazingOffer && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <input
                  type="text"
                  className="w-full px-4 py-3 text-blue-900 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="Offer title"
                />
              </div>
              <div className="relative">
                <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 text-blue-900 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="Offer period"
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => (e.target.type = "text")}
                />
              </div>
            </div>
          )}
        </div>

        {/* توضیحات */}
        <div className="space-y-2">
          <label className="flex items-center text-blue-900 font-medium">
            <FiAlignLeft className="mr-2" /> Description*
          </label>
          <textarea
            rows={6}
            required
            className="w-full px-4 py-3 text-blue-900 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            placeholder="Detailed product description..."
          ></textarea>
        </div>

        {/* دکمه‌های اقدام */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
          <button
            type="submit"
            className="px-6 py-3 cursor-pointer bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white rounded-lg hover:shadow-lg transition-colors duration-300 font-medium flex items-center justify-center"
          >
            <FiPlusCircle className="mr-2" />
            Publish Product
          </button>
          <button
            type="button"
            className="px-6 py-3 cursor-pointer bg-white border border-blue-400 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors duration-300"
          >
            Save as Draft
          </button>
          <button
            type="button"
            className="px-6 py-3 cursor-pointer bg-white border border-rose-400 text-rose-700 rounded-lg hover:bg-rose-50 transition-colors duration-300 sm:ml-auto"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
