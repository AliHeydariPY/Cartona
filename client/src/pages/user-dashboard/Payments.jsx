import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiDollarSign,
  FiMapPin,
  FiCreditCard,
} from "react-icons/fi";
import { getPayments } from "../../services/cartAPIServices";
import { getProduct } from "../../services/productAPIServices";

const Payments = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      const productPaymentsRes = await getPayments(``);
      const productPayments = await Promise.all(
        productPaymentsRes.data.map(async (productPayment) => {
          const product = await getProduct(productPayment.product);
          if (
            product.data.storekeeper == localStorage.getItem("storekeeperID")
          ) {
            return { ...productPayment, product: product.data };
          } else {
            return null;
          }
        })
      );
      console.log(productPayments.filter(Boolean));
      setPayments(productPayments.filter(Boolean));
    };
    fetchPayments();
  }, []);
  // const payments = [
  //   {
  //     id: 6,
  //     paid_at: "2025-08-31 13:30:44",
  //     delivered_at: null,
  //     quantity: 1,
  //     total_price: 32,
  //     cart: 3,
  //     product: {
  //       id: 5,
  //       image:
  //         "http://127.0.0.1:8000/media/products/2025/08/31/Screenshot_2025-05-14_221525.png",
  //       name: "Premium Wireless Headphones",
  //       price: "32.00",
  //       discounted_price: "24.64",
  //       discount_percentage: "23.00",
  //       stock_quantity: 233,
  //     },
  //     is_delivered: false,
  //     fake_card_number: "4321 3555 4269 2052",
  //     fake_card_second_password: "392397",
  //     fake_card_cvv: "583",
  //     fake_card_expiry: "02/27",
  //     address: "123 Main Street, Tehran, Iran",
  //     is_successful: true,
  //   },
  //   {
  //     id: 7,
  //     paid_at: "2025-08-30 10:15:22",
  //     delivered_at: "2025-08-31 09:30:00",
  //     quantity: 2,
  //     total_price: 89.98,
  //     product: {
  //       id: 8,
  //       image: "http://127.0.0.1:8000/media/products/2025/08/30/product2.jpg",
  //       name: "Smart Watch Series 7",
  //       price: "44.99",
  //       discounted_price: null,
  //       discount_percentage: null,
  //       stock_quantity: 45,
  //     },
  //     is_delivered: true,
  //     fake_card_number: "5567 8901 2345 6789",
  //     fake_card_second_password: "123456",
  //     fake_card_cvv: "321",
  //     fake_card_expiry: "12/26",
  //     address: "456 Oak Avenue, Isfahan, Iran",
  //     is_successful: true,
  //   },
  // ];

  const markAsDelivered = (paymentId) => {
    // منطق علامت گذاری به عنوان تحویل شده
    console.log("Mark as delivered:", paymentId);
  };

  const getStatusBadge = (isDelivered, deliveredAt) => {
    if (isDelivered) {
      return (
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
          <FiCheckCircle className="mr-1" size={14} />
          Delivered {deliveredAt && new Date(deliveredAt).toLocaleDateString()}
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="lg:col-span-3"
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-6 2xl:p-8 border border-blue-400 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300">
        {/* هدر */}
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

          <div className="flex items-center space-x-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {payments.length} orders
            </span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              $
              {payments
                .reduce((total, payment) => total + payment.total_price, 0)
                .toFixed(2)}{" "}
              total
            </span>
          </div>
        </div>

        {/* فیلترها و آمار */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-blue-600 text-sm">Total Revenue</span>
              <FiDollarSign className="text-blue-500" size={18} />
            </div>
            <p className="text-2xl font-bold text-blue-900">
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
              {payments.filter((p) => !p.is_delivered).length}
            </p>
          </div>

          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <span className="text-green-600 text-sm">Delivered</span>
              <FiCheckCircle className="text-green-500" size={18} />
            </div>
            <p className="text-2xl font-bold text-green-900">
              {payments.filter((p) => p.is_delivered).length}
            </p>
          </div>

          {/* <div className="bg-cyan-50 rounded-xl p-4 border border-cyan-200">
            <div className="flex items-center justify-between">
              <span className="text-cyan-600 text-sm">Avg. Order</span>
              <FiCreditCard className="text-cyan-500" size={18} />
            </div>
            <p className="text-2xl font-bold text-cyan-900">
              $
              {(
                payments.reduce(
                  (total, payment) => total + payment.total_price,
                  0
                ) / payments.length || 0
              ).toFixed(2)}
            </p>
          </div> */}
        </div>

        {/* لیست پرداخت‌ها */}
        <div className="space-y-4">
          {payments.length === 0 ? (
            <div className="text-center py-12 bg-blue-50/50 rounded-2xl border border-blue-200">
              <FiDollarSign className="text-blue-400 mx-auto mb-4" size={48} />
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                No payments yet
              </h3>
              <p className="text-blue-600">
                Customer payments will appear here
              </p>
            </div>
          ) : (
            payments.map((payment) => (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-r from-blue-50/80 to-cyan-50/80 rounded-2xl p-6 border border-blue-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* اطلاعات محصول */}
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img
                        src={payment.product.image}
                        alt={payment.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900 text-lg mb-1">
                        {payment.product.name}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-blue-800 font-bold">
                          $
                          {payment.product.discounted_price ||
                            payment.product.price}
                        </span>
                        {payment.product.discounted_price && (
                          <span className="text-sm text-rose-500 line-through">
                            ${payment.product.price}
                          </span>
                        )}
                        {payment.product.discount_percentage && (
                          <span className="text-xs bg-gradient-to-r from-rose-500 to-pink-500 text-white px-2 py-0.5 rounded-full">
                            -{payment.product.discount_percentage}%
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-blue-600">
                        Qty: {payment.quantity}
                      </p>
                    </div>
                  </div>

                  {/* اطلاعات پرداخت */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-700 font-medium">Total:</span>
                      <span className="text-lg font-bold text-blue-900">
                        ${payment.total_price.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <FiCreditCard className="text-blue-500" size={16} />
                      <span className="text-sm text-blue-600">
                        {formatCardNumber(payment.fake_card_number)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <FiMapPin className="text-blue-500" size={16} />
                      <span className="text-sm text-blue-600 truncate max-w-[200px]">
                        {payment.address}
                      </span>
                    </div>

                    <p className="text-xs text-blue-500">
                      Paid: {new Date(payment.paid_at).toLocaleDateString()} •
                      {new Date(payment.paid_at).toLocaleTimeString()}
                    </p>
                  </div>

                  {/* وضعیت و اقدامات */}
                  <div className="flex flex-col justify-between">
                    <div className="mb-4">
                      {getStatusBadge(
                        payment.is_delivered,
                        payment.delivered_at
                      )}
                    </div>

                    {!payment.is_delivered && (
                      <button
                        onClick={() => markAsDelivered(payment.id)}
                        className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-600 transition-all duration-300 font-semibold flex items-center justify-center"
                      >
                        <FiTruck className="mr-2" size={16} />
                        Mark as Delivered
                      </button>
                    )}

                    {payment.is_delivered && (
                      <div className="text-xs text-green-600">
                        Delivered on{" "}
                        {new Date(payment.delivered_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>

                {/* اطلاعات کارت (برای نمایش بیشتر) */}
                <div className="mt-4 pt-4 border-t border-blue-200 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-blue-600">
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
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Payments;
