import { motion } from "framer-motion";
import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAtom } from "jotai";

import { getStorekeeperProducts } from "../../services/productAPIServices";
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
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const [showRemovePopup, setShowRemovePopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const page = Number(searchParams.get("page")) || 1;
  const visibleCountNum = window.innerWidth >= 1280 ? 6 : 4;

  const debouncedSearch = useDebounce(searchQuery, 600);
  const productsStartRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    setIsLoading(true);

    if (page > totalPages + 1 || page < 1) {
      navigate(`/account/my-products`);
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await getStorekeeperProducts(
          user.storekeeper_id,
          page,
          visibleCountNum,
          debouncedSearch
        );

        setProducts(response.data.results);
        setTotalProducts(response.data.count);
        setTotalPages(Math.ceil(response.data.count / visibleCountNum));
        setIsLoading(false);

        if (productsStartRef.current) {
          setTimeout(() => {
            productsStartRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }, 100);
        }
      } catch {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [user, page, navigate, debouncedSearch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenu && !event.target.closest(".relative")) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openMenu]);

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

  const goToPage = (newPage) => {
    if (productsStartRef.current) {
      productsStartRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setTimeout(() => {
      setProducts([]);
      setSearchParams({
        page: newPage,
      });
    }, 300);
  };

  const openInNewTab = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearchFocused(false);
    if (page !== 1) {
      setSearchParams({ page: 1 });
    } else {
      setSearchParams({});
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="lg:col-span-3"
    >
      <div className="space-y-4 sm:space-y-7 lg:space-y-5 xl:space-y-9">
        <div
          ref={productsStartRef}
          className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl p-5 sm:p-6 2xl:p-8 border border-blue-400 hover:shadow-lg hover:shadow-blue-400/50 transition-all duration-300"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4 sm:mb-6">
            <div className="flex items-center justify-between w-full md:w-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-blue-800 flex items-center">
                <FiPackage className="mr-2 sm:mr-3 text-amber-600" size={24} />
                My Products
              </h2>
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="ml-3 bg-blue-600 text-white text-sm px-3 py-1 flex rounded-full"
              >
                {totalProducts}
                <span className="hidden md:block pl-1">total items</span>
              </motion.span>
            </div>

            <SearchBox
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isSearchFocused={isSearchFocused}
              setIsSearchFocused={setIsSearchFocused}
            />
          </div>

          {searchQuery && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 p-4 bg-blue-50/50 rounded-xl border border-blue-200 overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <p className="text-blue-700">
                  Page {page} - Showing {filteredProducts.length} of{" "}
                  {totalProducts} products
                  {searchQuery && ` for "${searchQuery}"`}
                </p>
                {searchQuery && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearSearch}
                    className="text-sm bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-3 py-1 rounded-full hover:shadow-lg transition-all duration-300"
                  >
                    Clear search
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}

          {isLoading ? (
            <SectionLoader chatLoader={false} title="Products" />
          ) : filteredProducts.length === 0 && !searchQuery ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12 bg-blue-50/50 rounded-2xl border border-blue-200"
              >
                <FiPackage className="text-blue-400 mx-auto mb-4" size={48} />
                <p className="text-lg font-semibold text-blue-800 mb-2">
                  You haven't added any products yet.
                </p>
                <p className="text-blue-600">
                  Start by adding your first product to see it here.
                </p>
              </motion.div>
            </motion.div>
          ) : filteredProducts.length === 0 && searchQuery ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <FiSearch className="text-6xl text-blue-300 mx-auto" />
                <h3 className="text-xl font-bold text-blue-800">
                  No products found
                </h3>
                <p className="text-blue-600 max-w-md mx-auto">
                  No products match your search for "
                  <span className="font-semibold">{searchQuery}</span>". Try
                  different keywords or check your spelling.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearSearch}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-300 mt-4"
                >
                  View all products
                </motion.button>
              </motion.div>
            </motion.div>
          ) : (
            <>
              <motion.div
                key={page}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <ProductCard
                      product={product}
                      openMenu={openMenu}
                      setOpenMenu={setOpenMenu}
                      setShowRemovePopup={setShowRemovePopup}
                      setSelectedProduct={setSelectedProduct}
                      openInNewTab={openInNewTab}
                      navigate={navigate}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="flex justify-center mt-8"
                >
                  <div className="flex items-center gap-2">
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
                            <span key={p} className="text-blue-600">
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
            </>
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
          onSuccess={() => {
            setProducts((prev) =>
              prev.filter((item) => item.id !== selectedProduct.id)
            );
            setTotalProducts((prev) => prev - 1);
            if (products.length === 1 && page > 1) {
              setTimeout(() => {
                goToPage(page - 1);
              }, 500);
            }
          }}
          isRemoveCartItem={false}
        />
      )}
    </motion.div>
  );
}
