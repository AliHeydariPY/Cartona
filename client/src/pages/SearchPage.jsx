import { motion } from "framer-motion";
import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

import { FiStar, FiHeart, FiEye } from "react-icons/fi";
import { FaHeart, FaClock } from "react-icons/fa";

import { PiLightningFill } from "react-icons/pi";
import { BiSolidOffer } from "react-icons/bi";

import ProductImageCarousel from "../components/ProductImageCarousel";
import Navbar from "../components/Navbar";
import SearchFilters from "../components/SearchFilters";
import BottomNav from "../components/BottomNav";
import ProductNotFound from "../components/ProductNotFound";

import { getListProducts, searchProduct } from "../services/productAPIServices";
import { isProductInFavorites } from "../services/cartAPIServices";
import { useProductActions } from "../hooks/useProductActions";

const SearchPage = () => {
  const { query } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const [showImages, setShowImages] = useState(false);
  const [mainImage, setMainImage] = useState([]);
  const [productID, setProductID] = useState(null);

  const [isFocus, setIsFocus] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [totalPages, setTotalPages] = useState(1);
  const page = Number(searchParams.get("page")) || 1;

  const productsStartRef = useRef(null);

  const { addFavoriteHandler, removeFavoriteHandler } =
    useProductActions(setFavorites);

  const innerWidth = window.innerWidth;
  const visibleCountNum = window.innerWidth >= 1280 ? 12 : 8;

  useEffect(() => {
    const fetchProducts = async () => {
      try {

        if (page > totalPages || page < 1) {
          setSearchParams({ page: 1 });
          return;
        }

        const res = query
          ? await searchProduct(query, page, visibleCountNum)
          : await getListProducts(page, visibleCountNum);

        const favoriteProducts = await Promise.all(
          res.data.results.map(async (product) => {
            try {
              let fav = await isProductInFavorites(product.id);
              return fav.data;
            } catch {
              return null;
            }
          })
        );

        if (!res.data.results[0]) {
          setNotFound(true);
          return;
        }

        setFavorites(favoriteProducts.filter(Boolean));
        setProducts(res.data.results);
        setTotalPages(Math.ceil(res.data.count / visibleCountNum));
        setNotFound(false);

        if (productsStartRef.current) {
          setTimeout(() => {
            productsStartRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }, 100);
        }
      } catch {
        setNotFound(true);
      }
    };

    fetchProducts();
  }, [query, page]);

  const goToPage = (newPage) => {
    setProducts([]);
    setSearchParams({ page: newPage });
    if (productsStartRef.current) {
      productsStartRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleShowImagesCarousel = (product) => {
    setProductID(product.id);
    setMainImage({ image: product.image });
    setShowImages(true);
  };

  const openInNewTab = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (notFound) {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 md:from-blue-50 md:to-blue-50 mb-20 md:mb-0">
        <Navbar isFocus={isFocus} setIsFocus={() => setIsFocus(false)} />
        <ProductNotFound
          searchQuery={query}
          setIsFocus={() => setIsFocus(true)}
        />
      </div>
    );
  }

  const favoriteMap = new Map(favorites.map((f) => [f.product, f]));

  return (
    <>
      <div ref={productsStartRef}></div>
      <Navbar />
      {products.length > 0 && (
        <div className="pb-20 md:pb-6 px-4 py-6">
          <div className="xl:grid xl:grid-cols-8 2xl:grid-cols-5 gap-5 mx-auto sm:px-4 py-4 xl:py-0 items-start">
            <SearchFilters />

            <motion.div
              key={page}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid xl:col-span-6 2xl:col-span-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 bg-blue-50"
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={` group relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl border border-blue-200/50 hover:border-blue-300 transition-all duration-300 overflow-hidden`}
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
                        <PiLightningFill
                          className="mt-0.25 mr-0.75"
                          size={13}
                        />
                        {product.amazing_offer.length < 25
                          ? product.amazing_offer
                          : "Special sale"}
                      </div>
                    )}

                    {innerWidth > 1024 && (
                      <>
                        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {(() => {
                            const favorite = favoriteMap.get(product.id);

                            return favorite ? (
                              <button
                                onClick={() =>
                                  removeFavoriteHandler(favorite.id)
                                }
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
                            onClick={() => handleShowImagesCarousel(product)}
                            className="p-2 cursor-pointer bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-blue-100 transition-colors duration-200"
                          >
                            <FiEye className="text-blue-600" size={16} />
                          </button>
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
                                onClick={() =>
                                  removeFavoriteHandler(favorite.id)
                                }
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
                            onClick={() => handleShowImagesCarousel(product)}
                            className="p-2 h-8 cursor-pointer  rounded-full shadow-md hover:bg-blue-200 transition-colors duration-300"
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
              ))}
            </motion.div>
          </div>
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex justify-center mt-8 pt-6 border-t border-blue-200"
            >
              <div className="flex flex-wrap items-center gap-2 justify-center">
                <button
                  disabled={page === 1}
                  onClick={() => goToPage(page - 1)}
                  className={`px-4 py-2 rounded-lg border transition-all duration-300 
                    ${
                      page === 1
                        ? "cursor-not-allowed bg-gray-100 text-gray-400"
                        : "cursor-pointer bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105 active:scale-95"
                    }`}
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, i) => {
                  const p = i + 1;
                  const showPage =
                    p === 1 ||
                    p === totalPages ||
                    (p >= page - 1 && p <= page + 1) ||
                    (page <= 2 && p <= 5) ||
                    (page >= totalPages - 1 && p >= totalPages - 4);

                  if (!showPage) {
                    if (p === page - 2 || p === page + 2) {
                      return (
                        <span key={p} className="text-blue-600 px-2">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }

                  return (
                    <motion.button
                      key={p}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => goToPage(p)}
                      className={`px-3 py-1 rounded-lg border transition-all duration-200 
                        ${
                          p === page
                            ? "bg-blue-600 text-white border-blue-700 transform scale-110"
                            : "bg-white text-blue-700 border-blue-300 hover:bg-blue-50 hover:scale-105"
                        }`}
                    >
                      {p}
                    </motion.button>
                  );
                })}

                <button
                  disabled={page === totalPages}
                  onClick={() => goToPage(page + 1)}
                  className={`px-4 py-2 rounded-lg border transition-all duration-300 
                    ${
                      page === totalPages
                        ? "cursor-not-allowed bg-gray-100 text-gray-400"
                        : "cursor-pointer bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105 active:scale-95"
                    }`}
                >
                  Next
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {showImages && (
        <ProductImageCarousel
          productID={productID}
          mainImage={mainImage}
          onClose={() => setShowImages(false)}
        />
      )}
      <BottomNav />
    </>
  );
};

export default SearchPage;
