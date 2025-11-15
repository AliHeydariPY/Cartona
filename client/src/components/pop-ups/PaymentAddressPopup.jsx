import { motion, AnimatePresence, number } from "framer-motion";
import { useState, useEffect } from "react";
import { Portal } from "react-portal";
import {
  FiX,
  FiMapPin,
  FiPackage,
  FiCheck,
} from "react-icons/fi";
import { IoCartOutline } from "react-icons/io5";

const PaymentAddressPopup = ({
  onClose,
  onConfirm,
  cartItems = [],
  singleProduct = null,
  isProcessing = false,
}) => {
  const [address, setAddress] = useState("");
  const [show, setShow] = useState(false);
  const [addressError, setAddressError] = useState("");

  useEffect(() => {
    setTimeout(() => setShow(true), 10);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => onClose(), 300);
  };

  const stopPropagation = (e) => e.stopPropagation();

  const handleSubmit = () => {
    if (!address.trim()) {
      setAddressError("Please enter your delivery address");
      return;
    }

    if (address.trim().length < 10) {
      setAddressError("Address must be at least 10 characters long");
      return;
    }

    setAddressError("");
    onConfirm(address.trim());
  };

  const totalItems = singleProduct ? 1 : cartItems.length;
  const totalAmount = singleProduct
    ? singleProduct.discounted_price || singleProduct.price
    : cartItems.reduce(
        (total, item) =>
          total +
          (Number(item.discounted_price) || item.price) * item.stock_quantity,
        0
      );

  return (
    <Portal>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center  sm:p-6 bg-black/40"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden"
              onClick={stopPropagation}
            >
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-4 sm:p-5 lg:p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative z-10 flex justify-between items-center">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="bg-white/25 text-white rounded-full p-1.5 sm:p-2 flex-shrink-0">
                      {singleProduct ? (
                        <FiPackage size={16} className="sm:size-[20px]" />
                      ) : (
                        <IoCartOutline size={16} className="sm:size-[20px]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg lg:text-xl font-bold truncate">
                        {singleProduct
                          ? "Single Product Payment"
                          : "Cart Payment"}
                      </h3>
                      <p className="text-blue-100 text-xs sm:text-sm mt-0.5 truncate">
                        {singleProduct
                          ? "Complete your purchase"
                          : "Complete your order"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-1.5 sm:p-2 cursor-pointer rounded-full hover:bg-white/20 transition-colors duration-200 flex-shrink-0"
                    disabled={isProcessing}
                  >
                    <FiX size={18} className="sm:size-[22px]" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-5 lg:space-y-6">
                <div className="bg-blue-50/50 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <h4 className="font-semibold text-blue-900 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                    <FiCheck className="mr-2 text-green-500" size={14} />
                    Order Summary
                  </h4>

                  {singleProduct ? (
                    <div className="flex items-center gap-2 sm:gap-3">
                      <img
                        src={singleProduct.image}
                        alt={singleProduct.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg border border-blue-200 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-blue-800 truncate">
                          {singleProduct.name}
                        </p>
                        <div className="flex items-center gap-1 sm:gap-2 mt-0.5">
                          <span className="text-xs sm:text-sm font-bold text-blue-900">
                            $
                            {(
                              (Number(singleProduct.discounted_price) ||
                                singleProduct.price) *
                              singleProduct.stock_quantity
                            ).toFixed(2)}
                          </span>
                          {singleProduct.discounted_price && (
                            <span className="text-xs text-rose-500 line-through">
                              $
                              {(
                                singleProduct.price *
                                singleProduct.stock_quantity
                              ).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center mb-1 sm:mb-2">
                        <span className="text-xs sm:text-sm text-blue-700">
                          Items
                        </span>
                        <span className="text-xs sm:text-sm font-medium text-blue-900">
                          {totalItems} product(s)
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-blue-700">
                          Total Amount
                        </span>
                        <span className="text-base sm:text-lg font-bold text-blue-900">
                          ${totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {!singleProduct && cartItems.length > 0 && (
                  <div className="max-h-20 sm:max-h-24 overflow-y-auto space-y-1 sm:space-y-2">
                    {cartItems.slice(0, 2).map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-xs sm:text-sm"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-6 h-6 sm:w-8 sm:h-8 object-cover rounded border border-blue-200 flex-shrink-0"
                        />
                        <span className="text-blue-800 flex-1 truncate text-xs sm:text-sm">
                          {item.name}
                        </span>
                        <span className="text-blue-900 font-medium text-xs sm:text-sm">
                          $
                          {(
                            (Number(item.discounted_price) || item.price) *
                            item.stock_quantity
                          ).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    {cartItems.length > 2 && (
                      <p className="text-xs text-blue-600 text-center">
                        +{cartItems.length - 2} more items
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-2 sm:space-y-3">
                  <label className="flex items-center text-blue-800 font-medium text-xs sm:text-sm">
                    <FiMapPin className="mr-2 mb-0.5 text-cyan-500" size={14} />
                    Delivery Address *
                  </label>
                  <div className="relative">
                    <textarea
                      rows={3}
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (addressError) setAddressError("");
                      }}
                      placeholder="Enter your complete delivery address (street, city, postal code, etc.)"
                      className={`w-full p-2 sm:p-3 resize-none border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-cyan-400 focus:outline-none text-blue-900 transition-all duration-300 placeholder-blue-400/70 text-xs sm:text-sm ${
                        addressError ? "border-red-300" : "border-blue-300"
                      }`}
                      disabled={isProcessing}
                    />
                    {addressError && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2 flex-shrink-0"></span>
                        {addressError}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-blue-600">
                    Please provide detailed address information for accurate
                    delivery
                  </p>
                </div>

                <div className="flex flex-col xs:flex-row-reverse gap-2 sm:gap-3 pt-1 sm:pt-2">
                  <button
                    onClick={handleSubmit}
                    disabled={isProcessing || !address.trim()}
                    className="flex items-center justify-center px-4 sm:px-6 cursor-pointer py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white gap-2 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-sm sm:text-base flex-1 xs:flex-none"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FiCheck size={16} className="sm:size-[18px]" />
                        Confirm Payment
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleClose}
                    disabled={isProcessing}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 cursor-pointer rounded-lg sm:rounded-xl border border-blue-300 text-blue-700 hover:bg-blue-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base flex-1 xs:flex-none"
                  >
                    Cancel
                  </button>
                </div>

                <div className="bg-green-50/50 border border-green-200 rounded-lg p-2 sm:p-3">
                  <p className="text-xs text-green-700 flex items-start">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 mt-1 flex-shrink-0"></span>
                    <span className="text-xs">
                      <strong>Secure Payment:</strong> Your payment information
                      is encrypted and secure. Delivery typically takes 3-5
                      business days.
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
};

export default PaymentAddressPopup;
