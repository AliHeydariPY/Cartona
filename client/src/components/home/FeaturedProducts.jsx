import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { getStorekeeperProducts } from "../../services/productAPIServices";
import {
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiStar,
  FiHeart,
} from "react-icons/fi";

import { BiSolidOffer } from "react-icons/bi";
import { FaClock, FaHeart } from "react-icons/fa";
import { PiLightningFill } from "react-icons/pi";
import { isProductInFavorites } from "../../services/cartAPIServices";
import ProductImageCarousel from "../ProductImageCarousel";
import { useProductActions } from "../../hooks/useProductActions";

const ProductsCarousel = ({ featuredProducts }) => {
  const [favorites, setFavorites] = useState([]);

  const containerRef = useRef(null);
  const trackRef = useRef(null);

  const [showImages, setShowImages] = useState(false);
  const [mainImage, setMainImages] = useState([]);
  const [productID, setProductID] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const [itemWidthPx, setItemWidthPx] = useState(0);
  const [gapPx, setGapPx] = useState(8);

  const { addFavoriteHandler, removeFavoriteHandler } =
    useProductActions(setFavorites);

  useEffect(() => {
    if (!featuredProducts) return;
    const fetchData = async () => {
      const favoriteProducts = await Promise.all(
        featuredProducts.map(async (product) => {
          try {
            let fav = await isProductInFavorites(product.id);
            return fav.data;
          } catch {
            return null;
          }
        })
      );
      console.log(favoriteProducts.filter(Boolean));
      setFavorites(favoriteProducts.filter(Boolean));
    };
    fetchData();
  }, [featuredProducts]);

  const updateVisibleCount = () => {
    const width = window.innerWidth;
    if (width < 640) setVisibleCount(1);
    else if (width < 1024) setVisibleCount(2);
    else if (width < 1280) setVisibleCount(3);
    else setVisibleCount(4);

    setCurrentIndex(0);
  };

  useEffect(() => {
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const recalcSizes = () => {
    const container = containerRef.current;
    if (!container) return;
    const style = getComputedStyle(container);
    const cssGap = parseFloat(style.getPropertyValue("gap")) || gapPx;
    setGapPx(cssGap);

    const containerWidth = container.clientWidth;
    const totalGapForVisible = cssGap * (visibleCount - 1);
    const itemW = (containerWidth - totalGapForVisible) / visibleCount;
    setItemWidthPx(Math.max(0, Math.floor(itemW)));
  };

  useEffect(() => {
    recalcSizes();
    window.addEventListener("resize", recalcSizes);
    return () => window.removeEventListener("resize", recalcSizes);
  }, [visibleCount, featuredProducts.length]);

  const next = () => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, featuredProducts.length - visibleCount);
      return Math.min(prev + 1, maxIndex);
    });
  };

  const prev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const canGoPrev = currentIndex > 0;
  const canGoNext =
    currentIndex < Math.max(0, featuredProducts.length - visibleCount);

  const translateX = -(currentIndex * (itemWidthPx + gapPx));

  if (!featuredProducts || featuredProducts.length === 0) return;

  const openInNewTab = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative">
      <div ref={containerRef} className="relative overflow-hidden rounded-2xl">
        <motion.div
          ref={trackRef}
          className="flex gap-2 xl:gap-5"
          animate={{ x: translateX }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          style={{
            width: `${
              featuredProducts.length * (itemWidthPx + gapPx) - gapPx
            }px`,
          }}
        >
          {featuredProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{ width: `${itemWidthPx}%` }}
              className={` group relative bg-white/95 backdrop-blur-xl rounded-2xl border border-blue-200/50 hover:border-blue-300 transition-all duration-300 overflow-hidden`}
            >
              <div className="relative overflow-hidden">
                <div
                  onClick={() => {
                    if (innerWidth <= 1024) {
                      openInNewTab(`/product/${product.id}`);
                    }
                  }}
                  className={`${
                    innerWidth <= 1024 && "cursor-pointer"
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
                    <PiLightningFill className="mt-0.25 mr-0.75" size={13} />
                    {product.amazing_offer.length < 25
                      ? product.amazing_offer
                      : "Special sale"}
                  </div>
                )}

                {innerWidth > 1024 && (
                  <>
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {(() => {
                        const favorite = favorites.find(
                          (fav) => fav.product === product.id
                        );
                        return favorite ? (
                          <button
                            onClick={() => removeFavoriteHandler(favorite.id)}
                            className="p-2 cursor-pointer bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-rose-100 transition-colors duration-200"
                          >
                            <FaHeart className="text-rose-500" size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() => addFavoriteHandler(product.id)}
                            className="p-2 cursor-pointer bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-rose-100 transition-colors duration-200"
                          >
                            <FiHeart className="text-rose-500" size={16} />
                          </button>
                        );
                      })()}
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
                        onClick={() => openInNewTab(`/product/${product.id}`)}
                        className="bg-white cursor-pointer px-6 py-2 rounded-full shadow-md shadow-blue-100 hover:bg-blue-500 hover:text-white transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100"
                      >
                        Quick View
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="p-4 space-y-2">
                <div className="h-14 flex justify-between">
                  <h3 className="font-bold text-blue-900 text-lg line-clamp-2 mb-1">
                    {product.name}
                  </h3>
                  {innerWidth <= 1024 && (
                    <div className="flex gap-2  duration-300">
                      {(() => {
                        const favorite = favorites.find(
                          (fav) => fav.product === product.id
                        );
                        return favorite ? (
                          <button
                            onClick={() => removeFavoriteHandler(favorite.id)}
                            className="p-2 h-8 cursor-pointer bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-rose-100 transition-colors duration-200"
                          >
                            <FaHeart className="text-rose-500" size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() => addFavoriteHandler(product.id)}
                            className="p-2 h-8 cursor-pointer bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-rose-100 transition-colors duration-200"
                          >
                            <FiHeart className="text-rose-500" size={16} />
                          </button>
                        );
                      })()}

                      <button
                        onClick={() => {
                          setProductID(product.id);
                          setMainImages({ image: product.image });
                          setShowImages(true);
                        }}
                        className="p-2 h-8 cursor-pointer rounded-full shadow-md hover:bg-blue-200 transition-colors duration-300"
                      >
                        <FiEye className="text-blue-600" size={16} />
                      </button>
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
                <div className="h-full px-4 pb-4">
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
        </motion.div>
      </div>

      {featuredProducts.length > visibleCount && (
        <>
          <button
            onClick={prev}
            disabled={!canGoPrev}
            className="absolute cursor-pointer -left-3 top-1/2 transform -translate-y-1/2 p-3 bg-white/60 backdrop-blur-md rounded-full shadow-lg hover:bg-white border border-blue-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 z-10"
          >
            <FiChevronLeft className="text-blue-600" size={20} />
          </button>

          <button
            onClick={next}
            disabled={!canGoNext}
            className="absolute cursor-pointer -right-3 top-1/2 transform -translate-y-1/2 p-3 bg-white/60 backdrop-blur-md rounded-full shadow-lg hover:bg-white border border-blue-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 z-10"
          >
            <FiChevronRight className="text-blue-600" size={20} />
          </button>
        </>
      )}
      {showImages && (
        <ProductImageCarousel
          productID={productID}
          mainImage={mainImage}
          onClose={() => setShowImages(false)}
        />
      )}
    </div>
  );
};

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const firstProducts = await getStorekeeperProducts(1);
      const secondeProducts = await getStorekeeperProducts(2);

      setFeaturedProducts([
        ...firstProducts.data.results,
        ...secondeProducts.data.results,
      ]);
    };

    fetchProducts();
  }, []);

  return (
    <div className="mb-20">
      <div className="flex mb-10">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          Featured Products
        </h2>
      </div>
      <ProductsCarousel featuredProducts={featuredProducts} />
    </div>
  );
};

export default FeaturedProducts;
