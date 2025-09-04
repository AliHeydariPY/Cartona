import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Range, getTrackBackground } from "react-range";
import { Formik, Form, Field } from "formik";

import CategoryFilter from "./filters/CategoryFilter";

import { BiCategory } from "react-icons/bi";
import { MdStorefront } from "react-icons/md";
import {
  FiFilter,
  FiX,
  FiChevronDown,
  FiStar,
  FiDollarSign,
  FiMessageSquare,
} from "react-icons/fi";

import { useNavigate, useParams } from "react-router-dom";

import { getCategory } from "../services/productAPIServices";
import { getShopkeeper } from "../services/userAPIServices";

const SearchFilters = () => {
  const navigate = useNavigate();
  const { query } = useParams();
  const [isOpen, setIsOpen] = useState(false);
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
  const params = new URLSearchParams(query);
  const [open, setOpen] = useState(false);
  const [storekeeperInfo, setStorekeeperInfo] = useState();

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
    const newFilters = { ...initialFilters };

    Object.keys(initialFilters).forEach((filter) => {
      if (params.has(filter)) {
        const value = params.get(filter);

        if (filter == "category") {
          getCategory(value).then((res) => {
            newFilters[filter] = res.data;
          });
        } else {
          newFilters[filter] = isNaN(value) ? value : Number(value);
        }
      } else {
        newFilters[filter] = "";
      }
    });

    if (newFilters.storekeeper) {
      getShopkeeper(newFilters.storekeeper).then((res) => {
        setStorekeeperInfo(res.data);
      });
    } else {
      setStorekeeperInfo(true);
    }

    console.log(newFilters);
    setInitialFilters(newFilters);
    setIsReady(true);
  }, [query]);

  const buildUrl = (values) => {
    const filtersName = Object.keys(filters);
    let url =
      query.search("&") === -1 ? query : query.slice(0, query.search("&"));
    filtersName.forEach((filterName) => {
      if (values[filterName]) {
        url += `&${filterName}=${values[filterName]}`;
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
      {/* دکمه باز کردن فیلترها در موبایل */}
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
                url = buildUrl({ ...values, category: "" });
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
                    {/* هدر فیلترها */}
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

                    {(initialFilters.category && location.pathname.includes("/search/category")) && (
                      <div className="mb-4 p-3 rounded-lg bg-blue-100 border border-blue-300 text-blue-800 text-sm flex items-center justify-between">
                        <span>
                          viewing products in the{" "}
                          <span className="font-semibold">
                            {initialFilters.category.name}
                          </span>{" "}
                          category
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
                      {/* price */}
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
                          <div className=" py-1">
                            <Range
                              step={5}
                              min={0}
                              max={1000}
                              values={[
                                Number(values.min_price) || 0,
                                Number(values.max_price) || 1000,
                              ]}
                              onChange={(rangeVals) => {
                                setFieldValue("min_price", rangeVals[0]);
                                setFieldValue("max_price", rangeVals[1]);
                              }}
                              renderTrack={({ props, children }) => {
                                const { key, ...rest } = props;
                                return (
                                  <div
                                    key={key}
                                    {...rest}
                                    className="h-2 mx-3 bg-blue-200 rounded-full cursor-pointer"
                                    style={{
                                      background: getTrackBackground({
                                        values: [
                                          values.min_price || 0,
                                          values.max_price || 1000,
                                        ],
                                        colors: [
                                          "#c6dbfa",
                                          "#3b82f6",
                                          "#c6dbfa",
                                        ],
                                        min: 0,
                                        max: 1000,
                                      }),
                                    }}
                                  >
                                    {children}
                                  </div>
                                );
                              }}
                              renderThumb={({ props }) => {
                                const { key, ...rest } = props;
                                return (
                                  <div
                                    key={key}
                                    {...rest}
                                    className="w-5 h-5 bg-blue-500 rounded-full shadow-md cursor-grab focus:outline-none"
                                  />
                                );
                              }}
                            />
                            <div className="flex justify-between text-sm text-blue-800 mt-3 ">
                              <div>
                                $
                                <Field
                                  type="number"
                                  name="min_price"
                                  className="w-15 p-0.5 placeholder:text-blue-800 rounded-lg focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  placeholder="0"
                                />
                              </div>
                              <div>
                                $
                                <Field
                                  type="number"
                                  name="max_price"
                                  className="w-10 p-0.5 placeholder:text-blue-800 rounded-lg focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  placeholder="1000"
                                />
                              </div>
                              {/* <span>${values.min_price || 0}</span> */}
                              {/* <span>${values.max_price || 1000}</span> */}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* categories */}
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

                      {/* Rating */}
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
                          <div className="space-y-4">
                            {/* Maximum Rating */}
                            <div>
                              <label className="block text-sm text-blue-700 mb-2">
                                Maximum Rating
                              </label>
                              <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => {
                                      if (star >= values.min_rating) {
                                        setFieldValue("max_rating", star);
                                      }
                                    }}
                                    className={`p-1 rounded-full transition-all duration-200 ${
                                      values.max_rating >= star
                                        ? "bg-amber-100 scale-110"
                                        : "bg-blue-50 hover:bg-blue-100"
                                    }`}
                                  >
                                    <FiStar
                                      className={`text-xl ${
                                        values.max_rating >= star
                                          ? "text-amber-400 fill-amber-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                              <div className="text-xs text-blue-600 mt-1">
                                {values.max_rating
                                  ? `Up to ${values.max_rating} Stars`
                                  : "Any rating"}
                              </div>
                            </div>

                            {/* Minimum Rating */}
                            <div>
                              <label className="block text-sm text-blue-700 mb-2">
                                Minimum Rating
                              </label>
                              <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => {
                                      if (star <= values.max_rating) {
                                        setFieldValue("min_rating", star);
                                      }
                                    }}
                                    className={`p-1 rounded-full transition-all duration-200 ${
                                      values.min_rating >= star
                                        ? "bg-amber-100 scale-110"
                                        : "bg-blue-50 hover:bg-blue-100"
                                    }`}
                                  >
                                    <FiStar
                                      className={`text-xl ${
                                        values.min_rating >= star
                                          ? "text-amber-400 fill-amber-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                              <div className="text-xs text-blue-600 mt-1">
                                {values.min_rating
                                  ? `${values.min_rating}+ Stars`
                                  : "Any rating"}
                              </div>
                            </div>

                            {/* Reset Rating Button */}
                            {(values.min_rating || values.max_rating) && (
                              <button
                                type="button"
                                onClick={() => {
                                  setFieldValue("min_rating", "");
                                  setFieldValue("max_rating", "");
                                }}
                                className="text-xs text-blue-600 hover:text-cyan-500 transition-colors duration-200"
                              >
                                Clear rating filters
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* reviews */}
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
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm text-blue-700 mb-1">
                                Min Reviews
                              </label>
                              <Field
                                type="number"
                                name="min_comments"
                                className="w-full p-2 ring ring-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="0"
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-blue-700 mb-1">
                                Max Reviews
                              </label>
                              <Field
                                type="number"
                                name="max_comments"
                                className="w-full p-2 ring ring-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="1000"
                              />
                            </div>
                          </div>
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
