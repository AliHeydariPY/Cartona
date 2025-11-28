import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiDollarSign,
  FiMapPin,
  FiTrendingUp,
  FiMessageSquare,
  FiBox,
} from "react-icons/fi";
import { getProduct } from "../../services/productAPIServices";
import SendNotePopup from "../../components/pop-ups/SendNotePopup";
import {
  getStorekeeperPayments,
  productSubmission,
} from "../../services/userAPIServices";
import { errorToast, successToast } from "../../utils/toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getPurchaseByPayment } from "../../services/commentAPIServices";
import { SectionLoader } from "../../components/SectionLoader";

const Payments = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [showSendNotePopup, setShowSendNotePopup] = useState(false);
  const [payload, setPayload] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [visibleCount, setVisibleCount] = useState(3);

  const [isLoading, setIsLoading] = useState(true);

  const filter = searchParams.get("filter") || "All";

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const productPaymentsRes = await getStorekeeperPayments();

        const productPayments = await Promise.all(
          productPaymentsRes.data.map(async (productPayment) => {
            try {
              const product = await getProduct(productPayment.product);
              return {
                ...productPayment,
                product: product?.data ?? null,
              };
            } catch {
              console.log({ ...productPayment });
              return {
                ...productPayment,
                product: null,
              };
            }
          })
        );
        setIsLoading(false);
        setPayments(productPayments.filter(Boolean));
      } catch {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handleFilterChange = (status) => {
    if (status === "All") {
      searchParams.delete("filter");
    } else {
      searchParams.set("filter", status);
    }
    setSearchParams(searchParams);
  };

  const getFilteredPayments = () => {
    switch (filter) {
      case "Pending":
        return payments.filter(
          (p) => !p.storekeeper_delivery && !p.buyer_delivery
        );
      case "Shipped":
        return payments.filter(
          (p) => p.storekeeper_delivery && !p.buyer_delivery
        );
      case "Delivered":
        return payments.filter(
          (p) => p.storekeeper_delivery && p.buyer_delivery
        );
      default:
        return payments;
    }
  };

  const filteredPayments = getFilteredPayments();

  const getStatusBadge = (payment) => {
    if (payment.buyer_delivery) {
      return (
        <span className="bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center">
          <FiCheckCircle className="mr-1 mb-0.5 flex-shrink-0" size={12} />
          <span className="truncate">
            Delivered{" "}
            {payment.buyer_delivered_at &&
              new Date(payment.buyer_delivered_at).toLocaleDateString()}
          </span>
        </span>
      );
    }
    if (payment.storekeeper_delivery) {
      return (
        <span className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center">
          <FiTruck className="mr-1 mb-0.5 flex-shrink-0" size={12} />
          <span className="truncate">
            Shipped{" "}
            {payment.storekeeper_delivered_at &&
              new Date(payment.storekeeper_delivered_at).toLocaleDateString()}
          </span>
        </span>
      );
    }
    return (
      <span className="bg-amber-100 text-amber-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center">
        <FiPackage className="mr-1 mb-0.5 flex-shrink-0" size={12} />
        <span className="truncate">Pending Delivery</span>
      </span>
    );
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

  const openInNewTab = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="lg:col-span-3"
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg p-4 sm:p-6 2xl:p-8 border border-blue-400 hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="mb-2">
            <div className="flex items-center mb-1">
              <FiDollarSign
                className="text-green-500 mr-2 sm:mr-3 flex-shrink-0"
                size={20}
              />
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-800">
                Payments
              </h1>
            </div>
            <p className="text-blue-700 text-xs sm:text-sm ml-7 sm:ml-9">
              Manage customer payments and deliveries
            </p>
          </div>
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium self-start xs:self-auto">
            {filteredPayments.length} {filter.toLowerCase()} orders
          </span>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
          {["All", "Pending", "Shipped", "Delivered"].map((status) => (
            <button
              key={status}
              onClick={() => handleFilterChange(status)}
              className={`px-3 py-1.5 sm:py-2 cursor-pointer rounded-lg text-xs sm:text-sm font-semibold border transition-colors duration-300 flex-1 sm:flex-none min-w-[60px] text-center ${
                filter === status
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-blue-700 border-blue-300 hover:bg-blue-50"
              }`}
            >
              <span className="hidden sm:inline">{status}</span>
              <span className="sm:hidden">{status.charAt(0)}</span>
              <span className="ml-1">({getStatusCount(status)})</span>
            </button>
          ))}
        </div>

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
              <span className="text-amber-600 text-xs sm:text-sm">Pending</span>
              <FiPackage className="text-amber-500 flex-shrink-0" size={16} />
            </div>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-900 mt-1">
              {
                payments.filter(
                  (p) => !p.storekeeper_delivery && !p.buyer_delivery
                ).length
              }
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-blue-600 text-xs sm:text-sm">Shipped</span>
              <FiTruck className="text-blue-500 flex-shrink-0" size={16} />
            </div>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900 mt-1">
              {
                payments.filter(
                  (p) => p.storekeeper_delivery && !p.buyer_delivery
                ).length
              }
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
              {
                payments.filter(
                  (p) => p.storekeeper_delivery && p.buyer_delivery
                ).length
              }
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <SectionLoader chatLoader={false} title="Payments" />
          ) : (
            filteredPayments.length === 0 && (
              <div className="text-center py-8 sm:py-12 bg-blue-50/50 rounded-xl sm:rounded-2xl border border-blue-200">
                <FiDollarSign
                  className="text-blue-400 mx-auto mb-3 sm:mb-4"
                  size={32}
                />
                <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-2">
                  No {filter.toLowerCase()} payments yet
                </h3>
                <p className="text-blue-600 text-sm">
                  {filter === "All"
                    ? "Customer payments will appear here"
                    : `No ${filter.toLowerCase()} payments found`}
                </p>
              </div>
            )
          )}

          {filteredPayments.slice(0, visibleCount).map((payment) => (
            <motion.div
              key={payment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-r from-blue-50/80 to-cyan-50/80 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 sm:gap-6">
                <div className="flex items-center col-span-3 space-x-3 sm:space-x-4">
                  {payment.product?.image ? (
                    <div
                      onClick={() => {
                        if (payment.product?.id) {
                          openInNewTab(`/product/${payment.product.id}`);
                        } else {
                          errorToast("This product does not exist");
                        }
                      }}
                      className="w-16 h-16 sm:w-20 sm:h-20 cursor-pointer border-2 bg-white border-blue-400 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-1"
                    >
                      <img
                        src={payment.product?.image}
                        alt=""
                        className="w-full h-full object-contain rounded-md"
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() => errorToast("This product does not exist")}
                      className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0"
                    >
                      <FiBox className="text-blue-600" size={28} />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-blue-900 text-base sm:text-lg mb-1 truncate">
                      {payment.product_name}
                    </h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-blue-800 font-bold text-sm sm:text-base">
                        $
                        {payment.product?.discounted_price ||
                          payment.product?.price ||
                          payment.total_price / payment.quantity}
                      </span>
                      {payment.product?.discounted_price && (
                        <span className="text-xs sm:text-sm text-rose-500 line-through">
                          ${payment.product?.price}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-blue-600 mb-2">
                      Qty: {payment.quantity}
                    </p>
                  </div>
                </div>

                <div className="h-full flex items-center col-span-2">
                  <div className=" space-y-2 ">
                    <div className="flex items-center">
                      <span className="text-blue-700 font-medium text-sm sm:text-base">
                        Total:
                      </span>
                      <span className="font-bold text-blue-900 text-sm sm:text-base ml-2">
                        ${payment.total_price.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-start space-x-2">
                      <FiMapPin
                        className="text-blue-500 flex-shrink-0 mt-0.5"
                        size={14}
                      />
                      <span className="text-xs sm:text-sm text-blue-600 whitespace-normal break-words">
                        {payment.address}
                      </span>
                    </div>

                    <p className="text-xs text-blue-500">
                      Paid: {new Date(payment.paid_at).toLocaleDateString()} •
                      {new Date(payment.paid_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-between col-span-2 space-y-3 sm:space-y-4">
                  <div>{getStatusBadge(payment)}</div>
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
                    className="flex cursor-pointer items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-colors duration-300 text-sm font-semibold whitespace-nowrap min-w-[120px]"
                  >
                    <FiMessageSquare className="mr-2 mb-0.5" size={14} />
                    Chat
                  </button>
                  {!payment.buyer_delivery && !payment.storekeeper_delivery && (
                    <button
                      onClick={() => {
                        setShowSendNotePopup(true);
                        const now = new Date().toISOString();
                        setPayload(() => {
                          return {
                            payment: payment.id,
                            is_shipped: true,
                            shipped_at: now,
                            note: "",
                          };
                        });
                      }}
                      className="bg-green-500 cursor-pointer  text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300 font-semibold flex items-center justify-center text-xs sm:text-sm"
                    >
                      <FiTruck className="mr-2 flex-shrink-0" size={14} />
                      <span className="truncate">Product submission</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {filteredPayments.length > 3 && (
            <div className="flex justify-center pt-3 xs:pt-4 mt-4 xs:mt-5 border-t border-blue-300">
              {visibleCount < filteredPayments.length ? (
                <button
                  onClick={() =>
                    setVisibleCount(() => {
                      return visibleCount + 3;
                    })
                  }
                  className="px-4 xs:px-6 py-2 cursor-pointer rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 text-sm xs:text-base font-medium"
                >
                  Show more payments
                </button>
              ) : (
                <button
                  onClick={() => setVisibleCount(3)}
                  className="px-4 xs:px-6 py-2 cursor-pointer rounded-lg border border-blue-400 text-blue-600 hover:bg-blue-50 transition-colors duration-300 text-sm xs:text-base font-medium"
                >
                  Show less
                </button>
              )}
            </div>
          )}
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
                }).then(() => {
                  successToast("The product status was successfully updated");
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
                });
              }}
              payload={payload}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Payments;
