import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FiStar,
  FiHeart,
  FiShoppingCart,
  FiPackage,
  FiTruck,
  FiClock,
  FiDollarSign,
  FiFileText,
  FiChevronRight,
  FiZap,
  FiZapOff,
} from "react-icons/fi";
import { IoCart, IoCartOutline } from "react-icons/io5";

import { userActivitySummary } from "../../services/userAPIServices";
import {
  addToCart,
  deleteCartProduct,
  deleteFavorite,
  getCartProducts,
} from "../../services/cartAPIServices";
import { getProduct } from "../../services/productAPIServices";
import { FaClock, FaHeart } from "react-icons/fa";
import { PiLightningFill } from "react-icons/pi";
import { BiSolidOffer } from "react-icons/bi";
import { errorToast } from "../../utils/toast";
import { useNavigate } from "react-router-dom";

const Profile = ({ setAddToCartPopup, setSelectedProduct }) => {
  const navigate = useNavigate();
  const [userActivity, setUserActivity] = useState({});
  const [recentFavorites, setRecentFavorites] = useState(
    userActivity.recent_favorites || []
  );

  const [recentCartItems, setRecentCartItems] = useState(
    userActivity.recent_cart_items || []
  );

  const { recent_successful_payments = [] } = userActivity || {};

  console.log(
    "🚀 ~ Profile ~ recent_successful_payments:",
    recent_successful_payments
  );

  useEffect(() => {
    const fetchData = async () => {
      const activities = await userActivitySummary();
      const cartProductsRes = await getCartProducts();

      setUserActivity(activities.data);

      const favoriteProducts = await Promise.all(
        activities.data.recent_favorites.map(async (favorite) => {
          const productRes = await getProduct(favorite.product);

          const hasCart = cartProductsRes.data.find((cartProduct) => {
            return cartProduct.product == productRes.data.id;
          });

          return { ...favorite, product: productRes.data, cartItem: hasCart };
        })
      );

      setRecentFavorites(favoriteProducts);

      const cartItems = await Promise.all(
        activities.data.recent_cart_items.map(async (item) => {
          const productRes = await getProduct(item.product);
          return { ...item, product: productRes.data };
        })
      );
      console.log(cartItems);
      setRecentCartItems(cartItems);
    };

    fetchData();
  }, []);

  console.log(userActivity);

  // Calculate summary statistics
  const activeOrders = recent_successful_payments.filter(
    (order) => !order.is_delivered
  ).length;
  const totalSpent = recent_successful_payments.reduce(
    (sum, order) => sum + order.total_price,
    0
  );
  const deliveredOrders = recent_successful_payments.filter(
    (order) => order.is_delivered
  ).length;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusInfo = (order) => {
    if (order.is_delivered) {
      return { text: "Delivered", color: "green", icon: FiPackage };
    } else if (order.storekeeper_delivery) {
      return { text: "Shipped", color: "blue", icon: FiTruck };
    } else {
      return { text: "Processing", color: "amber", icon: FiClock };
    }
  };

  const handleAddToCart = async (selectedProduct) => {
    try {
      setSelectedProduct(selectedProduct);
      const response = await addToCart({
        product: selectedProduct.id,
        quantity: 1,
      });
      setAddToCartPopup(true);
      setRecentFavorites(() =>
        recentFavorites.map((item) => {
          if (item.product.id == selectedProduct.id) {
            return { ...item, cartItem: response.data };
          } else {
            return { ...item };
          }
        })
      );
    } catch {
      errorToast("Failed to add product to cart");
    }
  };

  const handleRemoveFromCart = async (favProduct) => {
    try {
      await deleteCartProduct(favProduct.cartItem.id);
      setRecentFavorites(() =>
        recentFavorites.map((item) => {
          if (item.id == favProduct.id) {
            return { ...item, cartItem: null };
          } else {
            return item;
          }
        })
      );
    } catch {
      errorToast("Failed to remove product from cart");
    }
  };

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      await deleteFavorite(favoriteId);
      setRecentFavorites((prev) =>
        prev.filter((item) => item.id != favoriteId)
      );
    } catch {
      errorToast("Failed to remove from favorites");
    }
  };

  const openInNewTab = (url) => {
    window.open(url, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="lg:col-span-3"
    >
      <div className="space-y-6 sm:space-y-7 lg:space-y-5 xl:space-y-9">
        {/* Activity Summary */}
        {/* <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-6 2xl:p-8 border border-blue-400 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-6 sm:mb-8 flex items-center">
            <FiStar
              className="mr-2 sm:mr-3 text-amber-400"
              size={22}
            />
            Activity Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-gradient-to-br from-blue-200 to-blue-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-700 font-semibold text-sm sm:text-base">
                    Active Orders
                  </p>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-blue-900">
                    {activeOrders}
                  </h3>
                </div>
                <div className="bg-blue-500 text-white p-3 rounded-full">
                  <FiPackage size={20} />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-200 to-cyan-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-cyan-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-700 font-semibold text-sm sm:text-base">
                    Total Spent
                  </p>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-cyan-900">
                    ${totalSpent.toFixed(2)}
                  </h3>
                </div>
                <div className="bg-cyan-500 text-white p-3 rounded-full">
                  <FiDollarSign size={20} />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-rose-200 to-rose-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-rose-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-rose-700 font-semibold text-sm sm:text-base">
                    Favorites
                  </p>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-rose-900">
                    {recent_favorites.length}
                  </h3>
                </div>
                <div className="bg-rose-500 text-white p-3 rounded-full">
                  <FiHeart size={20} />
                </div>
              </div>
            </div>
          </div>
        </div> */}

        <div className="bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg p-4 sm:p-5 lg:p-6 2xl:p-8 border border-blue-400 hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900 flex items-center">
              <FiFileText
                className="mr-2 sm:mr-3 text-green-600 mb-0.5"
                size={22}
              />
              Recent Orders
            </h2>
          </div>

          <div className="lg:hidden space-y-3">
            {recent_successful_payments.slice(0, 4).map((order) => {
              const statusInfo = getStatusInfo(order);
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={order.id}
                  className="bg-white border border-blue-200 rounded-lg p-3 sm:p-4 hover:shadow-md hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-colors duration-200 group group"
                  onClick={() => navigate("/account/orders")}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:from-blue-200 group-hover:to-cyan-200 transition-colors duration-200">
                        <FiPackage size={14} className="text-blue-600 " />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="font-semibold text-blue-800 text-sm block truncate">
                          {order.product_name}
                        </span>
                        <span className="text-xs text-blue-600">
                          Qty: {order.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-blue-900 text-base flex-shrink-0 ml-2">
                      ${order.total_price.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                          statusInfo.color === "green"
                            ? "bg-green-100 text-green-900 border border-green-200"
                            : statusInfo.color === "blue"
                            ? "bg-blue-100 text-blue-900 border border-blue-200"
                            : "bg-amber-100 text-amber-900 border border-amber-200"
                        }`}
                      >
                        <StatusIcon size={10} />
                        <span>{statusInfo.text}</span>
                      </span>
                    </div>

                    <div className="text-right">
                      <p className="text-blue-700 text-xs font-medium">
                        {formatDate(order.paid_at)}
                      </p>
                      <p className="text-blue-500 text-xs">
                        {formatTime(order.paid_at)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {recent_successful_payments.length === 0 && (
              <div className="text-center py-12 bg-blue-50/50 rounded-2xl border border-blue-200">
                <FiFileText className="text-blue-400 mx-auto mb-4 " size={30} />
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  No orders yet
                </h3>
                <p className="text-blue-600">
                  Your orders will appear here once you make a purchase.
                </p>
              </div>
            )}
          </div>

          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                {recent_successful_payments.length > 0 && (
                  <tr className="text-left border-b border-blue-300 bg-gradient-to-t from-blue-50 to-blue-50/10">
                    {["Product", "Date & Time", "Amount", "Status"].map(
                      (head, i) => (
                        <th
                          key={i}
                          className="pb-3 px-4 lg:px-6 text-blue-900 font-semibold text-sm whitespace-nowrap first:rounded-tl-lg last:rounded-tr-lg"
                        >
                          {head}
                        </th>
                      )
                    )}
                  </tr>
                )}
              </thead>
              <tbody>
                {recent_successful_payments.slice(0, 4).map((order) => {
                  const statusInfo = getStatusInfo(order);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <tr
                      key={order.id}
                      onClick={() => navigate("/account/orders")}
                      className="border-b border-blue-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-colors duration-200 group"
                    >
                      <td className="py-4 px-4 lg:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:from-blue-200 group-hover:to-cyan-200 transition-colors duration-200">
                            <FiPackage size={16} className="text-blue-600" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-semibold text-blue-800 block truncate max-w-[180px] 2xl:max-w-[220px]">
                              {order.product_name}
                            </span>
                            <span className="text-xs text-blue-600 mt-0.5">
                              Quantity: {order.quantity}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 lg:px-6">
                        <div className="flex flex-col">
                          <span className="text-blue-700 font-medium text-sm whitespace-nowrap">
                            {formatDate(order.paid_at)}
                          </span>
                          <span className="text-blue-500 text-xs">
                            {formatTime(order.paid_at)}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4 lg:px-6">
                        <span className="font-bold text-blue-900 text-base whitespace-nowrap">
                          ${order.total_price.toFixed(2)}
                        </span>
                      </td>

                      <td className="py-4 px-4 lg:px-6">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 w-fit whitespace-nowrap border ${
                            statusInfo.color === "green"
                              ? "bg-green-100 text-green-900 border-green-200"
                              : statusInfo.color === "blue"
                              ? "bg-blue-100 text-blue-900 border-blue-200"
                              : "bg-amber-100 text-amber-900 border-amber-200"
                          }`}
                        >
                          <StatusIcon size={12} />
                          <span>{statusInfo.text}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {recent_successful_payments.length === 0 && (
              <div className="text-center py-12 bg-blue-50/50 rounded-2xl border border-blue-200">
                <FiFileText className="text-blue-400 mx-auto mb-4" size={30} />
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  No orders yet
                </h3>
                <p className="text-blue-600">
                  Your orders will appear here once you make a purchase.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-6 2xl:p-8 border border-blue-400 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-6 sm:mb-8 flex items-center">
            <FiHeart className="mr-2 sm:mr-3 text-rose-500 mb-0.5" size={22} />
            Recent Favorites
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {recentFavorites.slice(0, 3).map((fav) => {
              const product = fav.product;

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className={` group relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl border border-blue-200/50 hover:border-blue-300 transition-all duration-300 overflow-hidden`}
                >
                  <div className="relative overflow-hidden">
                    <div
                      onClick={() => {
                        if (window.innerWidth <= 1024) {
                          openInNewTab(`/product/${product.id}`);
                        }
                      }}
                      className={`${
                        window.innerWidth <= 1024 && "cursor-pointer"
                      } w-full h-80 flex items-center justify-center border-b-1 border-blue-300 mb-0 relative overflow-hidden p-7`}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105 rounded-lg"
                      />
                    </div>

                    {product.amazing_offer && (
                      <div className="absolute flex top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                        <PiLightningFill
                          className="mt-0.25 mr-0.75"
                          size={13}
                        />
                        {product.amazing_offer}
                      </div>
                    )}

                    {window.innerWidth > 1024 && (
                      <>
                        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={() => handleRemoveFavorite(fav.id)}
                            className="p-2 cursor-pointer bg-rose-100 rounded-full hover:bg-rose-200 transition-colors duration-300"
                          >
                            <FaHeart className="text-rose-500 " size={16} />
                          </button>

                          {fav.cartItem ? (
                            <button
                              onClick={() => handleRemoveFromCart(fav)}
                              className="px-1.5 py-1.5 cursor-pointer bg-blue-100 rounded-full hover:bg-blue-200 transition-colors duration-300"
                            >
                              <IoCart className="text-blue-600 " size={20} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="px-1.5 py-1.5 cursor-pointer bg-blue-100 rounded-full hover:bg-blue-200 transition-colors duration-300"
                            >
                              <IoCartOutline
                                className="text-blue-600"
                                size={20}
                              />
                            </button>
                          )}
                        </div>
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                          <button
                            onClick={() =>
                              openInNewTab(`/product/${product.id}`)
                            }
                            className="bg-white cursor-pointer px-6 py-2 rounded-full shadow-md shadow-blue-100 hover:bg-blue-500 hover:text-white transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100"
                          >
                            Quick View
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex justify-between">
                      <h3 className="font-bold text-blue-900 text-lg line-clamp-2 mb-1">
                        {product.name}
                      </h3>
                      {window.innerWidth <= 1024 && (
                        <div className="flex gap-2  duration-300">
                          <button
                            onClick={() => handleRemoveFavorite(fav.id)}
                            className="p-2 cursor-pointer bg-rose-100 rounded-full hover:bg-rose-200 transition-colors duration-300"
                          >
                            <FaHeart className="text-rose-500 " size={16} />
                          </button>

                          {fav.cartItem ? (
                            <button
                              onClick={() => handleRemoveFromCart(fav)}
                              className="px-1.5 cursor-pointer bg-blue-100 rounded-full hover:bg-blue-200 transition-colors duration-300"
                            >
                              <IoCart className="text-blue-600 " size={20} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="px-1.5 cursor-pointer bg-blue-100 rounded-full hover:bg-blue-200 transition-colors duration-300"
                            >
                              <IoCartOutline
                                className="text-blue-600"
                                size={20}
                              />
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center w-full justify-between gap-2 flex-wrap">
                      <div className="flex-wrap">
                        <span className="text-xl font-bold text-blue-800">
                          ${product.discounted_price || product.price}
                        </span>

                        {product.discounted_price && (
                          <span className="text-sm ml-2 text-rose-500 line-through">
                            ${product.price}
                          </span>
                        )}
                      </div>

                      {product.discount_percentage && (
                        <div className="right-3 flex bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                          <span className="mt-0.25 mr-1">
                            {product.discount_percentage}{" "}
                          </span>
                          <BiSolidOffer className="" size={18} />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-blue-100 px-2 py-1 rounded-full">
                          <FiStar
                            className="text-amber-400 fill-amber-400"
                            size={12}
                          />
                          <span className="text-xs font-medium text-blue-800 ml-1">
                            {product.average_rating?.toFixed(1) || "0.0"}
                          </span>
                        </div>
                        <span className="text-xs text-blue-600">
                          ({product.comment_count} reviews)
                        </span>
                      </div>

                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          product.stock_quantity > 10
                            ? "bg-green-100 text-green-800"
                            : product.stock_quantity > 0
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {product.stock_quantity > 0
                          ? `${product.stock_quantity} in stock`
                          : "Out of stock"}
                      </span>
                    </div>
                  </div>

                  {product.discount_period ? (
                    <div className="px-4 pb-4">
                      <div className="bg-blue-100 rounded-lg p-2">
                        <p className="text-xs flex items-center justify-center text-blue-700 font-medium text-center">
                          <FaClock className="mr-1 " size={16} /> Offer ends:{" "}
                          {new Date(
                            product.discount_period
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-12 w-full "></div>
                  )}
                </motion.div>
              );
            })}

            {recentFavorites.length === 0 && (
              <div className="text-center col-span-full py-12 bg-blue-50/50 rounded-2xl border border-blue-200">
                <FiHeart className="text-blue-400 mx-auto mb-4" size={30} />
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  No favorites yet
                </h3>
                <p className="text-blue-600">
                  Your favorite products will appear here
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg p-4 sm:p-6 border border-blue-400 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-blue-900 flex items-center">
              <FiShoppingCart
                className="mr-2 sm:mr-3 text-blue-600"
                size={20}
              />
              Cart Items
            </h2>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {recentCartItems.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-blue-50 rounded-lg sm:rounded-xl border border-blue-200 hover:border-blue-300 transition-all duration-200"
              >
                <div className="flex items-start gap-3 sm:flex-1 w-full sm:w-auto">
                  <div onClick={() => openInNewTab(`/product/${item.product.id}`)} className="cursor-pointer w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-lg overflow-hidden border border-blue-200 bg-white">
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
                <FiShoppingCart
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
      </div>
    </motion.div>
  );
};

export default Profile;
