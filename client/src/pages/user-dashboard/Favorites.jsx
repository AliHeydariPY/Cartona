import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { FiHeart, FiStar } from "react-icons/fi";

import { FaHeart, FaClock } from "react-icons/fa";
import { IoCart, IoCartOutline } from "react-icons/io5";

import { PiLightningFill } from "react-icons/pi";
import { BiSolidOffer } from "react-icons/bi";

import {
  addToCart,
  deleteCartProduct,
  deleteFavorite,
  getCartProducts,
  getFavorites,
} from "../../services/cartAPIServices";
import { getProduct } from "../../services/productAPIServices";
import { errorToast } from "../../utils/toast";

const Favorites = ({ setAddToCartPopup, setSelectedProduct }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const favoriteProductsRes = await getFavorites();
      const cartProductsRes = await getCartProducts();

      const favoriteProducts = await Promise.all(
        favoriteProductsRes.data.map(async (favorite) => {
          const productRes = await getProduct(favorite.product);
          const hasCart = cartProductsRes.data.find((cartProduct) => {
            return cartProduct.product == productRes.data.id;
          });

          return { ...favorite, product: productRes.data, cartItem: hasCart };
        })
      );

      setFavorites(favoriteProducts.filter(Boolean));
    };
    fetchData();
  }, []);

  const handleAddToCart = async (selectedProduct) => {
    try {
      setSelectedProduct(selectedProduct);
      const response = await addToCart({
        product: selectedProduct.id,
        quantity: 1,
      });
      setAddToCartPopup(true);
      setFavorites(() =>
        favorites.map((item) => {
          if (item.product.id == selectedProduct.id) {
            return { ...item, cartItem: response.data };
          } else {
            return { ...item };
          }
        })
      );
    } catch {
      errorToast("Failed to add product to cart");
    }
  };

  const handleRemoveFromCart = async (favProduct) => {
    try {
      await deleteCartProduct(favProduct.cartItem.id);
      setFavorites(() =>
        favorites.map((item) => {
          if (item.id == favProduct.id) {
            return { ...item, cartItem: null };
          } else {
            return item;
          }
        })
      );
    } catch {
      errorToast("Failed to remove product from cart");
    }
  };

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      await deleteFavorite(favoriteId);
      setFavorites((prev) => prev.filter((item) => item.id != favoriteId));
      errorToast("Removed from favorites");
    } catch {
      errorToast("Failed to remove from favorites");
    }
  };

  const openInNewTab = (url) => {
    window.open(url, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="lg:col-span-3"
    >
      <div className="space-y-4 sm:space-y-7 lg:space-y-5 xl:space-y-9">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 2xl:p-8 border border-blue-400 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300">
          <div className="flex justify-between flex-wrap items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-blue-800 flex items-center">
              <FiHeart className="mr-3 text-rose-500 fill-current" size={22} />
              Favorites
            </h2>
            <span className="ml-auto bg-blue-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              {favorites.length} {favorites.length === 1 ? "Item" : "Items"}
            </span>
          </div>

          {favorites.length === 0 ? (
            <div className="text-center py-12 bg-blue-50/50 rounded-2xl border border-blue-200">
              <FiHeart className="text-blue-400 mx-auto mb-4" size={48} />
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                No favorites yet
              </h3>
              <p className="text-blue-600">
                Your favorite products will appear here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {favorites.map((fav) => {
                const product = fav.product;

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className={` group relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl border border-blue-200/50 hover:border-blue-300 transition-all duration-300 overflow-hidden`}
                  >
                    <div className="relative overflow-hidden">
                      <div
                        onClick={() => {
                          if (window.innerWidth <= 1024) {
                            openInNewTab(`/product/${product.id}`);
                          }
                        }}
                        className={`${
                          window.innerWidth <= 1024 && "cursor-pointer"
                        } w-full h-80 flex items-center justify-center border-b-1 border-blue-300 mb-0 relative overflow-hidden p-7`}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105 rounded-lg"
                        />
                      </div>

                      {product.amazing_offer && (
                        <div className="absolute flex top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                          <PiLightningFill
                            className="mt-0.25 mr-0.75"
                            size={13}
                          />
                          {product.amazing_offer}
                        </div>
                      )}

                      {window.innerWidth > 1024 && (
                        <>
                          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                              onClick={() => handleRemoveFavorite(fav.id)}
                              className="p-2 cursor-pointer bg-rose-100 rounded-full hover:bg-rose-200 transition-colors duration-300"
                            >
                              <FaHeart className="text-rose-500 " size={16} />
                            </button>

                            {fav.cartItem ? (
                              <button
                                onClick={() => handleRemoveFromCart(fav)}
                                className="px-1.5 py-1.5 cursor-pointer bg-blue-100 rounded-full hover:bg-blue-200 transition-colors duration-300"
                              >
                                <IoCart className="text-blue-600 " size={20} />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleAddToCart(product)}
                                className="px-1.5 py-1.5 cursor-pointer bg-blue-100 rounded-full hover:bg-blue-200 transition-colors duration-300"
                              >
                                <IoCartOutline
                                  className="text-blue-600"
                                  size={20}
                                />
                              </button>
                            )}
                          </div>
                          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                            <button
                              onClick={() =>
                                openInNewTab(`/product/${product.id}`)
                              }
                              className="bg-white cursor-pointer px-6 py-2 rounded-full shadow-md shadow-blue-100 hover:bg-blue-500 hover:text-white transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100"
                            >
                              Quick View
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="p-4 space-y-3">
                      <div className="flex justify-between">
                        <h3 className="font-bold text-blue-900 text-lg line-clamp-2 mb-1">
                          {product.name}
                        </h3>
                        {window.innerWidth <= 1024 && (
                          <div className="flex gap-2  duration-300">
                            <button
                              onClick={() => handleRemoveFavorite(fav.id)}
                              className="p-2 cursor-pointer bg-rose-100 rounded-full hover:bg-rose-200 transition-colors duration-300"
                            >
                              <FaHeart className="text-rose-500 " size={16} />
                            </button>

                            {fav.cartItem ? (
                              <button
                                onClick={() => handleRemoveFromCart(fav)}
                                className="px-1.5 cursor-pointer bg-blue-100 rounded-full hover:bg-blue-200 transition-colors duration-300"
                              >
                                <IoCart className="text-blue-600 " size={20} />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleAddToCart(product)}
                                className="px-1.5 cursor-pointer bg-blue-100 rounded-full hover:bg-blue-200 transition-colors duration-300"
                              >
                                <IoCartOutline
                                  className="text-blue-600"
                                  size={20}
                                />
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center w-full justify-between gap-2 flex-wrap">
                        <div className="flex-wrap">
                          <span className="text-xl font-bold text-blue-800">
                            ${product.discounted_price || product.price}
                          </span>

                          {product.discounted_price && (
                            <span className="text-sm ml-2 text-rose-500 line-through">
                              ${product.price}
                            </span>
                          )}
                        </div>

                        {product.discount_percentage && (
                          <div className="right-3 flex bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                            <span className="mt-0.25 mr-1">
                              {product.discount_percentage}{" "}
                            </span>
                            <BiSolidOffer className="" size={18} />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center bg-blue-100 px-2 py-1 rounded-full">
                            <FiStar
                              className="text-amber-400 fill-amber-400"
                              size={12}
                            />
                            <span className="text-xs font-medium text-blue-800 ml-1">
                              {product.average_rating?.toFixed(1) || "0.0"}
                            </span>
                          </div>
                          <span className="text-xs text-blue-600">
                            ({product.comment_count} reviews)
                          </span>
                        </div>

                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            product.stock_quantity > 10
                              ? "bg-green-100 text-green-800"
                              : product.stock_quantity > 0
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {product.stock_quantity > 0
                            ? `${product.stock_quantity} in stock`
                            : "Out of stock"}
                        </span>
                      </div>
                    </div>

                    {product.discount_period ? (
                      <div className="px-4 pb-4">
                        <div className="bg-blue-100 rounded-lg p-2">
                          <p className="text-xs flex items-center justify-center text-blue-700 font-medium text-center">
                            <FaClock className="mr-1 " size={16} /> Offer ends:{" "}
                            {new Date(
                              product.discount_period
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="h-12 w-full "></div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Favorites;
