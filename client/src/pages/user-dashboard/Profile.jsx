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
} from "react-icons/fi";
import { IoCart, IoCartOutline } from "react-icons/io5";

import { userActivitySummary } from "../../services/userAPIServices";
import { getCartProducts } from "../../services/cartAPIServices";
import { getProduct } from "../../services/productAPIServices";
import { FaClock, FaHeart } from "react-icons/fa";
import { PiLightningFill } from "react-icons/pi";
import { BiSolidOffer } from "react-icons/bi";
import { handleRemoveFavorite } from "../../utils/favoritesService";

const Profile = ({
  reloadComponent,
  setReloadComponent,
  setAddToCartPopup,
  setSelectedProduct,
  setRemoveProductPopup,
}) => {
  const [userActivity, setUserActivity] = useState({});
  const [recentFavorites, setRecentFavorites] = useState(
    userActivity.recent_favorites || []
  );

  const { recent_cart_items = [], recent_successful_payments = [] } =
    userActivity || {};

  useEffect(() => {
    const fetchData = async () => {
      const activities = await userActivitySummary();
      const cartProductsRes = await getCartProducts();

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
      setUserActivity(activities.data);
      console.log(favoriteProducts);
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

        {/* Recent Orders */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-6 2xl:p-8 border border-blue-400 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-6 sm:mb-8 flex items-center">
            <FiShoppingCart className="mr-2 sm:mr-3 text-blue-600" size={22} />
            Recent Orders
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm sm:text-base">
              <thead>
                <tr className="text-left border-b border-blue-300">
                  {["Product", "Date", "Amount", "Status", "Delivery"].map(
                    (head, i) => (
                      <th
                        key={i}
                        className="pb-3 sm:pb-4 px-4 sm:px-6 text-blue-900 font-semibold"
                      >
                        {head}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {recent_successful_payments.slice(0, 5).map((order) => {
                  const statusInfo = getStatusInfo(order);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <tr
                      key={order.id}
                      className="border-b border-blue-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-200 cursor-pointer"
                    >
                      <td className="py-3 sm:py-5 px-4 sm:px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                            <FiPackage size={14} className="text-blue-600" />
                          </div>
                          <span className="font-semibold text-blue-800 max-w-[120px] truncate">
                            {order.product_name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 sm:py-5 px-4 sm:px-6 text-blue-700">
                        <div className="flex flex-col">
                          <span className="text-sm">
                            {formatDate(order.paid_at)}
                          </span>
                          <span className="text-xs text-blue-500">
                            {formatTime(order.paid_at)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 sm:py-5 px-4 sm:px-6 font-semibold text-blue-800">
                        ${order.total_price.toFixed(2)}
                      </td>
                      <td className="py-3 sm:py-5 px-4 sm:px-6">
                        <span
                          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm shadow-sm font-semibold flex items-center space-x-1 w-fit ${
                            statusInfo.color === "green"
                              ? "bg-green-100 text-green-900"
                              : statusInfo.color === "blue"
                              ? "bg-blue-100 text-blue-900"
                              : "bg-amber-100 text-amber-900"
                          }`}
                        >
                          <StatusIcon size={12} />
                          <span>{statusInfo.text}</span>
                        </span>
                      </td>
                      <td className="py-3 sm:py-5 px-4 sm:px-6">
                        <span
                          className={`text-xs font-medium ${
                            order.storekeeper_delivery
                              ? "text-green-600"
                              : "text-amber-600"
                          }`}
                        >
                          {order.storekeeper_delivery
                            ? "Store Delivery"
                            : "Standard"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {recent_successful_payments.length === 0 && (
              <div className="text-center py-8 text-blue-600">
                <FiShoppingCart size={32} className="mx-auto mb-3 opacity-50" />
                <p>No recent orders found</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Favorites */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-6 2xl:p-8 border border-blue-400 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-6 sm:mb-8 flex items-center">
            <FiHeart className="mr-2 sm:mr-3 text-rose-500" size={22} />
            Recent Favorites
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {recentFavorites.slice(0,3).map((fav) => {
              console.log(fav.product);
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
                            onClick={() =>
                              handleRemoveFavorite(fav.id, () =>
                                setRecentFavorites((prev) =>
                                  prev.filter((item) => item.id != fav.id)
                                )
                              )
                            }
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
                            onClick={() =>
                              handleRemoveFavorite(fav.id, () =>
                                setRecentFavorites((prev) =>
                                  prev.filter((item) => item.id != fav.id)
                                )
                              )
                            }
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
              <div className="col-span-full text-center py-8 text-blue-600">
                <FiHeart size={32} className="mx-auto mb-3 opacity-50" />
                <p>No favorites yet</p>
                <p className="text-sm text-blue-500 mt-1">
                  Start adding products to your favorites!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Cart Items */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-6 2xl:p-8 border border-blue-400 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-6 sm:mb-8 flex items-center">
            <IoCartOutline className="mr-2 sm:mr-3 text-blue-600" size={22} />
            Cart Items
          </h2>
          <div className="space-y-4">
            {recent_cart_items.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiPackage className="text-blue-600" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-blue-900 truncate">
                    Product #{item.product}
                  </h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-blue-700">
                      Qty: {item.quantity}
                    </span>
                    <span className="text-sm font-bold text-blue-900">
                      ${item.total_price.toFixed(2)}
                    </span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium text-sm">
                  Checkout
                </button>
              </div>
            ))}

            {recent_cart_items.length === 0 && (
              <div className="text-center py-8 text-blue-600">
                <IoCartOutline size={32} className="mx-auto mb-3 opacity-50" />
                <p>Your cart is empty</p>
                <p className="text-sm text-blue-500 mt-1">
                  Add some products to get started!
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
