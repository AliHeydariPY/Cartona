import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import { getCartProducts } from "../../services/cartAPIServices";
import { getCartProduct } from "../../services/productAPIServices";
import {
  FiShoppingCart,
  FiTrash2,
  FiHeart,
  FiChevronRight,
  FiPlus,
  FiMinus,
  FiZap,
  FiShield,
} from "react-icons/fi";

const Cart = () => {
  // نمونه داده‌های سبد خرید
  const [cartItems, setCartItems] = useState([]);

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = 15.0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  useEffect(() => {
    const fetchCartItems = async () => {
      const cartProductsRes = await getCartProducts();

      const productsData = await Promise.all(
        cartProductsRes.data.map(async (item) => {
          if (item.cart === 1) {
            const productRes = await getCartProduct(item.product);
            const productData = productRes.data;

            return {
              id: productData.id,
              product: item.product,
              name: productData.name,
              price: parseFloat(productData.price),
              quantity: item.quantity,
              image: productData.image,
              color: "black",
            };
          }
          return null; // اگه شرط برقرار نبود
        })
      );

      // حذف null یا undefined
      setCartItems(productsData.filter(Boolean));
    };

    fetchCartItems();
  }, []);

  useEffect(() => {
    console.log(cartItems);
  }, [cartItems]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="lg:col-span-3"
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-6 2xl:p-8 border border-blue-400 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300">
        <div className="max-w-6xl mx-auto">
          {/* هدر صفحه */}
          <div className="sm:flex sm:items-center mb-4.75">
            <div className="flex items-center mb-2 sm:mb-0">
              <FiShoppingCart className="text-blue-600 mr-3" size={22} />
              <h1 className="text-base sm:text-lg md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Your Shopping Cart
              </h1>
            </div>
            <span className="ml-auto bg-blue-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* لیست محصولات */}
            <div className="space-y-6">
              {cartItems.length === 0 ? (
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-200">
                  <h3 className="text-lg sm:text-xl font-bold text-blue-800 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-sm sm:text-base text-blue-600 mb-4">
                    Start shopping to add items to your cart
                  </p>
                  <button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:shadow-lg transition-all duration-300 text-sm sm:text-base">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-200">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row border-b border-blue-100 last:border-0 pb-6 mb-6 last:mb-0 group"
                    >
                      {/* تصویر محصول */}
                      <div className="w-full sm:w-32 h-32  rounded-lg flex items-center justify-center mb-4 sm:mb-0 relative overflow-hidden">
                        {/* <div
                          className={`w-24 h-24 bg-gradient-to-br ${
                            item.image === "headphones"
                              ? "from-blue-300 via-cyan-200 to-white"
                              : item.image === "smartwatch"
                              ? "from-gray-300 via-gray-200 to-white"
                              : "from-white via-gray-100 to-white"
                          } rounded-full shadow-inner`}
                        ></div> */}
                        <img
                          src={item.image}
                          alt=""
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>

                      {/* اطلاعات محصول */}
                      <div className="flex-1 sm:ml-6">
                        <div className="flex justify-between">
                          <h3 className="font-bold text-base sm:text-lg text-blue-900">
                            {item.name}
                          </h3>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-blue-500 cursor-pointer hover:text-rose-500 transition-colors duration-200"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>

                        <p className="text-sm sm:text-base text-blue-600 mt-1">
                          Color: {item.color}
                        </p>
                        <p className="text-base sm:text-lg font-bold text-blue-800 mt-2">
                          ${item.price}
                        </p>

                        <div className="flex items-center mt-4">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-2 cursor-pointer bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-700 transition-colors duration-200"
                          >
                            <FiMinus size={16} />
                          </button>
                          <span className="mx-4 font-medium text-base sm:text-lg text-blue-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-2 cursor-pointer bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-700 transition-colors duration-200"
                            disabled={!item.inStock}
                          >
                            <FiPlus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* خلاصه سبد خرید */}
            {cartItems.length > 0 && (
              <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-blue-200 h-fit sticky top-6">
                <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-6 flex items-center">
                  <FiShoppingCart className="mr-2" />
                  Order Summary
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm sm:text-base text-blue-700">
                      Subtotal
                    </span>
                    <span className="font-medium text-sm sm:text-base text-blue-900">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm sm:text-base text-blue-700">
                      Shipping
                    </span>
                    <span className="font-medium text-sm sm:text-base text-blue-900">
                      ${shipping.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm sm:text-base text-blue-700">
                      Tax (8%)
                    </span>
                    <span className="font-medium text-sm sm:text-base text-blue-900">
                      ${tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-blue-200 pt-4 flex justify-between">
                    <span className="text-base sm:text-lg font-bold text-blue-900">
                      Total
                    </span>
                    <span className="text-base sm:text-lg font-bold text-blue-900">
                      ${total.toFixed(2)}
                    </span>
                  </div>

                  <button className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-2 sm:py-3 rounded-lg font-semibold mt-6 hover:shadow-lg transition-all duration-300 flex items-center justify-center text-sm sm:text-base">
                    Proceed to Checkout
                    <FiChevronRight className="sm:ml-2" />
                  </button>

                  <button className="w-full cursor-pointer bg-white border border-blue-300 text-blue-700 py-2 sm:py-3 rounded-lg font-medium mt-3 hover:bg-blue-50 transition-colors duration-300 flex items-center justify-center text-sm sm:text-base">
                    <FiHeart className="mr-2 text-rose-500" />
                    Save for Later
                  </button>

                  <div className="mt-6 p-4 bg-blue-50/50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-sm sm:text-base text-blue-800 mb-2 flex items-center">
                      <FiShield className="text-green-500 mr-2" />
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
      </div>
    </motion.div>
  );
};

export default Cart;
