import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";

import { getStorekeeperProducts } from "../../services/productAPIServices";
import { getStorekeeper } from "../../services/userAPIServices";
import { userAtom } from "../../atoms/userAtom";

import { FiPackage, FiSearch } from "react-icons/fi";

import ProductCard from "../../components/my-products/ProductCard";
import SearchBox from "../../components/my-products/SearchBox";
import RemoveProductPopup from "../../components/pop-ups/RemoveProductPopup";
import { SectionLoader } from "../../components/SectionLoader";
import useDebounce from "../../hooks/useDebounce";

export default function MyProducts() {
  const navigate = useNavigate();
  const [user] = useAtom(userAtom);

  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const [showRemovePopup, setShowRemovePopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const visibleCountNum = window.innerWidth >= 1280 ? 6 : 4;
  const [visibleCount, setVisibleCount] = useState(visibleCountNum);

  const [openMenu, setOpenMenu] = useState(null);

  const debouncedSearch = useDebounce(searchQuery, 500);

  // Fetch products
  useEffect(() => {
    if (!user) return;
    getStorekeeper(user.username).then((res) => {
      getStorekeeperProducts(res.data.id)
        .then((res) => {
          setIsLoading(false);
          setProducts(res.data);
        })
        .catch(() => setIsLoading(false));
    });
  }, [user]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenu && !event.target.closest(".relative")) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openMenu]);

  // Filtered products
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
  }, [products, debouncedSearch]);

  const openInNewTab = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const clearSearch = () => setSearchQuery("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="lg:col-span-3"
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl p-5 sm:p-6 2xl:p-8 border border-blue-400 hover:shadow-lg hover:shadow-blue-400/50 transition-all duration-300">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4 sm:mb-6">
          <div className="flex items-center">
            <h2 className="text-xl sm:text-2xl font-bold text-blue-800 flex items-center">
              <FiPackage className="mr-2 sm:mr-3 text-amber-600" size={24} />
              My Products
            </h2>
            <span className="ml-3 bg-blue-600 text-white text-sm px-3 py-1 rounded-full">
              {filteredProducts.length} items
            </span>
          </div>

          <SearchBox
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isSearchFocused={isSearchFocused}
            setIsSearchFocused={setIsSearchFocused}
          />
        </div>

        {/* Search Info */}
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

        {/* Products */}
        {isLoading ? (
          <SectionLoader chatLoader={false} title="Products" />
        ) : filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
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
              <div className="text-center py-12 bg-blue-50/50 rounded-2xl border border-blue-200">
                <FiPackage className="text-blue-400 mx-auto mb-4" size={48} />
                <p className="text-lg font-semibold text-blue-800 mb-2">
                  You haven't added any products yet.
                </p>
                <p className="text-blue-600">
                  Start by adding your first product to see it here.
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            layout="position"
            style={{ opacity: 1 }}
            className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 opacity-100"
          >
            {filteredProducts.slice(0, visibleCount).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                openMenu={openMenu}
                setOpenMenu={setOpenMenu}
                setShowRemovePopup={setShowRemovePopup}
                setSelectedProduct={setSelectedProduct}
                openInNewTab={openInNewTab}
                navigate={navigate}
              />
            ))}
          </motion.div>
        )}

        {/* Show more / Show less */}
        {filteredProducts.length > visibleCountNum && (
          <div className="flex justify-center pt-3 xs:pt-4 mt-4 xs:mt-5 border-t border-blue-300">
            {visibleCount < filteredProducts.length ? (
              <button
                onClick={() => setVisibleCount(visibleCount + visibleCountNum)}
                className="px-4 xs:px-6 py-2 cursor-pointer rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 text-sm xs:text-base font-medium"
              >
                Show more products
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

      {/* Remove Product Popup */}
      {showRemovePopup && (
        <RemoveProductPopup
          onClose={() => {
            setSelectedProduct(null);
            setShowRemovePopup(false);
          }}
          product={selectedProduct}
          onSuccess={() =>
            setProducts(() =>
              products.filter((item) => item.id !== selectedProduct.id)
            )
          }
          isRemoveCartItem={false}
        />
      )}
    </motion.div>
  );
}
