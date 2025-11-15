import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { getStorekeeperProducts } from "../../services/productAPIServices";
import { getStorekeeper } from "../../services/userAPIServices";
import { PiLightningFill } from "react-icons/pi";
import { FiSearch, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";

import { useAtom } from "jotai";
import { userAtom } from "../../atoms/userAtom";

import {
  FiEdit,
  FiTrash2,
  FiImage,
  FiList,
  FiStar,
  FiPackage,
} from "react-icons/fi";
import RemoveProductPopup from "../../components/pop-ups/RemoveProductPopup";
import { SectionLoader } from "../../components/SectionLoader";

export default function MyProducts() {
  const navigate = useNavigate();
  const [user] = useAtom(userAtom);

  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);

  const [showRemovePopup, setShowRemovePopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const visibleCountNum = window.innerWidth >= 1280 ? 6 : 4;

  const [visibleCount, setVisibleCount] = useState(visibleCountNum);

  useEffect(() => {
    if (!user) return;
    getStorekeeper(user.username).then((res) => {
      getStorekeeperProducts(res.data.id).then((res) => {
        setIsLoading(false);
        setProducts(res.data);
      });
    });
  }, [user]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;

    const query = searchQuery.toLowerCase().trim();

    return products.filter((product) => {
      const productName = product.name.toLowerCase();

      if (productName.includes(query)) return true;

      const productWords = productName.split(/\s+/);
      const queryWords = query.split(/\s+/);

      return queryWords.some((qWord) =>
        productWords.some((pWord) => pWord.startsWith(qWord))
      );
    });
  }, [products, searchQuery]);

  const displayedProducts = useMemo(() => {
    if (showAllProducts) {
      return filteredProducts;
    }
    return filteredProducts.slice(0, 6);
  }, [filteredProducts, showAllProducts]);

  const openInNewTab = (url) => {
    window.open(url, "_blank", "noreferrer");
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const toggleShowAllProducts = () => {
    setShowAllProducts(!showAllProducts);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="lg:col-span-3"
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl p-5 sm:p-6 2xl:p-8 border border-blue-400 hover:shadow-lg hover:shadow-blue-400/50 transition-all duration-300">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4 sm:mb-6">
          <div className="flex items-center">
            <h2 className="text-xl sm:text-2xl font-bold text-blue-800 flex items-center">
              <FiPackage className="mr-2 sm:mr-3 text-amber-600" size={24} />
              My Products
            </h2>
            <span className="ml-3  bg-blue-600  text-white text-sm px-3 py-1 rounded-full">
              {filteredProducts.length} items
            </span>
          </div>

          <div
            className={`relative w-full lg:w-80 transition-all duration-300 ${
              isSearchFocused ? "scale-101" : ""
            }`}
          >
            <div className="flex items-center group p-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl shadow-lg">
              <div className="w-full bg-white h-12 rounded-l-xl">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Search your products..."
                  className="rounded-l-xl text-blue-900 px-4 py-3.5 h-full w-full focus:outline-none border-r-0 placeholder-blue-400/70"
                />
              </div>
              <div className="relative h-full flex items-center rounded-r-xl overflow-hidden cursor-pointer bg-white">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 m-1 w-11 h-10 rounded-xl flex items-center justify-center">
                  {searchQuery ? (
                    <FiX
                      className="text-xl text-white relative z-10 cursor-pointer"
                      onClick={clearSearch}
                    />
                  ) : (
                    <FiSearch className="text-xl text-white relative z-10" />
                  )}
                </div>
                <div
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 rounded-xl 
                  group-hover:opacity-100 group-hover:scale-150 
                  group-focus-within:opacity-100 group-focus-within:scale-150 
                  transition-all duration-500 z-0 origin-center"
                />
              </div>
            </div>
          </div>
        </div>

        {searchQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-blue-50/50 rounded-xl border border-blue-200"
          >
            <div className="flex items-center justify-between">
              <p className="text-blue-700">
                Showing {filteredProducts.length} of {products.length} products
                {searchQuery && ` for "${searchQuery}"`}
              </p>
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="text-sm bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-3 py-1 rounded-full hover:shadow-lg transition-all duration-300"
                >
                  Clear search
                </button>
              )}
            </div>
          </motion.div>
        )}

        {isLoading ? (
          <SectionLoader chatLoader={false} />
        ) : (
          filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              {searchQuery ? (
                <div className="space-y-4">
                  <FiSearch className="text-6xl text-blue-300 mx-auto" />
                  <h3 className="text-xl font-bold text-blue-800">
                    No products found
                  </h3>
                  <p className="text-blue-600 max-w-md mx-auto">
                    No products match your search for "
                    <span className="font-semibold">{searchQuery}</span>". Try
                    different keywords or check your spelling.
                  </p>
                  <button
                    onClick={clearSearch}
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-300 mt-4"
                  >
                    View all products
                  </button>
                </div>
              ) : (
                <div className="text-gray-500 space-y-2">
                  <FiPackage className="text-4xl mx-auto mb-4 text-blue-300" />
                  <p className="text-lg">You haven't added any products yet.</p>
                  <p className="text-sm">
                    Start by adding your first product to see it here.
                  </p>
                </div>
              )}
            </motion.div>
          )
        )}

        <div>
          <motion.div
            layout="position"
            style={{ opacity: 1 }}
            className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 opacity-100"
          >
            {filteredProducts.slice(0, visibleCount).map((product) => (
              <motion.div
                key={product.id}
                layout="position"
                initial={{ opacity: 1, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                style={{ opacity: 1 }}
                className="overflow-hidden rounded-2xl shadow-md hover:shadow-xl border border-gray-200 bg-white transition-all duration-300"
              >
                <div
                  onClick={() => {
                    openInNewTab(`/product/${product.id}`);
                  }}
                  className="relative flex cursor-pointer justify-center items-center p-4 md:p-6 rounded-xl sm:rounded-2xl border-2 border-blue-200 shadow-inner w-full h-[260px] md:min-w-[260px] md:h-[260px]"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain rounded-md"
                  />

                  {product.amazing_offer && (
                    <div className="absolute flex top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                      <PiLightningFill className="mt-0.25 mr-0.75" size={13} />
                      {product.amazing_offer}
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="text-lg font-bold text-blue-900 truncate">
                    {product.name}
                  </h3>

                  <div className="flex items-center flex-wrap gap-2">
                    <span className="text-lg sm:text-lg font-bold text-blue-900">
                      ${product.discounted_price || product.price}
                    </span>
                    {product.discounted_price && (
                      <span className="text-sm text-rose-500 line-through ml-1">
                        ${product.price}
                      </span>
                    )}
                    {product.discount_percentage && (
                      <span className="ml-1 text-xs bg-gradient-to-r from-rose-500 to-pink-500 text-white px-2 sm:px-2 py-1 rounded-full">
                        {product.discount_percentage}% OFF
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-500">
                    Stock: {product.stock_quantity}
                  </p>

                  <div className="flex items-center mb-3 gap-2">
                    <div className="flex items-center bg-blue-100 w-max px-2 py-1 rounded-full">
                      <FiStar className="text-yellow-500 fill-yellow-500 mr-1 mb-0.5" />
                      <span className="text-sm text-blue-600">
                        {product.average_rating?.toFixed(1) || "0"}
                      </span>
                    </div>
                    <span className="text-sm text-blue-600">
                      ({product.comment_count || 0} reviews)
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      className="flex cursor-pointer items-center justify-center p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-300"
                      onClick={() => {
                        navigate(`edit/${product.id}`);
                      }}
                    >
                      <FiEdit className="w-4 h-4 mb-0.5" /> Edit
                    </button>

                    <button
                      className="flex cursor-pointer items-center justify-center p-2 bg-cyan-100 text-cyan-700 rounded-lg hover:bg-cyan-200 transition-colors duration-300"
                      onClick={() => {
                        navigate(`images/${product.id}`);
                      }}
                    >
                      <FiImage className="w-4 h-4 mb-0.5 " /> Images
                    </button>

                    <button
                      className="flex cursor-pointer items-center justify-center p-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors duration-300"
                      onClick={() => {
                        navigate(`features/${product.id}`);
                      }}
                    >
                      <FiList className="mb-0.5" size={19} /> Features
                    </button>

                    <button
                      className="flex cursor-pointer items-center justify-center p-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors duration-300"
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowRemovePopup(true);
                      }}
                    >
                      <FiTrash2 className="w-4 h-4 mb-0.5" /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filteredProducts.length > visibleCountNum && (
            <div className="flex justify-center pt-3 xs:pt-4 mt-4 xs:mt-5 border-t border-blue-300">
              {visibleCount < filteredProducts.length ? (
                <button
                  onClick={() =>
                    setVisibleCount(visibleCount + visibleCountNum)
                  }
                  className="px-4 xs:px-6 py-2 cursor-pointer rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 text-sm xs:text-base font-medium"
                >
                  Show more favorites
                </button>
              ) : (
                <button
                  onClick={() => setVisibleCount(visibleCountNum)}
                  className="px-4 xs:px-6 py-2 cursor-pointer rounded-lg border border-blue-400 text-blue-600 hover:bg-blue-50 transition-colors duration-300 text-sm xs:text-base font-medium"
                >
                  Show less
                </button>
              )}
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
            setProducts(() =>
              products.filter((item) => item.id != selectedProduct.id)
            )
          }
          isRemoveCartItem={false}
        />
      )}
    </motion.div>
  );
}
