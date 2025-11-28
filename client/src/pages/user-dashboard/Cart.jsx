import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCartProducts,
  editCartProduct,
  totalCartPayment,
  singleCartPayment,
} from "../../services/cartAPIServices";
import { getProduct } from "../../services/productAPIServices";

import { IoCartOutline } from "react-icons/io5";
import {
  FiTrash2,
  FiHeart,
  FiChevronRight,
  FiPlus,
  FiMinus,
  FiShield,
  FiStar,
} from "react-icons/fi";

import { errorToast, successToast } from "../../utils/toast";
import PaymentAddressPopup from "../../components/pop-ups/PaymentAddressPopup";
import { MdOutlinePayments } from "react-icons/md";
import RemoveProductPopup from "../../components/pop-ups/RemoveProductPopup";
import { SectionLoader } from "../../components/SectionLoader";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showRemovePopup, setShowRemovePopup] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchCartItems = async () => {
      const cartProductsRes = await getCartProducts();
      const productsData = await Promise.all(
        cartProductsRes.data.map(async (item) => {
          const productRes = await getProduct(item.product);
          const productData = productRes.data;

          return {
            ...productData,
            id: item.id,
            product: item.product,
            price: parseFloat(productData.price),
            stock_quantity: item.quantity,
          };
        })
      );

      setIsLoading(false);
      setCartItems(productsData);
    };

    fetchCartItems();
  }, []);

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;

    const item = cartItems.find((p) => p.id === id);
    if (!item) return;

    const payload = {
      id: item.id,
      product: item.product,
      quantity: newQuantity,
      cart: localStorage.getItem("userID"),
    };

    try {
      await editCartProduct(payload);

      setCartItems((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, stock_quantity: newQuantity } : p
        )
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.non_field_errors?.[0] ||
        "You can't have more than 10";
      errorToast(errorMessage);
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum + (item.discounted_price || item.price) * item.stock_quantity,
    0
  );

  // const shipping = 15.0;
  // const tax = subtotal * 0.08;
  // const total = subtotal + shipping + tax;

  const total = subtotal;

  const handlePayment = (address) => {
    setIsProcessingPayment(true);
    if (selectedProduct) {
      const payload = {
        cart_item: selectedProduct.id,
        address: address,
        is_successful: true,
      };
      singleCartPayment(payload)
        .then(() => {
          setCartItems(() =>
            cartItems.filter((item) => item.id != selectedProduct.id)
          );
          setIsProcessingPayment(false);
          setShowPaymentPopup(false);
          successToast("Payment was successful");
          setSelectedProduct(null);
        })
        .catch(() => {
          errorToast();
        });
    } else {
      totalCartPayment({
        address: address,
        is_successful: true,
      })
        .then(() => {
          setIsProcessingPayment(false);
          setShowPaymentPopup(false);
          setCartItems([]);
          successToast("Payment was successful");
        })
        .catch(() => {
          errorToast();
        });
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
      <div className="bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg p-4 sm:p-5 lg:p-6 2xl:p-8 border border-blue-400 hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
          <div className="flex items-center">
            <IoCartOutline
              className="text-blue-600 mr-2 sm:mr-3 mb-0.5"
              size={22}
            />
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-800">
              Shopping Cart
            </h1>
          </div>
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium self-start xs:self-auto">
            {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          <div className="space-y-4 sm:space-y-6">
            {isLoading ? (
              <SectionLoader chatLoader={true} title="Cart Items" />
            ) : (
              cartItems.length === 0 && (
                <div className="text-center py-8 sm:py-12 bg-blue-50/50 rounded-xl sm:rounded-2xl border border-blue-200">
                  <IoCartOutline
                    className="text-blue-400 mx-auto mb-3 sm:mb-4"
                    size={34}
                  />
                  <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-blue-600 text-sm sm:text-base mb-4 sm:mb-6">
                    Start shopping to add items to your cart
                  </p>
                  <button
                    onClick={() => navigate("/")}
                    className="bg-gradient-to-r cursor-pointer from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-colors duration-300 text-sm sm:text-base font-medium"
                  >
                    Continue Shopping
                  </button>
                </div>
              )
            )}
            {cartItems.length > 0 && (
              <div className="bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-200">
                {cartItems.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col sm:flex-row border-b border-blue-100 last:border-0 pb-4 sm:pb-6 mb-4 sm:mb-6 last:mb-0 group"
                  >
                    <div
                      onClick={() =>
                        openInNewTab(`/product/${product.product}`)
                      }
                      className="w-full sm:w-28 lg:w-32 h-28 lg:h-32 cursor-pointer rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-0 relative overflow-hidden p-1 bg-white border border-blue-200"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain rounded-md"
                      />
                    </div>

                    <div className="flex-1 sm:ml-4 lg:ml-6 space-y-2 sm:space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-base sm:text-lg text-blue-900 mb-1 truncate">
                            {product.name}
                          </h3>

                          <div className="flex items-center flex-wrap gap-1 sm:gap-2 mb-1 sm:mb-2">
                            <span className="text-lg sm:text-xl font-bold text-blue-800">
                              ${product.discounted_price || product.price}
                            </span>
                            {product.discounted_price && (
                              <>
                                <span className="text-xs sm:text-sm text-rose-500 line-through">
                                  ${product.price}
                                </span>
                                {product.discount_percentage && (
                                  <span className="text-xs bg-gradient-to-r from-rose-500 to-pink-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                                    {product.discount_percentage}% OFF
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => {
                              setShowPaymentPopup(true);
                              setSelectedProduct(product);
                            }}
                            className="p-1.5 sm:p-2 text-green-500 cursor-pointer hover:bg-green-100 rounded-lg transition-colors duration-200"
                            title="Quick Buy"
                          >
                            <MdOutlinePayments
                              size={18}
                              className="sm:size-[22px]"
                            />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowRemovePopup(true);
                            }}
                            className="p-1.5 sm:p-2 text-rose-500 cursor-pointer hover:bg-rose-100 rounded-lg transition-colors duration-200"
                            title="Remove Item"
                          >
                            <FiTrash2 size={16} className="sm:size-[20px]" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex items-center bg-blue-100 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                          <FiStar
                            className="text-amber-400 fill-amber-400 mr-1"
                            size={12}
                          />
                          <span className="text-xs sm:text-sm font-medium text-blue-800">
                            {product.average_rating?.toFixed(1) || "0.0"}
                          </span>
                        </div>
                        <span className="text-xs sm:text-sm text-blue-600">
                          ({product.comment_count || 0} reviews)
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-blue-700">
                        <span className="font-medium">Stock:</span>{" "}
                        {product.stock_quantity}
                      </p>

                      {product.color && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm text-blue-800 font-medium">
                            Color:
                          </span>
                          <div
                            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-blue-300"
                            style={{ backgroundColor: product.color }}
                            title={product.color}
                          />
                        </div>
                      )}

                      <div className="flex sm:items-center justify-between gap-3 pt-2 sm:pt-3">
                        <div className="flex items-center justify-between bg-blue-100 rounded-lg p-1">
                          <button
                            onClick={() =>
                              updateQuantity(
                                product.id,
                                Math.max(1, product.stock_quantity - 1)
                              )
                            }
                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white rounded-lg text-blue-700 hover:bg-blue-200 transition-colors duration-200"
                            disabled={product.stock_quantity <= 1}
                          >
                            <FiMinus size={14} />
                          </button>
                          <span className="mx-2 sm:mx-4 font-bold text-base sm:text-lg text-blue-900 min-w-[25px] sm:min-w-[30px] text-center">
                            {product.stock_quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                product.id,
                                product.stock_quantity + 1
                              )
                            }
                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white rounded-lg text-blue-700 hover:bg-blue-200 transition-colors duration-200"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-xs sm:text-sm text-gray-500">
                            Subtotal
                          </p>
                          <p className="text-base sm:text-lg font-bold text-blue-800">
                            $
                            {(
                              (product.discounted_price || product.price) *
                              product.stock_quantity
                            ).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-blue-200 lg:sticky lg:top-6">
              <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-4 sm:mb-6 flex items-center">
                <IoCartOutline className="mr-2" size={20} />
                Order Summary
              </h3>

              <div className="space-y-3 sm:space-y-4">
                <div className="border-t border-blue-200 pt-3 sm:pt-4 flex justify-between">
                  <span className="text-base sm:text-lg font-bold text-blue-900">
                    Total
                  </span>
                  <span className="text-base sm:text-lg font-bold text-blue-900">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setShowPaymentPopup(true);
                  }}
                  className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-2.5 sm:py-3 rounded-lg font-semibold mt-4 sm:mt-6 hover:shadow-lg transition-all duration-300 flex items-center justify-center text-sm sm:text-base"
                >
                  Proceed to Checkout
                  <FiChevronRight className="ml-1 sm:ml-2" size={16} />
                </button>

                <button className="w-full cursor-pointer bg-white border border-blue-300 text-blue-700 py-2.5 sm:py-3 rounded-lg font-medium mt-2 sm:mt-3 hover:bg-blue-50 transition-colors duration-300 flex items-center justify-center text-sm sm:text-base">
                  <FiHeart className="mr-2 text-rose-500" size={16} />
                  Save for Later
                </button>

                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50/50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-sm sm:text-base text-blue-800 mb-1 sm:mb-2 flex items-center">
                    <FiShield className="text-green-500 mr-2" size={16} />
                    Secure Checkout
                  </h4>
                  <p className="text-xs sm:text-sm text-blue-600">
                    All transactions are encrypted and secure
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showRemovePopup && (
        <RemoveProductPopup
          onClose={() => {
            setSelectedProduct(null);
            setShowRemovePopup(false);
          }}
          product={selectedProduct}
          onSuccess={() =>
            setCartItems(() =>
              cartItems.filter((item) => item.id != selectedProduct.id)
            )
          }
          isRemoveCartItem={true}
        />
      )}

      {showPaymentPopup && (
        <PaymentAddressPopup
          onClose={() => {
            setShowPaymentPopup(false);
            setSelectedProduct(null);
          }}
          onConfirm={handlePayment}
          cartItems={cartItems}
          singleProduct={selectedProduct}
          isProcessing={isProcessingPayment}
        />
      )}
    </motion.div>
  );
};

export default Cart;
