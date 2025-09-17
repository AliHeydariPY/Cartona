import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { FiStar, FiShoppingCart, FiHeart, FiEye } from "react-icons/fi";
import { FaHeart, FaRegHeart, FaClock } from "react-icons/fa";

import { PiLightningFill } from "react-icons/pi";
import { BiSolidOffer } from "react-icons/bi";

import Navbar from "../components/Navbar";
import ProductImageCarousel from "../components/ProductImageCarousel";
import { getListProducts, searchProduct } from "../services/productAPIServices";
import SearchFilters from "../components/SearchFilters";
export default function SearchPage() {
  const { query } = useParams();
  const [products, setProducts] = useState([]);

  const [showImages, setShowImages] = useState(false);
  const [mainImage, setMainImages] = useState([]);
  const [productID, setProductID] = useState(null);

  useEffect(() => {
    if (query) {
      searchProduct(`${query}`).then((res) => {
        setProducts(res.data);
      });
    } else {
      getListProducts().then((res) => {
        console.log(res.data);
        setProducts(res.data);
      });
    }
  }, [query]);

  const [favorites, setFavorites] = useState(new Set());

  const toggleFavorite = (productId) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const openInNewTab = (url) => {
    window.open(url, "_blank", "noreferrer");
  };

  return (
    <>
      <Navbar />
      <div className="xl:grid xl:grid-cols-8 2xl:grid-cols-5 gap-5 mx-auto px-4 py-6 items-start">
        <SearchFilters />

        <div className="grid xl:col-span-6 2xl:col-span-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 bg-blue-50">
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="group relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl border border-blue-200/50 hover:border-blue-300 transition-all duration-300 overflow-hidden"
            >
              {/* تصویر محصول با افکت‌ها */}
              <div className="relative overflow-hidden">
                <div className=" w-full h-80 flex items-center justify-center border-b-1 border-blue-300 mb-0 relative overflow-hidden p-7">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105 rounded-lg"
                  />
                </div>

                {/* پیشنهاد شگفت‌انگیز */}
                {product.amazing_offer && (
                  <div className="absolute flex top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                    <PiLightningFill className="mt-0.25 mr-0.75" size={13} />
                    {product.amazing_offer}
                  </div>
                )}

                {/* دکمه‌های اکشن */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="p-2 cursor-pointer bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-rose-100 transition-colors duration-200"
                  >
                    {favorites.has(product.id) ? (
                      <FaHeart className="text-rose-500" size={16} />
                    ) : (
                      <FiHeart className="text-rose-500" size={16} />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setProductID(product.id);
                      setMainImages({ image: product.image });
                      setShowImages(true);
                    }}
                    className="p-2 cursor-pointer bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-blue-100 transition-colors duration-200"
                  >
                    <FiEye className="text-blue-600" size={16} />
                  </button>
                </div>
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <button
                    onClick={() => openInNewTab(`/products/${product.id}`)}
                    className="bg-white cursor-pointer px-6 py-2 rounded-full shadow-md shadow-blue-100 hover:bg-blue-500 hover:text-white transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100"
                  >
                    Quick View
                  </button>
                </div>
              </div>

              {/* اطلاعات محصول */}
              <div className="p-4 space-y-3">
                {/* نام و دسته‌بندی */}
                <div>
                  <h3 className="font-bold text-blue-900 text-lg line-clamp-2 mb-1">
                    {product.name}
                  </h3>
                </div>

                {/* قیمت‌ها */}
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

                  {/* بدج تخفیف */}
                  {product.discount_percentage && (
                    <div className="right-3 flex bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                      <span className="mt-0.25 mr-1">
                        {product.discount_percentage}{" "}
                      </span>
                      <BiSolidOffer className="" size={18} />
                    </div>
                  )}
                </div>

                {/* امتیاز و نظرات */}
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

              {/* تایمر تخفیف (اگر وجود داشته باشد) */}
              {product.discount_period ? (
                <div className="px-4 pb-4">
                  <div className="bg-blue-100 rounded-lg p-2">
                    <p className="text-xs flex items-center justify-center text-blue-700 font-medium text-center">
                      <FaClock className="mr-1 " size={16} /> Offer ends:{" "}
                      {new Date(product.discount_period).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-12 w-full "></div>
              )}
            </motion.div>
          ))}
        </div>
        {showImages && (
          <ProductImageCarousel
            productID={productID}
            mainImage={mainImage}
            onClose={() => setShowImages(false)}
          />
        )}
      </div>
    </>
  );
}
