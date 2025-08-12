import {
  FiPlusCircle,
  FiImage,
  FiTag,
  FiDollarSign,
  FiAlignLeft,
  FiLayers,
  FiTrash2,
  FiPackage,
  FiClock, FiPercent, FiZap
} from "react-icons/fi";
import { useState } from "react";

const AddProduct = () => {
  const [hasDiscount, setHasDiscount] = useState(false);
  const [isAmazingOffer, setIsAmazingOffer] = useState(false);

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl p-5 sm:p-6 2xl:p-8 border border-blue-400 hover:shadow-lg hover:shadow-blue-400/50 transition-all duration-300 lg:col-span-3">
      <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-6 sm:mb-8 flex items-center">
        <FiPlusCircle className="mr-2 sm:mr-3 text-green-500" size={24} />
        Add New Product
      </h2>

      <form className="space-y-6">
        {/* بخش تصویر محصول */}
        <div className="space-y-2">
          <label className="flex items-center text-blue-800 font-medium">
            <FiImage className="mr-2" /> Product Images (Max 5)
          </label>
          <div className="flex flex-wrap gap-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="relative group">
                <div
                  className={`w-24 h-24 ${
                    item === 1
                      ? "border-2 border-dashed border-blue-400"
                      : "border border-blue-200"
                  } rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors duration-300`}
                >
                  {item === 1 ? (
                    <FiPlusCircle
                      className="text-blue-500 group-hover:text-blue-700"
                      size={28}
                    />
                  ) : (
                    <span className="text-xs text-blue-500">Image {item}</span>
                  )}
                </div>
                {item > 1 && (
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 hover:bg-rose-600 transition-colors duration-300"
                  >
                    <FiTrash2 size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* نام محصول */}
        <div className="space-y-2">
          <label className="flex items-center text-blue-800 font-medium">
            <FiTag className="mr-2" /> Product Name*
          </label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            placeholder="Enter product name"
          />
        </div>

        {/* دسته‌بندی */}
        <div className="space-y-2">
          <label className="flex items-center text-blue-800 font-medium">
            <FiPackage className="mr-2" /> Category*
          </label>
          <select
            required
            className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-white"
          >
            <option value="">Select a category</option>
            <option>Electronics</option>
            <option>Fashion</option>
            <option>Home & Garden</option>
            <option>Beauty</option>
            <option>Sports</option>
          </select>
        </div>

        {/* قیمت‌ها */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* قیمت اصلی */}
          <div className="space-y-2">
            <label className="flex items-center text-blue-800 font-medium">
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
                className="w-full pl-8 pr-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* تخفیف */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center text-blue-800 font-medium">
                <FiPercent className="mr-2" /> Discount
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={hasDiscount}
                  onChange={() => setHasDiscount(!hasDiscount)}
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
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
                    className="w-full pl-8 pr-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
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
                      className="w-full pl-4 pr-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                      placeholder="Discount %"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
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
            <label className="flex items-center text-blue-800 font-medium">
              <FiLayers className="mr-2" /> Stock Quantity*
            </label>
            <input
              type="number"
              required
              min="0"
              className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              placeholder="100"
            />
          </div>
        </div>

        {/* پیشنهاد ویژه */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="flex items-center text-blue-800 font-medium">
              <FiZap className="mr-2 text-amber-500" /> Amazing Offer
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
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
                  className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="Offer title"
                />
              </div>
              <div className="relative">
                <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
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
          <label className="flex items-center text-blue-800 font-medium">
            <FiAlignLeft className="mr-2" /> Description*
          </label>
          <textarea
            rows={6}
            required
            className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            placeholder="Detailed product description..."
          ></textarea>
        </div>

        {/* دکمه‌های اقدام */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium flex items-center justify-center"
          >
            <FiPlusCircle className="mr-2" />
            Publish Product
          </button>
          <button
            type="button"
            className="px-6 py-3 bg-white border border-blue-400 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors duration-300"
          >
            Save as Draft
          </button>
          <button
            type="button"
            className="px-6 py-3 bg-white border border-rose-400 text-rose-700 rounded-lg hover:bg-rose-50 transition-colors duration-300 sm:ml-auto"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
