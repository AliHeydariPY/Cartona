import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { useNavigate, useParams } from "react-router-dom";

import { BiCategory } from "react-icons/bi";

import {
  FiFilter,
  FiX,
  FiChevronDown,
  FiStar,
  FiDollarSign,
  FiMessageSquare,
} from "react-icons/fi";

import CategoryFilter from "./filters/CategoryFilter";
import PriceFilter from "./filters/PriceFilter";
import RatingFilter from "./filters/RatingFilter";
import ReviewsFiltre from "./filters/ReviewsFiltre";
import useSearchFilterData from "../hooks/useSearchFilterData";

const SearchFilters = () => {
  const navigate = useNavigate();
  const { query } = useParams();
  const {
    params,
    initialFilters,
    setInitialFilters,
    isReady,
    storekeeperInfo,
    minMaxPrice,
    minMaxComments,
  } = useSearchFilterData(query);

  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);

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
      <>
        <div className="xl:hidden">
          <div className="w-24 bg-white/80 backdrop-blur-lg rounded-lg p-2 border border-white/30 shadow-lg">
            <div className="w-20 animate-pulse">
              <div className="h-7 bg-blue-200  rounded"></div>
            </div>
          </div>
        </div>
        <div className="hidden xl:block mb-6 col-span-2 2xl:col-span-1">
          <div className="w-full bg-white/80 backdrop-blur-lg rounded-2xl p-4 border border-white/30 shadow-lg">
            <div className="animate-pulse">
              <div className="h-6 bg-blue-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-blue-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-blue-200 rounded w-2/3 mb-6"></div>
              <div className="h-10 bg-blue-200 rounded"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!minMaxPrice[0]) return;

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

          if (cat.id) {
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
            url = buildUrl({ ...values, storekeeper: "", category: "" });
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
                                category: "",
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
                                category: "",
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

                          {values.min_price &&
                            values.max_price &&
                            (values.min_price !=
                              minMaxPrice[0]?.split(".")[0] ||
                              values.max_price !=
                                Number(minMaxPrice[1].split(".")[0]) + 1) && (
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

                          {values.min_comments || values.max_comments ? (
                            <span className="ml-2 w-2 h-2 rounded-full bg-blue-500" />
                          ) : null}

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
