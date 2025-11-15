import {
  FiClock,
  FiFileText,
  FiPackage,
  FiStar,
  FiTruck,
} from "react-icons/fi";
import { IoCartOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const RecentCartItems = ({ recentCartItems }) => {
  const navigate = useNavigate();

  const openInNewTab = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg p-4 sm:p-6 border border-blue-400 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-blue-900 flex items-center">
          <IoCartOutline
            className="mr-2 sm:mr-3 mb-0.5 text-blue-600"
            size={24}
          />
          Recent Cart Items
        </h2>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {recentCartItems.slice(0, 4).map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-blue-50 rounded-lg sm:rounded-xl border border-blue-200 hover:border-blue-300 transition-all duration-200"
          >
            <div className="flex items-start gap-3 sm:flex-1 w-full sm:w-auto">
              <div
                onClick={() => openInNewTab(`/product/${item.product.id}`)}
                className="cursor-pointer w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-lg overflow-hidden border border-blue-200 bg-white"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-blue-900 text-sm sm:text-base mb-1 truncate">
                  {item.product.name}
                </h3>

                {item.product.average_rating && (
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FiStar
                          key={star}
                          size={12}
                          className={`${
                            star <= Math.floor(item.product.average_rating)
                              ? "text-amber-400 fill-amber-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-blue-600 font-medium ml-1">
                      {item.product.average_rating}
                    </span>
                    {item.product.comment_count > 0 && (
                      <span className="text-xs text-blue-500">
                        ({item.product.comment_count})
                      </span>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-2">
                    {item.product.discounted_price ? (
                      <>
                        <span className="text-sm sm:text-base font-bold text-blue-900">
                          ${item.product.discounted_price}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500 line-through">
                          ${item.product.price}
                        </span>
                        <span className="text-xs bg-gradient-to-r from-rose-500 to-pink-500 text-white px-1.5 py-0.5 rounded-full">
                          -{item.product.discount_percentage}%
                        </span>
                      </>
                    ) : (
                      <span className="text-sm sm:text-base font-bold text-blue-900">
                        ${item.product.price}
                      </span>
                    )}
                  </div>

                  <span className="text-xs sm:text-sm text-blue-700 bg-white px-2 py-1 rounded border border-blue-200">
                    Qty: {item.quantity}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
              <div
                className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${
                  item.product.stock_quantity > 10
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : item.product.stock_quantity > 0
                    ? "bg-amber-100 text-amber-700 border border-amber-200"
                    : "bg-red-100 text-red-700 border border-red-200"
                }`}
              >
                {item.product.stock_quantity > 10
                  ? "In Stock"
                  : item.product.stock_quantity > 0
                  ? `Low Stock`
                  : "Out of Stock"}
              </div>

              <button
                onClick={() => navigate("/account/cart")}
                className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}

        {recentCartItems.length === 0 && (
          <div className="text-center py-8 sm:py-12 bg-blue-50 rounded-lg sm:rounded-xl border border-blue-200">
            <IoCartOutline
              className="text-blue-400 mx-auto mb-3 sm:mb-4"
              size={40}
            />
            <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-2">
              Your cart is empty
            </h3>
            <p className="text-blue-600 text-sm sm:text-base">
              Discover amazing products and add them to your cart
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentCartItems;
