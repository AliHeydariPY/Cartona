import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiFilter,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiStar,
  FiUser,
  FiShoppingBag,
  FiHeart,
  FiSettings,
  FiCreditCard,
  FiLogOut,
  FiHome,
  FiShield,
  FiPackage,
  FiShoppingCart,
  FiUsers,
  FiDollarSign,
  FiPlusCircle,
  FiFileText,
  FiBell,
  FiMessageSquare,
} from "react-icons/fi";
import { FiHelpCircle, FiInfo } from "react-icons/fi";

import { BiCategory, BiStore } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import { searchProduct } from "../services/productAPIServices";

const SearchFilters = ({
  // categories = [],
  // storekeepers = [],
  setProducts,
}) => {
  const navigate = useNavigate();
  const { query } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    min_rating: "",
    max_rating: "",
    min_comment_count: "",
    max_comment_count: "",
    min_price: "",
    max_price: "",
    category: "",
    storekeeper: "",
  });
  const [activeCategory, setActiveCategory] = useState("");

  // اعمال فیلترها هنگام تغییر
  useEffect(() => {
    console.log(filters);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    const resetValues = {
      min_rating: "",
      max_rating: "",
      min_comment_count: "",
      max_comment_count: "",
      min_price: "",
      max_price: "",
      category: "",
      storekeeper: "",
    };
    setFilters(resetValues);
    setActiveCategory("");
  };

  const FilterSection = ({ title, icon, children }) => (
    <div className="">
      <div className="flex items-center mb-3 text-blue-800">
        {icon}
        <h3 className="font-semibold ml-2">{title}</h3>
      </div>
      {children}
    </div>
  );

  const handleFilter = () => {
    const filtersName = [
      "min_rating",
      "max_rating",
      "min_comment_count",
      "max_comment_count",
      "min_price",
      "max_price",
      "category",
      "storekeeper",
    ];
    let url = query.search("&") == -1 ? query : query.slice(0, query.search("&"))
    
    filtersName.map((filterName) => {
      console.log(filterName);
      if (filters[filterName]) {
        url += `&${filterName}=${filters[filterName]}`;
      }
    });
    console.log(url);
    navigate(`/search/${url}`);
  };

  return (
    <div className="mb-6 col-span-2 2xl:col-span-1">
      {/* دکمه باز کردن فیلترها در موبایل */}
      <div className="flex w-full justify-between items-center mb-4 xl:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
        >
          <FiFilter className="mr-2" />
          Filters
          {(filters.min_price ||
            filters.max_price ||
            filters.category ||
            filters.min_rating) && (
            <span className="ml-2 bg-white text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs">
              !
            </span>
          )}
        </button>
      </div>

      <div className=" flex-col lg:flex-row gap-6">
        {/* پنل فیلترها */}
        <AnimatePresence>
          {(isOpen || window.innerWidth >= 1024) && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full bg-white/80 backdrop-blur-lg rounded-2xl p-4 border border-white/30 shadow-lg xl:sticky xl:top-24 xl:h-fit"
            >
              {/* هدر فیلترها */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Filters
                </h3>
                <div className="flex items-center">
                  <button
                    onClick={resetFilters}
                    className="text-sm text-blue-600 hover:text-cyan-500 mr-3 transition-colors duration-200"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="lg:hidden text-blue-800 hover:text-blue-600"
                  >
                    <FiX size={20} />
                  </button>
                </div>
              </div>

              {/* دسته‌بندی فیلترها */}
              <div className="space-y-5 max-h-[70vh] overflow-y-auto ">
                {/* فیلتر قیمت */}
                <FilterSection
                  title="Price Range"
                  icon={<FiDollarSign className="text-green-500 mb-0.5" />}
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-blue-700 mb-1">
                        Min Price
                      </label>
                      <input
                        type="number"
                        value={filters.min_price}
                        onChange={(e) => ("min_price", e.target.value)}
                        className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="$0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-blue-700 mb-1">
                        Max Price
                      </label>
                      <input
                        type="number"
                        value={filters.max_price}
                        onChange={(e) =>
                          handleFilterChange("max_price", e.target.value)
                        }
                        className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="$1000"
                      />
                    </div>
                  </div>
                </FilterSection>

                {/* فیلتر امتیاز */}
                <FilterSection
                  title="Rating"
                  icon={<FiStar className="text-amber-500 mb-0.5" />}
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-blue-700 mb-1">
                        Min Rating
                      </label>
                      <select
                        value={filters.min_rating}
                        onChange={(e) =>
                          handleFilterChange("min_rating", e.target.value)
                        }
                        className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Any</option>
                        <option value="1">1+ Star</option>
                        <option value="2">2+ Stars</option>
                        <option value="3">3+ Stars</option>
                        <option value="4">4+ Stars</option>
                        <option value="5">5 Stars</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-blue-700 mb-1">
                        Max Rating
                      </label>
                      <select
                        value={filters.max_rating}
                        onChange={(e) =>
                          handleFilterChange("max_rating", e.target.value)
                        }
                        className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Any</option>
                        <option value="1">1 Star</option>
                        <option value="2">2 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="5">5 Stars</option>
                      </select>
                    </div>
                  </div>
                </FilterSection>

                {/* فیلتر تعداد نظرات */}
                <FilterSection
                  title="Reviews"
                  icon={<FiMessageSquare className="text-blue-500 mb-0.25" />}
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-blue-700 mb-1">
                        Min Reviews
                      </label>
                      <input
                        type="number"
                        value={filters.min_comment_count}
                        onChange={(e) =>
                          handleFilterChange(
                            "min_comment_count",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-blue-700 mb-1">
                        Max Reviews
                      </label>
                      <input
                        type="number"
                        value={filters.max_comment_count}
                        onChange={(e) =>
                          handleFilterChange(
                            "max_comment_count",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="1000"
                      />
                    </div>
                  </div>
                </FilterSection>

                {/* فیلتر دسته‌بندی */}
                {/* {categories.length > 0 && (
                  <FilterSection 
                    title="Category" 
                    icon={<BiCategory className="text-green-500" />}
                  >
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </FilterSection>
                )} */}

                {/* فیلتر فروشنده */}
                {/* {storekeepers.length > 0 && (
                  <FilterSection 
                    title="Storekeeper" 
                    icon={<BiStore className="text-purple-500" />}
                  >
                    <select
                      value={filters.storekeeper}
                      onChange={(e) => handleFilterChange('storekeeper', e.target.value)}
                      className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Storekeepers</option>
                      {storekeepers.map((store) => (
                        <option key={store.id} value={store.id}>
                          {store.name}
                        </option>
                      ))}
                    </select>
                  </FilterSection>
                )} */}
              </div>
              <div>
                <button
                  onClick={handleFilter}
                  className="w-full bg-gradient-to-r text-white from-blue-600 to-cyan-500 mt-3 py-2 rounded-lg"
                >
                  {" "}
                  sumbit
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* بخش محصولات */}
      </div>
    </div>
  );
};

export default SearchFilters;
