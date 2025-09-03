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

import { searchProduct, getCategory } from "../services/productAPIServices";

const SearchFilters = ({ setProducts }) => {
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

  const [open, setOpen] = useState(false);

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
    console.log(query);
    const params = new URLSearchParams(query);
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
    setInitialFilters(newFilters);
    setIsReady(true);
  }, [query]);

  const FilterSection = ({ title, icon, children }) => (
    <div className="border-b border-blue-400 pb-4">
      <div
        onClick={() =>
          setOpen((prev) => {
            return title == prev ? "" : title;
          })
        }
        className="flex cursor-pointer items-center mb-3 text-blue-800"
      >
        {icon}
        <h3 className="font-semibold ml-2">{title}</h3>
        <FiChevronDown
          className={`ml-2 transform ${
            open == title ? "rotate-180" : ""
          } transition-transform duration-300`}
          size={17}
        />
      </div>

      {open == title && children}
    </div>
  );

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

  if (!isReady) {
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
    <div className="mb-6 col-span-2 2xl:col-span-1">
      {/* دکمه باز کردن فیلترها در موبایل */}
      <div className="flex w-full justify-between items-center mb-4 xl:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          <FiFilter className="mr-2" />
          Filters
        </button>
      </div>

      <Formik
        initialValues={initialFilters}
        enableReinitialize
        onSubmit={(values) => {
          const cat = values.category
            ? values.category.id
            : initialFilters.category.id;
          const url = buildUrl({ ...values, category: cat });
          navigate(`/search/${url}`);
        }}
      >
        {({ values, setFieldValue, resetForm }) => (
          <Form>
            <div className=" flex-col lg:flex-row gap-6">
              <AnimatePresence>
                {(isOpen || window.innerWidth >= 1280) && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl border border-blue-200/50 hover:border-blue-300 transition-all duration-300 p-4 xl:sticky xl:top-24"
                  >
                    {/* هدر فیلترها */}
                    <div className="flex justify-between items-center mb-7 border-b border-blue-400 pb-4">
                      <h3 className="text-xl font-bold text-blue-900">
                        Filters
                      </h3>
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() => resetForm()}
                          className="text-sm text-blue-600 hover:text-cyan-500 mr-3 transition-colors duration-200 mt-1"
                        >
                          Reset
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsOpen(false)}
                          className="xl:hidden text-blue-800 hover:text-blue-600"
                        >
                          <FiX size={20} className="mt-0.5" />
                        </button>
                      </div>
                    </div>

                    {/* دسته‌بندی فیلترها */}
                    <div className="space-y-7 max-h-[70vh] overflow-y-auto ">
                      {/* فیلتر قیمت */}
                      <FilterSection
                        title="Price Range"
                        icon={
                          <FiDollarSign className="text-green-500 mb-0.5" />
                        }
                      >
                        <div className="px-3 py-1">
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
                                  className="h-2 bg-blue-200 rounded-full cursor-pointer"
                                  style={{
                                    background: getTrackBackground({
                                      values: [
                                        values.min_price || 0,
                                        values.max_price || 1000,
                                      ],
                                      colors: ["#c6dbfa", "#3b82f6", "#c6dbfa"],
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
                          <div className="flex justify-between text-sm text-blue-800 mt-2">
                            <span>${values.min_price || 0}</span>
                            <span>${values.max_price || 1000}</span>
                          </div>
                        </div>
                      </FilterSection>

                      {/* <button
                        type="button"
                        className="flex justify-between w-full items-center bg-white border border-blue-300 rounded-lg px-4 py-3 text-blue-800 hover:border-blue-400 transition-colors duration-300 text-left"
                        onClick={() => {}}
                      >
                        <span>
                          {selectedCategory
                            ? selectedCategory.name
                            : "Any"}
                        </span>
                        <FiChevronDown
                          className={`ml-2 transform ${
                            isCategoryOpen ? "rotate-180" : ""
                          } transition-transform duration-300`}
                          size={16}
                        />
                      </button> */}

                      <FilterSection
                        title="Categories"
                        icon={
                          <BiCategory
                            className="text-blue-500 mb-0.5"
                            size={17}
                          />
                        }
                      >
                        <CategoryFilter
                          selectedCategory={
                            values.category
                              ? values.category
                              : initialFilters.category
                          }
                          onSelect={(cat) => setFieldValue("category", cat)}
                        />
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
                            <Field
                              as="select"
                              name="min_rating"
                              className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Any</option>
                              <option value="1">1+ Star</option>
                              <option value="2">2+ Stars</option>
                              <option value="3">3+ Stars</option>
                              <option value="4">4+ Stars</option>
                              <option value="5">5 Stars</option>
                            </Field>
                          </div>
                          <div>
                            <label className="block text-sm text-blue-700 mb-1">
                              Max Rating
                            </label>
                            <Field
                              as="select"
                              name="max_rating"
                              className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Any</option>
                              <option value="1">1 Star</option>
                              <option value="2">2 Stars</option>
                              <option value="3">3 Stars</option>
                              <option value="4">4 Stars</option>
                              <option value="5">5 Stars</option>
                            </Field>
                          </div>
                        </div>
                      </FilterSection>

                      {/* فیلتر تعداد نظرات */}

                      <FilterSection
                        title="Reviews"
                        icon={
                          <FiMessageSquare className="text-blue-500 mb-0.25" />
                        }
                      >
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm text-blue-700 mb-1">
                              Min Reviews
                            </label>
                            <Field
                              type="number"
                              name="min_comments"
                              className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                              className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="1000"
                            />
                          </div>
                        </div>
                      </FilterSection>
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r text-white from-blue-600 to-cyan-500 mt-4 py-2 rounded-lg"
                      >
                        submit
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
