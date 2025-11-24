import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Formik, Form } from "formik";

import CategoryFilter from "./filters/CategoryFilter";

import { BiCategory } from "react-icons/bi";

import {
  FiFilter,
  FiX,
  FiChevronDown,
  FiStar,
  FiDollarSign,
  FiMessageSquare,
} from "react-icons/fi";

import { useNavigate, useParams } from "react-router-dom";

import {
  getCategory,
  getMinMaxComments,
  getMinMaxPrice,
} from "../services/productAPIServices";
import { getStorekeeperById } from "../services/userAPIServices";
import PriceFilter from "./filters/PriceFilter";
import RatingFilter from "./filters/RatingFilter";
import ReviewsFiltre from "./filters/ReviewsFiltre";

const SearchFilters = () => {
  const navigate = useNavigate();
  const { query } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const params = new URLSearchParams(query);
  const [open, setOpen] = useState(false);
  const [storekeeperInfo, setStorekeeperInfo] = useState();

  const [minMaxPrice, setMinMaxPrice] = useState([]);
  const [minMaxComments, setMinMaxComments] = useState([]);

  const filters = {
    min_rating: "",
    max_rating: "",
    min_comments: "",
    max_comments: "",
    min_price: "",
    max_price: "",
    category: null,
    storekeeper: "",
  };
  const [initialFilters, setInitialFilters] = useState({
    min_rating: "",
    max_rating: "",
    min_comments: "",
    max_comments: "",
    min_price: "",
    max_price: "",
    storekeeper: "",
    category: null,
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadFilters = async () => {
      const newFilters = { ...initialFilters };

      await Promise.all(
        Object.keys(initialFilters).map(async (filter) => {
          if (params.has(filter)) {
            const value = params.get(filter);

            if (filter === "category") {
              const res = await getCategory(value);
              newFilters[filter] = res.data;
            } else {
              newFilters[filter] = isNaN(value) ? value : Number(value);
            }
          } else {
            newFilters[filter] = "";
          }
        })
      );

      if (newFilters.storekeeper) {
        const res = await getStorekeeperById(newFilters.storekeeper);
        setStorekeeperInfo(res.data);
      } else {
        setStorekeeperInfo(true);
      }

      setPriceRange();
      setCommentRange();

      setInitialFilters(newFilters);
      setIsReady(true);
    };

    loadFilters();
  }, [query]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        if (!isOpen) {
          setIsOpen(true);
        }
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const setPriceRange = async () => {
    let priceRange = [];
    const filteredQuery = query
      .replace(/(&)?min_price=\d+/g, "")
      .replace(/(&)?max_price=\d+/g, "");

    const min = await getMinMaxPrice("min", filteredQuery);
    priceRange.push(min.data.price);

    const max = await getMinMaxPrice("max", filteredQuery);
    priceRange.push(max.data.price);

    setMinMaxPrice(priceRange);
  };

  const setCommentRange = async () => {
    let commentsRange = [];
    const filteredQuery = query
      .replace(/(&)?min_comments=\d+/g, "")
      .replace(/(&)?max_comments=\d+/g, "");

    const min = await getMinMaxComments("min", filteredQuery);
    commentsRange.push(min.data.comment_count);
    const max = await getMinMaxComments("max", filteredQuery);
    commentsRange.push(max.data.comment_count);

    setMinMaxComments(commentsRange);
  };

  const buildUrl = (values) => {
    const filtersName = Object.keys(filters);

    const firstFilter = query?.slice(0, query?.search("&"));
    let url = "";
    if (
      firstFilter?.includes("storekeeper") ||
      firstFilter?.includes("search")
    ) {
      url =
        query?.search("&") === -1 ? query : query?.slice(0, query?.search("&"));
    }

    filtersName.forEach((filterName) => {
      if (values[filterName] || values[filterName] == null) {
        if (!url) {
          url = `${filterName}=${values[filterName]}`;
        } else {
          url += `&${filterName}=${values[filterName]}`;
        }
      }
    });
    return url;
  };

  if (!isReady || !storekeeperInfo) {
    return (
      <div className="mb-6 col-span-2 2xl:col-span-1">
        <div className="w-full bg-white/80 backdrop-blur-lg rounded-2xl p-4 border border-white/30 shadow-lg">
          <div className="animate-pulse">
            <div className="h-6 bg-blue-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-blue-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-blue-200 rounded w-2/3 mb-6"></div>
            <div className="h-10 bg-blue-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 xl:col-span-2 2xl:col-span-1">
      <div className="flex w-full justify-between items-center mb-4 xl:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white transition-colors duration-300 font-medium flex items-center justify-center px-4 py-2 rounded-lg shadow-md hover:shadow-lg"
        >
          <FiFilter className="mr-2" />
          Filters
        </button>
      </div>

      <Formik
        initialValues={initialFilters}
        enableReinitialize
        onSubmit={(values) => {
          params.delete("storekeeper");
          const cat = values.category
            ? values.category
            : initialFilters.category;

          let url;

          if (cat) {
            if (params.has("search")) {
              url = buildUrl({ ...values, category: cat.id });
            } else {
              if (values.storekeeper) {
                url = buildUrl({
                  ...values,
                  category: cat.id,
                  storekeeper: "",
                });
              } else {
                url = buildUrl({ ...values, category: cat.id });
              }
            }
          } else {
            url = buildUrl({ ...values, storekeeper: "" });
          }
          navigate(`/search/${url}`);
        }}
      >
        {({ values, setFieldValue, submitForm }) => (
          <Form>
            <div className="  gap-6">
              <AnimatePresence>
                {(isOpen || window.innerWidth >= 1280) && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl border border-blue-200/50 hover:border-blue-300 transition-all duration-300 p-4"
                  >
                    <div
                      className={`flex justify-between items-center ${
                        initialFilters.storekeeper ? "mb-4" : "mb-7"
                      } border-b border-blue-400 pb-4`}
                    >
                      <h3 className="text-xl font-bold text-blue-900">
                        Filters
                      </h3>
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() => {
                            if (
                              location.pathname.includes("/search/category")
                            ) {
                              setInitialFilters({
                                ...initialFilters,
                                min_rating: "",
                                max_rating: "",
                                min_comments: "",
                                max_comments: "",
                                min_price: "",
                                max_price: "",
                                storekeeper: "",
                              });
                            } else if (
                              location.pathname.includes("/search/storekeeper")
                            ) {
                              setInitialFilters({
                                ...initialFilters,
                                min_rating: "",
                                max_rating: "",
                                min_comments: "",
                                max_comments: "",
                                min_price: "",
                                max_price: "",
                                category: null,
                              });
                            } else {
                              setInitialFilters({
                                min_rating: "",
                                max_rating: "",
                                min_comments: "",
                                max_comments: "",
                                min_price: "",
                                max_price: "",
                                storekeeper: "",
                                category: null,
                              });
                            }

                            submitForm();
                          }}
                          className="text-sm cursor-pointer text-blue-600 hover:text-cyan-600 mr-3 transition-colors duration-300 mt-1"
                        >
                          Reset
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsOpen(false)}
                          className="xl:hidden text-blue-800 hover:text-blue-600"
                        >
                          <span className="cursor-pointer hover:text-red-500 transition-colors duration-300">
                            <FiX size={20} className="mt-0.5" />
                          </span>
                        </button>
                      </div>
                    </div>

                    {initialFilters.storekeeper && (
                      <div className="mb-4 p-3 rounded-lg bg-blue-100 border border-blue-300 text-blue-800 text-sm flex items-center justify-between">
                        <span>
                          viewing{" "}
                          <span className="font-semibold">
                            {storekeeperInfo.store_name}
                          </span>{" "}
                          Store products
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setInitialFilters({
                              ...initialFilters,
                              storekeeper: "",
                            });

                            navigate("/search");
                          }}
                          className="text-red-600 hover:text-red-800 "
                        >
                          exit
                        </button>
                      </div>
                    )}

                    <div className="space-y-7">
                      <div className="border-b border-blue-400 pb-4">
                        <div
                          onClick={() =>
                            setOpen((prev) => {
                              return "Price Range" == prev ? "" : "Price Range";
                            })
                          }
                          className="flex cursor-pointer items-center mb-3 text-blue-800"
                        >
                          <FiDollarSign className="text-green-500 mb-0.5" />
                          <h3 className="font-semibold ml-2">Price Range</h3>

                          {(values.min_price || values.max_price) && (
                            <span className="ml-2 w-2 h-2 rounded-full bg-green-500" />
                          )}

                          <FiChevronDown
                            className={`ml-2 transform ${
                              open == "Price Range" ? "rotate-180" : ""
                            } transition-transform duration-300`}
                            size={17}
                          />
                        </div>
                        {open == "Price Range" && (
                          <PriceFilter
                            minMaxPrice={minMaxPrice}
                            values={values}
                            setFieldValue={setFieldValue}
                          />
                        )}
                      </div>

                      <div className="border-b border-blue-400 pb-4">
                        <div
                          onClick={() =>
                            setOpen((prev) => {
                              return "Categories" == prev ? "" : "Categories";
                            })
                          }
                          className="flex cursor-pointer items-center mb-3 text-blue-800"
                        >
                          <BiCategory
                            className="text-purple-500 mb-0.5"
                            size={17}
                          />
                          <h3 className="font-semibold ml-2">Categories</h3>

                          {initialFilters.category && (
                            <span className="ml-2 w-2 h-2 rounded-full bg-purple-500" />
                          )}

                          <FiChevronDown
                            className={`ml-2 transform ${
                              open == "Categories" ? "rotate-180" : ""
                            } transition-transform duration-300`}
                            size={17}
                          />
                        </div>
                        {open == "Categories" && (
                          <CategoryFilter
                            selectedCategory={
                              values.category
                                ? values.category
                                : initialFilters.category
                            }
                            onSelect={(cat) => setFieldValue("category", cat)}
                          />
                        )}
                      </div>

                      <div className="border-b border-blue-400 pb-4">
                        <div
                          onClick={() =>
                            setOpen((prev) => {
                              return "Rating" == prev ? "" : "Rating";
                            })
                          }
                          className="flex cursor-pointer items-center mb-3 text-blue-800"
                        >
                          <FiStar className="text-amber-500 mb-0.5" />
                          <h3 className="font-semibold ml-2">Rating</h3>

                          {(values.min_rating || values.max_rating) && (
                            <span className="ml-2 w-2 h-2 rounded-full bg-amber-500" />
                          )}

                          <FiChevronDown
                            className={`ml-2 transform ${
                              open == "Rating" ? "rotate-180" : ""
                            } transition-transform duration-300`}
                            size={17}
                          />
                        </div>
                        {open == "Rating" && (
                          <RatingFilter
                            values={values}
                            setFieldValue={setFieldValue}
                          />
                        )}
                      </div>

                      <div className="border-b border-blue-400 pb-4">
                        <div
                          onClick={() =>
                            setOpen((prev) => {
                              return "Reviews" == prev ? "" : "Reviews";
                            })
                          }
                          className="flex cursor-pointer items-center mb-3 text-blue-800"
                        >
                          <FiMessageSquare className="text-blue-500 mb-0.25" />
                          <h3 className="font-semibold ml-2">Reviews</h3>

                          {(values.min_comments || values.max_comments) && (
                            <span className="ml-2 w-2 h-2 rounded-full bg-blue-500" />
                          )}

                          <FiChevronDown
                            className={`ml-2 transform ${
                              open == "Reviews" ? "rotate-180" : ""
                            } transition-transform duration-300`}
                            size={17}
                          />
                        </div>
                        {open == "Reviews" && (
                          <ReviewsFiltre
                            values={values}
                            minMaxComments={minMaxComments}
                            setFieldValue={setFieldValue}
                          />
                        )}
                      </div>
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="w-full mt-4 py-3 cursor-pointer bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg transition-colors duration-300 font-medium "
                      >
                        Apply
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SearchFilters;
