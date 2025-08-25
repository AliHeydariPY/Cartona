import { motion } from "framer-motion";

import { addToCart } from "../../services/cartAPIServices";

import {
  FiHeart,
  FiShoppingCart,
  FiTrash2,
  FiStar,
  FiChevronDown,
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

const Favorites = ({ setAddToCartPopup, setSelectedProduct }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="lg:col-span-3"
    >
      <div className="space-y-4 sm:space-y-7 lg:space-y-5 xl:space-y-9">
        {/* Wishlist Header */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 2xl:p-8 border border-blue-400 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300">
          <div className="flex justify-between flex-wrap">
            <h2 className="text-lg sm:text-2xl font-bold text-blue-800 mb-4 sm:mb-8 w-full sm:w-5/10 flex items-center">
              <span>
                <FiHeart
                  className="mr-2 sm:mr-3 text-rose-500 fill-current"
                  size={22}
                />{" "}
              </span>
              Your Favorites
            </h2>

            {/* فیلتر پیشرفته */}
            <div className="mb-4 sm:mb-8 w-full sm:w-6/10 md:w-5/10 flex justify-end">
              <div className="relative group w-full">
                <button className="flex justify-between w-full items-center bg-white border border-blue-300 rounded-lg sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-blue-800 hover:border-blue-400 transition-colors duration-300">
                  <span>Sort by: Recently Added</span>
                  <span>
                    <FiChevronDown
                      className="ml-1 sm:ml-2 transform group-hover:rotate-180 transition-transform duration-300"
                      size={16}
                    />
                  </span>
                </button>
                <div className="absolute w-full right-0 z-20 mt-1 bg-white rounded-lg sm:rounded-xl shadow-xl border border-blue-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-1">
                  {[
                    "Recently Added",
                    "Price: Low to High",
                    "Price: High to Low",
                    "Most Popular",
                  ].map((item) => (
                    <button
                      key={item}
                      className="w-full cursor-pointer text-left px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base hover:bg-blue-50 text-blue-800 transition-colors duration-200"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* لیست محصولات */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((product) => (
              <div
                key={product}
                className="group relative bg-white rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl border border-blue-200 overflow-hidden transition-all duration-300"
              >
                {/* برچسب تخفیف */}
                {product % 3 === 0 && (
                  <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                    -20%
                  </div>
                )}

                {/* تصویر محصول */}
                <div className="h-40 sm:h-48 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center relative">
                  <div className="w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-blue-300 via-cyan-200 to-white rounded-full shadow-inner"></div>

                  {/* دکمه‌های اکشن */}
                  <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 flex space-x-1 sm:space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => {
                        // setSelectedProduct(product) // SOON...
                        const response = addToCart({
                          product: 1,
                          quantity: 1,
                          cart: localStorage.getItem("userID"),
                        });
                        response.then(() => {
                          setAddToCartPopup(true);
                        });
                      }}
                      className="p-1 sm:p-2 cursor-pointer bg-white rounded-full shadow-md hover:bg-blue-600 hover:text-white transition-colors"
                    >
                      <FiShoppingCart size={13} className="mr-0.25" />
                    </button>
                    <button className="p-1 sm:p-2 cursor-pointer bg-white rounded-full shadow-md hover:bg-rose-500 hover:text-white transition-colors">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* اطلاعات محصول */}
                <div className="p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-1 truncate">
                    Premium Product {product}
                  </h3>
                  <div className="flex items-center mb-1 sm:mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar
                        key={star}
                        className={`${
                          star <= 4
                            ? "text-amber-400 fill-current"
                            : "text-gray-300"
                        }`}
                        size={12}
                      />
                    ))}
                    <span className="text-xs text-blue-500 ml-1">(24)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      {product % 3 === 0 ? (
                        <>
                          <span className="text-base sm:text-lg font-bold text-rose-500">
                            ${(product * 249 * 0.8).toFixed(2)}
                          </span>
                          <span className="text-xs text-gray-500 line-through ml-1">
                            ${product * 249}
                          </span>
                        </>
                      ) : (
                        <span className="text-base sm:text-lg font-bold text-blue-600">
                          ${product * 249}
                        </span>
                      )}
                    </div>
                    <button className="text-rose-500 hover:text-rose-700 cursor-pointer transition-colors">
                      <FaHeart size={19} />
                    </button>
                  </div>
                </div>

                {/* استیکر وضعیت */}
                {product === 4 && (
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-rose-100 text-rose-800 text-xs px-2 py-1 rounded">
                    Out of Stock
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* صفحه‌بندی */}
          <div className="flex justify-center mt-6 sm:mt-8">
            <nav className="flex items-center space-x-1 sm:space-x-2">
              <button className="px-2 sm:px-3 py-1 cursor-pointer rounded-lg border border-blue-300 text-sm sm:text-base text-blue-600 hover:bg-blue-50">
                Previous
              </button>
              <button className="px-2 sm:px-3 py-1 cursor-pointer rounded-lg bg-blue-600 text-sm sm:text-base text-white">
                1
              </button>
              <button className="px-2 sm:px-3 py-1 cursor-pointer rounded-lg border border-blue-300 text-sm sm:text-base text-blue-600 hover:bg-blue-50">
                2
              </button>
              <button className="px-2 sm:px-3 py-1 cursor-pointer rounded-lg border border-blue-300 text-sm sm:text-base text-blue-600 hover:bg-blue-50">
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Favorites;
