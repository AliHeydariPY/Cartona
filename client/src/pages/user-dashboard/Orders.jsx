import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  getPayments,
  setAsDelivered,
  getStorekeeperDeliveryPayments,
  getNotDeliveredPayments,
  getDeliveredPayments,
} from "../../services/cartAPIServices";
import { getProduct } from "../../services/productAPIServices";
import { getStorekeeperById } from "../../services/userAPIServices";
import {
  getComments,
  getPurchaseByPayment,
} from "../../services/commentAPIServices";

import ReviewModal from "../../components/pop-ups/ReviewModal";

import {
  FiPackage,
  FiMessageSquare,
  FiCheckCircle,
  FiTruck,
  FiClock,
  FiBox,
  FiFileText,
  FiStar,
  FiCalendar,
  FiCreditCard,
  FiShield,
  FiHash,
  FiRefreshCw,
  FiChevronDown,
} from "react-icons/fi";
import { errorToast, successToast } from "../../utils/toast";
import { useAtom } from "jotai";
import { userAtom } from "../../atoms/userAtom";
import { SectionLoader } from "../../components/SectionLoader";

const Orders = () => {
  const navigate = useNavigate();
  const [user] = useAtom(userAtom);

  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [totalOrders, setTotalOrders] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const ordersStartRef = useRef(null);

  const filter = searchParams.get("filter") || "All";

  useEffect(() => {
    if (!user) return;

    setOrders([]);
    setPage(1);
    setHasMore(true);
    fetchOrders(true);
  }, [user, filter]);

  const getAPIForFilter = (nextPage) => {
    switch (filter) {
      case "Pending":
        return getStorekeeperDeliveryPayments(nextPage);
      case "Shipped":
        return getNotDeliveredPayments(nextPage);
      case "Delivered":
        return getDeliveredPayments(nextPage);
      default:
        return getPayments(nextPage);
    }
  };

  const fetchOrders = async (isInitial = false) => {
    try {
      const nextPage = isInitial ? 1 : page + 1;

      if (isInitial) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const response = await getAPIForFilter(nextPage);
      const newOrders = await enrichOrdersData(response.data.results);

      setTotalOrders(response.data.count);

      if (isInitial) {
        setOrders(newOrders);
        setPage(1);
      } else {
        setOrders((prev) => {
          const merged = [...prev, ...newOrders];
          return merged;
        });
        setPage(nextPage);
      }

      setHasMore(response.data.next !== null);

      setIsLoading(false);
      setIsLoadingMore(false);

      if (isInitial && ordersStartRef.current) {
        setTimeout(() => {
          ordersStartRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    } catch {
      setIsLoading(false);
      setIsLoadingMore(false);
      if (isInitial) setOrders([]);
    }
  };

  const enrichOrdersData = async (payments) => {
    return await Promise.all(
      payments.map(async (payment) => {
        try {
          const storekeeperRes = await getStorekeeperById(payment.storekeeper);
          let productData = null;
          let hasRated = false;

          try {
            const productRes = await getProduct(payment.product);
            productData = productRes.data;

            try {
              const commentRes = await getComments(productRes.data.id);
              hasRated = commentRes.data.some((comment) => {
                return comment.user === user?.username;
              });
            } catch {
              hasRated = false;
            }
          } catch {
            productData = null;
          }

          return {
            ...payment,
            product: productData,
            storekeeper: storekeeperRes.data.store_name,
            status: determineStatus(payment),
            hasRated,
          };
        } catch {
          return {
            ...payment,
            status: determineStatus(payment),
            storekeeper: "Unknown Store",
          };
        }
      })
    );
  };

  const determineStatus = (payment) => {
    if (payment.storekeeper_delivery) {
      return payment.is_delivered ? "Delivered" : "Shipped";
    }
    return "Pending";
  };

  const handleFilterChange = (newFilter) => {
    if (ordersStartRef.current) {
      ordersStartRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setTimeout(() => {
      setSearchParams({ filter: newFilter });
    }, 300);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <FiClock className="text-amber-500" size={18} />;
      case "Shipped":
        return <FiTruck className="text-blue-500" size={18} />;
      case "Delivered":
        return <FiCheckCircle className="text-green-500" size={18} />;
      default:
        return <FiPackage className="text-gray-500" size={18} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "Shipped":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const handleLoadMore = () => {
    if (!hasMore || isLoadingMore) return;
    fetchOrders(false);
  };

  const openInNewTab = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => order.status === filter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="lg:col-span-3"
    >
      <div className="space-y-4 sm:space-y-7 lg:space-y-5 xl:space-y-9">
        <div
          ref={ordersStartRef}
          className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 2xl:p-8 border border-blue-400 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300"
        >
          <div className="sm:flex sm:items-center mb-3">
            <div className="mb-2">
              <div className="flex items-center mb-1 sm:mb-0">
                <FiFileText className="text-green-600 mr-3" size={22} />
                <h1 className="text-base sm:text-lg md:text-2xl font-bold text-blue-800">
                  Orders
                </h1>
              </div>
              <p className="text-blue-700 text-xs sm:text-sm ml-8 sm:ml-[34px]">
                Track and manage your purchases
              </p>
            </div>

            <div className="ml-auto">
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium"
              >
                {totalOrders} {totalOrders === 1 ? "order" : "orders"}
              </motion.span>
            </div>
          </div>

          <motion.div
            key={filter}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 mb-4"
          >
            {["All", "Pending", "Shipped", "Delivered"].map((status) => (
              <motion.button
                key={status}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFilterChange(status)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 cursor-pointer rounded-lg text-xs sm:text-sm font-semibold border transition-all duration-300 ${
                  filter === status
                    ? "bg-blue-600 text-white border-blue-600 transform scale-105"
                    : "bg-white text-blue-700 border-blue-300 hover:bg-blue-50"
                }`}
              >
                {status}
              </motion.button>
            ))}
          </motion.div>

          {isLoading ? (
            <SectionLoader chatLoader={false} title="Orders" />
          ) : filteredOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12 bg-blue-50/50 rounded-2xl border border-blue-200"
            >
              <FiFileText className="text-blue-400 mx-auto mb-4" size={48} />
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                No orders found
              </h3>
              <p className="text-blue-600">
                {filter === "All"
                  ? "Your orders will appear here once you make a purchase."
                  : `No ${filter.toLowerCase()} orders found.`}
              </p>
            </motion.div>
          ) : (
            <>
              <motion.div
                key={`${filter}-${page}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {filteredOrders.map((order, index) => (
                  <motion.div
                    key={`${order.id}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="bg-gradient-to-r from-blue-50/80 to-cyan-50/80 rounded-2xl p-6 border border-blue-200/60 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-4">
                      <div className="lg:col-span-6 xl:col-span-5 flex items-start space-x-4">
                        {order.product?.image ? (
                          <div
                            onClick={() =>
                              openInNewTab(`/product/${order.product.id}`)
                            }
                            className="w-20 h-20 cursor-pointer border-2 bg-white border-blue-400 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-1 hover:border-blue-500 transition-colors"
                          >
                            <img
                              src={order.product?.image}
                              alt={order.product?.name}
                              className="w-full h-full object-contain rounded-md"
                            />
                          </div>
                        ) : (
                          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <FiBox className="text-blue-600" size={28} />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-blue-900 text-lg mb-2 line-clamp-2">
                            {order.product_name}
                          </h3>
                          <div className="space-y-1">
                            <p className="text-blue-600 text-sm">
                              Sold by:{" "}
                              <span className="font-medium">
                                {order?.storekeeper}
                              </span>
                            </p>
                            <div className="flex items-center gap-3">
                              <p className="text-blue-800 font-bold text-base">
                                ${order?.total_price}
                              </p>
                              <span className="text-xs text-blue-500 bg-blue-100 px-2 py-1 rounded-full font-medium">
                                x{order?.quantity}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-3 xl:col-span-3 flex flex-col justify-center space-y-3">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.status)}
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </div>

                        <div className="text-sm text-blue-600 space-y-1">
                          {order.status === "Delivered" ? (
                            <p className="flex items-center gap-1">
                              <FiCheckCircle
                                size={14}
                                className="text-green-500 mb-0.5"
                              />
                              Delivered on {order.delivered_at}
                            </p>
                          ) : (
                            <p className="flex items-center gap-1">
                              <FiTruck
                                size={14}
                                className="text-blue-500 mb-0.5"
                              />
                              Est. delivery:{" "}
                              {new Date(
                                new Date(
                                  order.storekeeper_delivered_at
                                ).getTime() +
                                  7 * 24 * 60 * 60 * 1000
                              ).toLocaleDateString()}
                            </p>
                          )}
                          <p className="text-xs text-blue-500 flex items-center gap-1">
                            <FiCalendar size={12} className="mb-1" />
                            Ordered: {order.paid_at}
                          </p>
                        </div>
                      </div>

                      <div className="lg:col-span-3 xl:col-span-4 flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-2 justify-start lg:justify-end items-center">
                        <button
                          onClick={() => {
                            getPurchaseByPayment(order.id)
                              .then((res) => {
                                navigate(`/account/chats/${res.data[0].id}`);
                              })
                              .catch((err) => {
                                errorToast(err.response.data.detail);
                              });
                          }}
                          className="flex items-center w-full md:w-auto justify-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-colors duration-300 text-sm font-semibold whitespace-nowrap min-w-[120px] shadow-sm hover:shadow-md"
                        >
                          <FiMessageSquare className="mr-2" size={16} />
                          Chat
                        </button>

                        {order.status === "Shipped" && (
                          <button
                            onClick={() => {
                              setAsDelivered(order.id, {
                                is_delivered: true,
                                delivered_at: new Date().toISOString(),
                              }).then(() => {
                                successToast("Successfully registered");
                                setOrders((prev) =>
                                  prev.map((o) =>
                                    o.id === order.id
                                      ? {
                                          ...o,
                                          is_delivered: true,
                                          status: "Delivered",
                                        }
                                      : o
                                  )
                                );
                              });
                            }}
                            className="flex items-center w-full md:w-auto justify-center px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 text-sm font-semibold whitespace-nowrap min-w-[120px] shadow-sm hover:shadow-md"
                          >
                            <FiCheckCircle className="mr-2" size={16} />
                            Received
                          </button>
                        )}

                        {order.status === "Delivered" &&
                          (order.hasRated ? (
                            <button
                              disabled
                              className="flex items-center w-full md:w-auto justify-center px-4 py-2.5 bg-gray-200 text-gray-600 rounded-lg cursor-not-allowed text-sm font-semibold whitespace-nowrap min-w-[120px]"
                            >
                              <FiStar className="mr-1.5" size={16} />
                              Rated
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                if (order.product) {
                                  setSelectedProduct(order.product);
                                  setIsReviewOpen(true);
                                } else {
                                  errorToast("This product does not exist");
                                }
                              }}
                              className="flex items-center w-full md:w-auto justify-center px-4 py-2.5 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition-colors duration-300 text-sm font-semibold whitespace-nowrap min-w-[120px] shadow-sm hover:shadow-md"
                            >
                              <FiStar className="mr-2" size={16} />
                              Rate
                            </button>
                          ))}
                      </div>
                    </div>

                    <div className="mb-4 pt-4 border-t border-blue-200/50">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-9 gap-4 text-sm">
                        <div className="space-y-2 2xl:col-span-3 ">
                          <div className="flex items-start flex-row lg:flex-col 2xl:flex-row gap-2 text-blue-600">
                            <div className="flex gap-2">
                              <FiCreditCard size={14} className="mt-0.5" />
                              <span className="font-medium ">Card Number:</span>
                            </div>
                            <p className="text-blue-800 font-mono text-sm">
                              {order.fake_card_number}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2 2xl:col-span-2">
                          <div className="flex items-start flex-row lg:flex-col 2xl:flex-row gap-2 text-blue-600">
                            <div className="flex  gap-2">
                              <FiCalendar size={14} className="mt-0.5" />
                              <span className="font-medium">Expiry:</span>
                            </div>
                            <p className="text-blue-800 font-mono text-sm">
                              {order.fake_card_expiry}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2 2xl:col-span-2">
                          <div className="flex items-start flex-row lg:flex-col 2xl:flex-row gap-2 text-blue-600">
                            <div className="flex  gap-2">
                              <FiShield size={14} className="mt-0.5" />
                              <span className="font-medium">CVV:</span>
                            </div>
                            <p className="text-blue-800 font-mono text-sm">
                              {order.fake_card_cvv}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2 2xl:col-span-2">
                          <div className="flex items-start flex-row lg:flex-col 2xl:flex-row gap-2 text-blue-600">
                            <div className="flex  gap-2">
                              <FiHash size={14} className="mt-0.5" />
                              <span className="font-medium">Order ID:</span>
                            </div>
                            <p className="text-blue-800 font-mono text-sm">
                              #{order.id}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-blue-200/50">
                      <div className="flex items-center justify-between text-sm text-blue-600 mb-3">
                        <span className="font-medium">Order Progress</span>
                        <span className="font-semibold">{order.status}</span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-1000 ${
                            order.status === "Pending"
                              ? "bg-amber-500 w-1/3"
                              : order.status === "Shipped"
                              ? "bg-blue-500 w-2/3"
                              : "bg-green-500 w-full"
                          }`}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-blue-500 mt-2">
                        <span>Ordered</span>
                        <span>Shipped</span>
                        <span>Delivered</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {hasMore && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="flex justify-center mt-8 pt-6 border-t border-blue-200"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="flex items-center gap-2 px-4 xs:px-6 py-2 cursor-pointer rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 text-sm xs:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoadingMore ? (
                      <>
                        <FiRefreshCw className="animate-spin" size={18} />
                        Loading more orders...
                      </>
                    ) : (
                      <>
                        <FiChevronDown size={18} />
                        Load More Orders
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>

      {isReviewOpen && (
        <ReviewModal
          onClose={() => setIsReviewOpen(false)}
          product={selectedProduct}
          setOrders={setOrders}
        />
      )}
    </motion.div>
  );
};

export default Orders;
