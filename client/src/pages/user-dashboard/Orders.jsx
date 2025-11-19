import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { getPayments, setAsDelivered } from "../../services/cartAPIServices";
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
} from "react-icons/fi";
import { errorToast, successToast } from "../../utils/toast";
import { useAtom } from "jotai";
import { userAtom } from "../../atoms/userAtom";
import { SectionLoader } from "../../components/SectionLoader";

const Orders = ({ reloadComponent, setReloadComponent }) => {
  const navigate = useNavigate();
  const [user] = useAtom(userAtom);

  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(null);

  const [visibleCount, setVisibleCount] = useState(4);
  const [isLoading, setIsLoading] = useState(true);

  const filter = searchParams.get("filter") || "All";

  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => order.status === filter);

  useEffect(() => {
    if (!user) return;

    const fetchPaymentsData = async () => {
      try {
        const paymentsRes = await getPayments();
        const payments = await Promise.all(
          paymentsRes.data.map(async (payment) => {
            const productRes = await getProduct(payment.product);
            const storekeeperRes = await getStorekeeperById(
              productRes.data.storekeeper
            );
            try {
              const commentRes = await getComments(productRes.data.id);

              return {
                ...payment,
                product: productRes.data,
                storekeeper: storekeeperRes.data.store_name,
                status: payment.storekeeper_delivery
                  ? payment.is_delivered
                    ? "Delivered"
                    : "Shipped"
                  : "Pending",
                hasRated: commentRes.data.some((comment) => {
                  return comment.user == user?.username;
                }),
              };
            } catch {
              return {
                ...payment,
                product: productRes.data,
                storekeeper: storekeeperRes.data.store_name,
                status: payment.storekeeper_delivery
                  ? payment.is_delivered
                    ? "Delivered"
                    : "Shipped"
                  : "Pending",
                hasRated: false,
              };
            }
          })
        );
        setIsLoading(false);
        setOrders([...payments]);
      } catch {
        setIsLoading(false);
      }
    };

    fetchPaymentsData();
  }, [reloadComponent, user]);

  const getStatusCount = (status) => {
    switch (status) {
      case "Pending":
        return orders.filter((ord) => ord.status == "Pending").length;
      case "Shipped":
        return orders.filter((ord) => ord.status == "Shipped").length;
      case "Delivered":
        return orders.filter((ord) => ord.status == "Delivered").length;
      default:
        return orders.length;
    }
  };

  const handleFilterChange = (newFilter) => {
    setSearchParams({ filter: newFilter });
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

  const openInNewTab = (url) => {
    window.open(url, "_blank", "noreferrer");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="lg:col-span-3"
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 2xl:p-8 border border-blue-400 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300">
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

          <span className="ml-auto bg-blue-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
            {orders.length} {orders.length === 1 ? "order" : "orders"}
          </span>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 mb-4">
          {["All", "Pending", "Shipped", "Delivered"].map((status) => (
            <button
              key={status}
              onClick={() => handleFilterChange(status)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 cursor-pointer rounded-lg text-xs sm:text-sm font-semibold border transition-colors duration-300 ${
                filter === status
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-blue-700 border-blue-300 hover:bg-blue-50"
              }`}
            >
              {status}
              <span className="ml-1">({getStatusCount(status)})</span>
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {filteredOrders.slice(0, visibleCount).map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-r from-blue-50/80 to-cyan-50/80 rounded-2xl p-6 border border-blue-200/60 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="grid grid-cols-1 lg:grid-cols-8 xl:grid-cols-4 2xl:grid-cols-4 gap-6">
                <div className="flex items-center space-x-4 lg:col-span-4 xl:col-span-2 2xl:col-span-2">
                  {order.product.image ? (
                    <div
                      onClick={() =>
                        openInNewTab(`/product/${order.product.id}`)
                      }
                      className="w-22 h-22 cursor-pointer border-2 bg-white border-blue-400 rounded-lg flex items-center justify-center mb-4 sm:mb-0 relative overflow-hidden p-1"
                    >
                      <img
                        src={order.product.image}
                        alt=""
                        className="max-w-full max-h-full object-contain rounded-md"
                      />
                    </div>
                  ) : (
                    <div className="w-22 h-22 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FiBox className="text-blue-600" size={30} />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-blue-900 text-lg mb-1">
                      {order.product.name}
                    </h3>
                    <p className="text-blue-600 text-sm">
                      Sold by: {order.storekeeper}
                    </p>
                    <p className="text-blue-800 font-bold text-sm mt-1 flex items-center gap-2">
                      ${order.total_price}
                      <span className="text-xs text-blue-500 bg-blue-100 px-2 py-0.5 rounded-full">
                        x{order.quantity}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-center space-y-2 lg:col-span-2 xl:col-span-1">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.status)}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="text-sm text-blue-600">
                    {order.status === "Delivered" ? (
                      <span>Delivered on {order.delivered_at}</span>
                    ) : (
                      <span>
                        Est. delivery:{" "}
                        {new Date(
                          new Date(order.storekeeper_delivered_at).getTime() +
                            7 * 24 * 60 * 60 * 1000
                        ).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-blue-500">
                    Ordered: {order.paid_at}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-col 2xl:flex-row gap-2 justify-center items-start lg:items-end xl:items-center lg:col-span-2 xl:col-span-1">
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
                    className="flex cursor-pointer items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-colors duration-300 text-sm font-semibold whitespace-nowrap min-w-[120px]"
                  >
                    <FiMessageSquare className="mr-2" size={14} />
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
                      className="flex cursor-pointer items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 text-sm font-semibold whitespace-nowrap min-w-[120px]"
                    >
                      <FiCheckCircle className="mr-2 mb-0.5" size={14} />
                      Received
                    </button>
                  )}

                  {order.status === "Delivered" &&
                    (order.hasRated ? (
                      <button
                        disabled
                        className="flex items-center justify-center 2xl:mr-2 px-4 py-2 bg-gray-200 text-gray-600 rounded-lg cursor-not-allowed text-sm font-semibold whitespace-nowrap min-w-[120px]"
                      >
                        <FiStar className="mr-1.5 mb-0.5" size={16} />
                        Rated
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedProduct(order.product);
                          setSelectedSeller(order.product.storekeeper);
                          setIsReviewOpen(true);
                        }}
                        className="flex cursor-pointer items-center justify-center px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition-colors duration-300 text-sm font-semibold whitespace-nowrap min-w-[120px]"
                      >
                        <FiStar className="mr-2 mb-0.5" size={16} />
                        Rate
                      </button>
                    ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-blue-200/50">
                <div className="flex items-center justify-between text-xs text-blue-600 mb-2">
                  <span>Order Progress</span>
                  <span>{order.status}</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      order.status === "Pending"
                        ? "bg-amber-500 w-1/3"
                        : order.status === "Shipped"
                        ? "bg-blue-500 w-2/3"
                        : "bg-green-500 w-full"
                    }`}
                  />
                </div>
              </div>
            </motion.div>
          ))}

          {filteredOrders.length > 4 && (
            <div className="flex justify-center pt-3 xs:pt-4 mt-4 xs:mt-5 border-t border-blue-300">
              {visibleCount < filteredOrders.length ? (
                <button
                  onClick={() =>
                    setVisibleCount(() => {
                      return visibleCount + 4;
                    })
                  }
                  className="px-4 xs:px-6 py-2 cursor-pointer rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 text-sm xs:text-base font-medium"
                >
                  Show more questions
                </button>
              ) : (
                <button
                  onClick={() => setVisibleCount(4)}
                  className="px-4 xs:px-6 py-2 cursor-pointer rounded-lg border border-blue-400 text-blue-600 hover:bg-blue-50 transition-colors duration-300 text-sm xs:text-base font-medium"
                >
                  Show less
                </button>
              )}
            </div>
          )}
        </div>

        {isReviewOpen && (
          <ReviewModal
            onClose={() => setIsReviewOpen(false)}
            product={selectedProduct}
            seller={selectedSeller}
            setReloadComponent={setReloadComponent}
          />
        )}

        {isLoading ? (
          <SectionLoader chatLoader={false} title="Orders" />
        ) : (
          filteredOrders.length === 0 && (
            <div className="text-center py-12 bg-blue-50/50 rounded-2xl border border-blue-200">
              <FiFileText className="text-blue-400 mx-auto mb-4" size={48} />
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                No orders yet
              </h3>
              <p className="text-blue-600">
                Your orders will appear here once you make a purchase.
              </p>
            </div>
          )
        )}
      </div>
    </motion.div>
  );
};

export default Orders;
