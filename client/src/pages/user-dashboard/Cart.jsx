import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import {
  getCartProducts,
  editCartProduct,
} from "../../services/cartAPIServices";
import { getProduct } from "../../services/productAPIServices";

import toast from "react-hot-toast";

import {
  FiShoppingCart,
  FiTrash2,
  FiHeart,
  FiChevronRight,
  FiPlus,
  FiMinus,
  FiShield,
  FiX,
  FiStar,
} from "react-icons/fi";

const Cart = ({
  setRremoveFromCartPopup,
  setSelectedProduct,
  reloadComponent,
  setIsRemoveCartItem,
}) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      const cartProductsRes = await getCartProducts(
        localStorage.getItem("userID")
      );
      const productsData = await Promise.all(
        cartProductsRes.data.items.map(async (item) => {
          const productRes = await getProduct(item.product);
          const productData = productRes.data;
          console.log(productRes.data);

          return {
            ...productData,
            id: item.id,
            product: item.product,
            price: parseFloat(productData.price),
            stock_quantity: item.quantity,
          };
        })
      );

      setCartItems(productsData);
    };

    fetchCartItems();
  }, [reloadComponent]);

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
      // منتظر بمان تا ریکوئست بره و جواب بیاد
      await editCartProduct(payload);

      // فقط وقتی موفق بود مقدار رو تغییر بده
      setCartItems((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, stock_quantity: newQuantity } : p
        )
      );
    } catch (error) {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-4 rounded-xl shadow-lg border border-white/20 backdrop-blur-md flex items-center space-x-3 rtl:space-x-reverse`}
          style={{ fontFamily: "Roboto" }}
        >
          <FiX className="text-xl shrink-0" />
          <span className="font-medium">
            {error.response?.data?.non_field_errors?.[0] ||
              "You can't have more than 10"}
          </span>
        </div>
      ));
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.stock_quantity,
    0
  );

  const shipping = 15.0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

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
                  {cartItems.map((product) => (
                    <div
                      key={product.id}
                      className="flex flex-col sm:flex-row border-b border-blue-100 last:border-0 pb-6 mb-6 last:mb-0 group"
                    >
                      {/* تصویر محصول */}
                      <div
                        onClick={() => openInNewTab(`/products/${product.product}`)}
                        className="w-full sm:w-35 h-35 cursor-pointer rounded-xl flex items-center justify-center mb-4 sm:mb-0 relative overflow-hidden p-1"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="max-w-full max-h-full object-contain rounded-md"
                        />
                      </div>

                      {/* اطلاعات کامل محصول */}
                      <div className="flex-1 sm:ml-6 space-y-3">
                        {/* هدر با نام محصول و دکمه حذف */}
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-blue-900 mb-1">
                              {product.name}
                            </h3>

                            {/* قیمت و تخفیف */}
                            <div className="flex items-center flex-wrap gap-2 mb-2">
                              <span className="text-xl font-bold text-blue-800">
                                ${product.discounted_price || product.price}
                              </span>
                              {product.discounted_price && (
                                <>
                                  <span className="text-sm text-rose-500 line-through">
                                    ${product.price}
                                  </span>
                                  {product.discount_percentage && (
                                    <span className="text-xs bg-gradient-to-r from-rose-500 to-pink-500 text-white px-2 py-1 rounded-full">
                                      {product.discount_percentage}% OFF
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setRremoveFromCartPopup(true);
                              setSelectedProduct(product);
                              setIsRemoveCartItem(true);
                            }}
                            className="p-2 text-rose-500 cursor-pointer hover:bg-rose-50 rounded-lg transition-colors duration-200"
                          >
                            <FiTrash2 size={20} />
                          </button>
                        </div>

                        {/* امتیاز و نظرات */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
                            <FiStar
                              className="text-amber-400 fill-amber-400 mr-1"
                              size={14}
                            />
                            <span className="text-sm font-medium text-blue-800">
                              {product.average_rating?.toFixed(1) || "0.0"}
                            </span>
                          </div>
                          <span className="text-sm text-blue-600">
                            ({product.comment_count || 0} reviews)
                          </span>
                        </div>

                        {/* موجودی */}
                        <p className="text-sm text-blue-700">
                          <span className="font-medium">Stock:</span>{" "}
                          {product.stock_quantity}
                        </p>

                        {/* انتخاب رنگ (اگر موجود باشد) */}
                        {product.color && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-blue-800 font-medium">
                              Color:
                            </span>
                            <div
                              className="w-6 h-6 rounded-full border-2 border-blue-300"
                              style={{ backgroundColor: product.color }}
                              title={product.color}
                            />
                          </div>
                        )}

                        {/* کنترل تعداد */}
                        <div className="flex items-center justify-between pt-3">
                          <div className="flex items-center bg-blue-100 rounded-lg p-1">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  product.id,
                                  Math.max(1, product.stock_quantity - 1)
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-blue-700 hover:bg-blue-200 transition-colors duration-200"
                              disabled={product.stock_quantity <= 1}
                            >
                              <FiMinus size={16} />
                            </button>
                            <span className="mx-4 font-bold text-lg text-blue-900 min-w-[30px] text-center">
                              {product.stock_quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  product.id,
                                  product.stock_quantity + 1
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-blue-700 hover:bg-blue-200 transition-colors duration-200"
                            >
                              <FiPlus size={16} />
                            </button>
                          </div>

                          {/* جمع کل برای این محصول */}
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Subtotal</p>
                            <p className="text-lg font-bold text-blue-800">
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
