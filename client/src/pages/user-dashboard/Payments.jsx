import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  getDeliveredPayments,
  getNotDeliveredPayments,
  getStorekeeperDeliveryPayments,
  getStorekeeperPayments,
  productSubmission,
} from "../../services/userAPIServices";
import { getProduct } from "../../services/productAPIServices";
import { getPurchaseByPayment } from "../../services/commentAPIServices";

import SendNotePopup from "../../components/pop-ups/SendNotePopup";

import {
  FiPackage,
  FiMessageSquare,
  FiCheckCircle,
  FiTruck,
  FiDollarSign,
  FiMapPin,
  FiTrendingUp,
  FiBox,
  FiFileText,
  FiCalendar,
  FiRefreshCw,
  FiChevronDown,
} from "react-icons/fi";
import { errorToast, successToast } from "../../utils/toast";
import { SectionLoader } from "../../components/SectionLoader";

const Payments = () => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const [payments, setPayments] = useState([]);
  const [showSendNotePopup, setShowSendNotePopup] = useState(false);
  const [payload, setPayload] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const paymentsStartRef = useRef(null);

  const filter = searchParams.get("filter") || "All";

  useEffect(() => {
    setPayments([]);
    setPage(1);
    setHasMore(true);
    fetchPayments(true);
  }, [filter]);

  const getAPIForFilter = (nextPage) => {
    switch (filter) {
      case "Pending":
        return getStorekeeperDeliveryPayments(nextPage);
      case "Shipped":
        return getNotDeliveredPayments(nextPage);
      case "Delivered":
        return getDeliveredPayments(nextPage);
      default:
        return getStorekeeperPayments(nextPage);
    }
  };

  const fetchPayments = async (isInitial = false) => {
    try {
      const nextPage = isInitial ? 1 : page + 1;

      if (isInitial) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const response = await getAPIForFilter(nextPage);
      const newPayments = await enrichPaymentsData(response.data.results);

      if (isInitial) {
        setPayments(newPayments);
        setPage(1);
      } else {
        setPayments((prev) => {
          const merged = [...prev, ...newPayments];
          return merged;
        });
        setPage(nextPage);
      }

      setHasMore(response.data.next !== null);

      setIsLoading(false);
      setIsLoadingMore(false);

      if (isInitial && paymentsStartRef.current) {
        setTimeout(() => {
          paymentsStartRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    } catch {
      setIsLoading(false);
      setIsLoadingMore(false);
      if (isInitial) setPayments([]);
    }
  };

  const enrichPaymentsData = async (paymentsData) => {
    return await Promise.all(
      paymentsData.map(async (payment) => {
        try {
          const productRes = await getProduct(payment.product);
          return {
            ...payment,
            product: productRes?.data ?? null,
          };
        } catch {
          return {
            ...payment,
            product: null,
          };
        }
      })
    );
  };

  const determineStatus = (payment) => {
    if (payment.storekeeper_delivery) {
      return payment.buyer_delivery ? "Delivered" : "Shipped";
    }
    return "Pending";
  };

  const handleFilterChange = (newFilter) => {
    if (paymentsStartRef.current) {
      paymentsStartRef.current.scrollIntoView({
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
        return <FiPackage className="text-amber-500" size={18} />;
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
    fetchPayments(false);
  };

  const openInNewTab = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const getStatusCount = (status) => {
    switch (status) {
      case "Pending":
        return payments.filter(
          (p) => !p.storekeeper_delivery && !p.buyer_delivery
        ).length;
      case "Shipped":
        return payments.filter(
          (p) => p.storekeeper_delivery && !p.buyer_delivery
        ).length;
      case "Delivered":
        return payments.filter(
          (p) => p.storekeeper_delivery && p.buyer_delivery
        ).length;
      default:
        return payments.length;
    }
  };

  const filteredPayments =
    filter === "All"
      ? payments
      : payments.filter((payment) => {
          const status = determineStatus(payment);
          return status === filter;
        });

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="lg:col-span-3"
    >
      <div className="space-y-4 sm:space-y-7 lg:space-y-5 xl:space-y-9">
        <div
          ref={paymentsStartRef}
          className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 2xl:p-8 border border-blue-400 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300"
        >
          <div className="sm:flex sm:items-center mb-3">
            <div className="mb-2">
              <div className="flex items-center mb-1 sm:mb-0">
                <FiDollarSign className="text-green-600 mr-3" size={22} />
                <h1 className="text-base sm:text-lg md:text-2xl font-bold text-blue-800">
                  Payments
                </h1>
              </div>
              <p className="text-blue-700 text-xs sm:text-sm ml-8 sm:ml-[34px]">
                Manage customer payments and deliveries
              </p>
            </div>

            <div className="ml-auto">
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
              >
                {filteredPayments.length}{" "}
                {filteredPayments.length === 1 ? "order" : "orders"}
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

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-purple-200">
              <div className="flex items-center justify-between">
                <span className="text-purple-600 text-xs sm:text-sm">
                  Total Revenue
                </span>
                <FiTrendingUp
                  className="text-purple-500 flex-shrink-0"
                  size={16}
                />
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-900 mt-1">
                $
                {payments
                  .reduce((total, payment) => total + payment.total_price, 0)
                  .toFixed(2)}
              </p>
            </div>

            <div className="bg-amber-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-amber-200">
              <div className="flex items-center justify-between">
                <span className="text-amber-600 text-xs sm:text-sm">
                  Pending
                </span>
                <FiPackage className="text-amber-500 flex-shrink-0" size={16} />
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-900 mt-1">
                {getStatusCount("Pending")}
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-blue-600 text-xs sm:text-sm">
                  Shipped
                </span>
                <FiTruck className="text-blue-500 flex-shrink-0" size={16} />
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900 mt-1">
                {getStatusCount("Shipped")}
              </p>
            </div>

            <div className="bg-green-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <span className="text-green-600 text-xs sm:text-sm">
                  Delivered
                </span>
                <FiCheckCircle
                  className="text-green-500 flex-shrink-0"
                  size={16}
                />
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-900 mt-1">
                {getStatusCount("Delivered")}
              </p>
            </div>
          </div>

          {isLoading ? (
            <SectionLoader chatLoader={false} title="Payments" />
          ) : filteredPayments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12 bg-blue-50/50 rounded-2xl border border-blue-200"
            >
              <FiDollarSign className="text-blue-400 mx-auto mb-4" size={48} />
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                No payments found
              </h3>
              <p className="text-blue-600">
                {filter === "All"
                  ? "Customer payments will appear here."
                  : `No ${filter.toLowerCase()} payments found.`}
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
                {filteredPayments.map((payment, index) => (
                  <motion.div
                    key={`${payment.id}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="bg-gradient-to-r from-blue-50/80 to-cyan-50/80 rounded-2xl p-6 border border-blue-200/60 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-4">
                      <div className="lg:col-span-6 xl:col-span-5 flex items-start space-x-4">
                        {payment.product?.image ? (
                          <div
                            onClick={() =>
                              openInNewTab(`/product/${payment.product.id}`)
                            }
                            className="w-20 h-20 cursor-pointer border-2 bg-white border-blue-400 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-1 hover:border-blue-500 transition-colors"
                          >
                            <img
                              src={payment.product?.image}
                              alt={payment.product?.name}
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
                            {payment.product_name}
                          </h3>
                          <div className="space-y-1">
                            <p className="text-blue-600 text-sm">
                              Customer:{" "}
                              <span className="font-medium">
                                {payment?.buyer_name || "Unknown Customer"}
                              </span>
                            </p>
                            <div className="flex items-center gap-3">
                              <p className="text-blue-800 font-bold text-base">
                                ${payment?.total_price}
                              </p>
                              <span className="text-xs text-blue-500 bg-blue-100 px-2 py-1 rounded-full font-medium">
                                x{payment?.quantity}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-3 xl:col-span-3 flex flex-col justify-center space-y-3">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(determineStatus(payment))}
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(
                              determineStatus(payment)
                            )}`}
                          >
                            {determineStatus(payment)}
                          </span>
                        </div>

                        <div className="text-sm text-blue-600 space-y-1">
                          {determineStatus(payment) === "Delivered" ? (
                            <p className="flex items-center gap-1">
                              <FiCheckCircle
                                size={14}
                                className="text-green-500 mb-0.5"
                              />
                              Delivered on{" "}
                              {payment.buyer_delivered_at
                                ? new Date(
                                    payment.buyer_delivered_at
                                  ).toLocaleDateString()
                                : "Unknown date"}
                            </p>
                          ) : determineStatus(payment) === "Shipped" ? (
                            <p className="flex items-center gap-1">
                              <FiTruck
                                size={14}
                                className="text-blue-500 mb-0.5"
                              />
                              Shipped on{" "}
                              {payment.storekeeper_delivered_at
                                ? new Date(
                                    payment.storekeeper_delivered_at
                                  ).toLocaleDateString()
                                : "Unknown date"}
                            </p>
                          ) : (
                            <p className="flex items-center gap-1">
                              <FiPackage
                                size={14}
                                className="text-amber-500 mb-0.5"
                              />
                              Waiting for shipment
                            </p>
                          )}
                          <p className="text-xs text-blue-500 flex items-center gap-1">
                            <FiCalendar size={12} className="mb-1" />
                            Ordered:{" "}
                            {new Date(payment.paid_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="lg:col-span-3 xl:col-span-4 flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-2 justify-start lg:justify-end items-center">
                        <button
                          onClick={() => {
                            getPurchaseByPayment(payment.id)
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

                        {determineStatus(payment) === "Pending" && (
                          <button
                            onClick={() => {
                              setShowSendNotePopup(true);
                              const now = new Date().toISOString();
                              setPayload({
                                payment: payment.id,
                                is_shipped: true,
                                shipped_at: now,
                                note: "",
                              });
                            }}
                            className="flex items-center w-full md:w-auto justify-center px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 text-sm font-semibold whitespace-nowrap min-w-[120px] shadow-sm hover:shadow-md"
                          >
                            <FiTruck className="mr-2" size={16} />
                            Ship Order
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mb-4 pt-4 border-t border-blue-200/50">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-9 gap-4 text-sm">
                        <div className="space-y-2 2xl:col-span-3">
                          <div className="flex items-start flex-row lg:flex-col 2xl:flex-row gap-2 text-blue-600">
                            <div className="flex gap-2">
                              <FiMapPin size={14} className="mt-0.5" />
                              <span className="font-medium">Address:</span>
                            </div>
                            <p className="text-blue-800 text-sm">
                              {payment.address}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2 2xl:col-span-2">
                          <div className="flex items-start flex-row lg:flex-col 2xl:flex-row gap-2 text-blue-600">
                            <div className="flex gap-2">
                              <FiDollarSign size={14} className="mt-0.5" />
                              <span className="font-medium">Price:</span>
                            </div>
                            <p className="text-blue-800 font-mono text-sm">
                              ${payment.total_price}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2 2xl:col-span-2">
                          <div className="flex items-start flex-row lg:flex-col 2xl:flex-row gap-2 text-blue-600">
                            <div className="flex gap-2">
                              <FiBox size={14} className="mt-0.5" />
                              <span className="font-medium">Quantity:</span>
                            </div>
                            <p className="text-blue-800 font-mono text-sm">
                              {payment.quantity}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2 2xl:col-span-2">
                          <div className="flex items-start flex-row lg:flex-col 2xl:flex-row gap-2 text-blue-600">
                            <div className="flex gap-2">
                              <FiFileText size={14} className="mt-0.5" />
                              <span className="font-medium">Order ID:</span>
                            </div>
                            <p className="text-blue-800 font-mono text-sm">
                              #{payment.id}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-blue-200/50">
                      <div className="flex items-center justify-between text-sm text-blue-600 mb-3">
                        <span className="font-medium">Order Progress</span>
                        <span className="font-semibold">
                          {determineStatus(payment)}
                        </span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-1000 ${
                            determineStatus(payment) === "Pending"
                              ? "bg-amber-500 w-1/3"
                              : determineStatus(payment) === "Shipped"
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
                        Loading more payments...
                      </>
                    ) : (
                      <>
                        <FiChevronDown size={18} />
                        Load More Payments
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>

      {showSendNotePopup && (
        <SendNotePopup
          onClose={() => setShowSendNotePopup(false)}
          onConfirm={(note) => {
            const date = new Date();
            productSubmission({
              ...payload,
              note,
              is_sent: true,
              sent_at: date,
            })
              .then(() => {
                successToast("The product shipped successfully");
                setPayments((prev) =>
                  prev.map((payment) =>
                    payment.id == payload.payment
                      ? {
                          ...payment,
                          storekeeper_delivered_at: date,
                          storekeeper_delivery: true,
                        }
                      : payment
                  )
                );
              })
              .catch(() => {
                errorToast(
                  "The desired product does not exist. The operation was not successful"
                );
              });
          }}
          payload={payload}
        />
      )}
    </motion.div>
  );
};

export default Payments;
