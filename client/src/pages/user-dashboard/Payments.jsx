import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiDollarSign,
  FiMapPin,
  FiCreditCard,
  FiTrendingUp,
} from "react-icons/fi";
import { getProduct } from "../../services/productAPIServices";
import SendNotePopup from "../../components/pop-ups/SendNotePopup";
import {
  getStorekeeperPayments,
  productSubmission,
} from "../../services/userAPIServices";
import { successToast } from "../../utils/toast";
import { useSearchParams } from "react-router-dom";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [showSendNotePopup, setShowSendNotePopup] = useState(false);
  const [payload, setPayload] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
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
            } catch (error) {
              console.error(error);

              return {
                ...productPayment,
                product: null,
              };
            }
          })
        );
        console.log("🚀 ~ fetchPayments ~ productPayments:", productPayments);

        setPayments(productPayments.filter(Boolean));
      } catch (error) {
        console.error(error);
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
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
          <FiCheckCircle className="mr-1" size={14} />
          Delivered{" "}
          {payment.buyer_delivered_at &&
            new Date(payment.buyer_delivered_at).toLocaleDateString()}
        </span>
      );
    }
    if (payment.storekeeper_delivery) {
      return (
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
          <FiTruck className="mr-1" size={14} />
          Shipped{" "}
          {payment.storekeeper_delivered_at &&
            new Date(payment.storekeeper_delivered_at).toLocaleDateString()}
        </span>
      );
    }
    return (
      <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
        <FiPackage className="mr-1" size={14} />
        Pending Delivery
      </span>
    );
  };

  const formatCardNumber = (cardNumber) => {
    return cardNumber.replace(/(\d{4})/g, "$1 ").trim();
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="lg:col-span-3"
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-6 2xl:p-8 border border-blue-400 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300">
        <div className="flex items-center justify-between mb-8">
          <div className="mb-2">
            <div className="flex items-center mb-1 sm:mb-0">
              <FiDollarSign className="text-green-500 mr-3" size={23} />
              <h1 className="text-base sm:text-lg md:text-2xl font-bold text-blue-800">
                Payments
              </h1>
            </div>
            <p className="text-blue-700 text-xs sm:text-sm ml-8 sm:ml-[34px]">
              Manage customer payments and deliveries
            </p>
          </div>

          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {filteredPayments.length} {filter.toLowerCase()} orders
          </span>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 mb-6">
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
              {status} ({getStatusCount(status)})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-2 lg:gap-4 mb-6">
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <span className="text-purple-600 text-sm">Total Revenue</span>
              <FiTrendingUp className="text-purple-500" size={18} />
            </div>
            <p className="text-2xl font-bold text-purple-900">
              $
              {payments
                .reduce((total, payment) => total + payment.total_price, 0)
                .toFixed(2)}
            </p>
          </div>

          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <div className="flex items-center justify-between">
              <span className="text-amber-600 text-sm">Pending Delivery</span>
              <FiPackage className="text-amber-500" size={18} />
            </div>
            <p className="text-2xl font-bold text-amber-900">
              {
                payments.filter(
                  (p) => !p.storekeeper_delivery && !p.buyer_delivery
                ).length
              }
            </p>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-blue-600 text-sm">Shipped</span>
              <FiTruck className="text-blue-500" size={18} />
            </div>
            <p className="text-2xl font-bold text-blue-900">
              {
                payments.filter(
                  (p) => p.storekeeper_delivery && !p.buyer_delivery
                ).length
              }
            </p>
          </div>

          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <span className="text-green-600 text-sm">Delivered</span>
              <FiCheckCircle className="text-green-500" size={18} />
            </div>
            <p className="text-2xl font-bold text-green-900">
              {
                payments.filter(
                  (p) => p.storekeeper_delivery && p.buyer_delivery
                ).length
              }
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {filteredPayments.length === 0 ? (
            <div className="text-center py-12 bg-blue-50/50 rounded-2xl border border-blue-200">
              <FiDollarSign className="text-blue-400 mx-auto mb-4" size={48} />
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                No {filter.toLowerCase()} payments
              </h3>
              <p className="text-blue-600">
                {filter === "All"
                  ? "Customer payments will appear here"
                  : `No ${filter.toLowerCase()} payments found`}
              </p>
            </div>
          ) : (
            filteredPayments.map((payment) => (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-r from-blue-50/80 to-cyan-50/80 rounded-2xl p-6 border border-blue-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img
                        src={payment.product?.image}
                        alt={payment.product?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900 text-lg mb-1">
                        {payment.product?.name}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-blue-800 font-bold">
                          $
                          {payment.product?.discounted_price ||
                            payment.product?.price}
                        </span>
                        {payment.product?.discounted_price && (
                          <span className="text-sm text-rose-500 line-through">
                            ${payment.product?.price}
                          </span>
                        )}
                        {payment.product?.discount_percentage && (
                          <span className="text-xs bg-gradient-to-r from-rose-500 to-pink-500 text-white px-2 py-0.5 rounded-full">
                            -{payment.product?.discount_percentage}%
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-blue-600">
                        Qty: {payment.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center ">
                      <span className="text-blue-700 font-medium">Total:</span>
                      <span className=" font-bold text-blue-900 ml-2">
                        ${payment.total_price.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <FiCreditCard
                        className="text-blue-500 mb-0.5"
                        size={16}
                      />
                      <span className="text-sm text-blue-600">
                        {/* {formatCardNumber(payment.fake_card_number)} */}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <FiMapPin className="text-blue-500 mb-0.5" size={16} />
                      <span className="text-sm text-blue-600 truncate max-w-[200px]">
                        {payment.address}
                      </span>
                    </div>

                    <p className="text-xs text-blue-500">
                      Paid: {new Date(payment.paid_at).toLocaleDateString()} •
                      {new Date(payment.paid_at).toLocaleTimeString()}
                    </p>
                  </div>

                  <div className="flex flex-col justify-between">
                    <div className="mb-4">{getStatusBadge(payment)}</div>

                    {!payment.buyer_delivery &&
                      !payment.storekeeper_delivery && (
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
                          className="bg-gradient-to-r cursor-pointer from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-colors duration-300 font-semibold flex items-center justify-center"
                        >
                          <FiTruck className="mr-2 mb-0.5" size={16} />
                          Product submission
                        </button>
                      )}

                    {payment.is_shipped && !payment.is_delivered && (
                      <button
                        onClick={() => {
                          setShowSendNotePopup(true);
                          const now = new Date().toISOString();
                          setPayload(() => {
                            return {
                              payment: payment.id,
                              is_delivered: true,
                              delivered_at: now,
                              note: "",
                            };
                          });
                        }}
                        className="bg-gradient-to-r cursor-pointer from-green-600 to-emerald-500 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-600 transition-colors duration-300 font-semibold flex items-center justify-center"
                      >
                        <FiCheckCircle className="mr-2 mb-0.5" size={16} />
                        Mark as Delivered
                      </button>
                    )}

                    {payment.is_delivered && (
                      <div className="text-xs text-green-600">
                        Delivered on{" "}
                        {new Date(
                          payment.buyer_delivered_at
                        ).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>

                {/* <div className="mt-4 pt-4 border-t border-blue-200 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-blue-600">
                  <div>
                    <span className="font-medium">Expiry:</span>{" "}
                    {payment.fake_card_expiry}
                  </div>
                  <div>
                    <span className="font-medium">CVV:</span>{" "}
                    {payment.fake_card_cvv}
                  </div>
                  <div>
                    <span className="font-medium">Password:</span>{" "}
                    {payment.fake_card_second_password}
                  </div>
                  <div>
                    <span className="font-medium">Order ID:</span> #{payment.id}
                  </div>
                </div> */}
              </motion.div>
            ))
          )}
          {showSendNotePopup && (
            <SendNotePopup
              onClose={() => setShowSendNotePopup(false)}
              onConfirm={(note) => {
                const date = new Date();
                console.log({
                  ...payload,
                  note,
                  is_sent: true,
                  sent_at: date,
                });
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
