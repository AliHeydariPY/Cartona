import { motion } from "framer-motion";

import { useState, useEffect } from "react";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { productFormSchema } from "../../validations/productForm";

import {
  addNewProduct,
  getCollections,
  getMainCategories,
  getSubCategories,
} from "../../services/productAPIServices";

import { BiCategory } from "react-icons/bi";
import {
  FiPlusCircle,
  FiImage,
  FiTag,
  FiDollarSign,
  FiAlignLeft,
  FiLayers,
  FiTrash2,
  FiClock,
  FiPercent,
  FiZap,
  FiChevronDown,
  FiChevronLeft,
} from "react-icons/fi";
import { BiCollection } from "react-icons/bi";

import { successToast } from "../../utils/toast";
import CreateCollectionPopup from "../../components/pop-ups/CreateCollectionPopup";
import { useAtom } from "jotai";
import { userAtom } from "../../atoms/userAtom";

const AddProduct = () => {
  const [user] = useAtom(userAtom);

  const [image, setImage] = useState({});
  const [hasDiscount, setHasDiscount] = useState(false);
  const [isAmazingOffer, setIsAmazingOffer] = useState(false);

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [collections, setCollections] = useState([]);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState();

  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);

  useEffect(() => {
    getMainCategories().then((res) => {
      setMainCategories(res.data);
    });
    if (!user) return;
    getCollections().then((res) => {
      setCollections(() =>
        res.data.filter(
          (collection) => collection.storekeeper == user.storekeeper_id
        )
      );
    });
  }, [user]);

  useEffect(() => {
    if (!selectedMainCategory) return;

    const fetchSubCategories = async () => {
      const categories = await getSubCategories(selectedMainCategory.id);
      setSubCategories(categories.data);
    };

    fetchSubCategories();
  }, [selectedMainCategory]);

  const handleImageUpload = (e, slot) => {
    const file = e.target.files[0];
    if (file) {
      setImage((prev) => ({ ...prev, [slot]: file }));
    }
  };

  const handleRemoveImage = (slot) => {
    setImage((prev) => {
      const newImages = { ...prev };
      delete newImages[slot];
      return newImages;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="lg:col-span-3"
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl p-5 sm:p-6 2xl:p-8 border border-blue-400 hover:shadow-lg hover:shadow-blue-400/50 transition-all duration-300">
        <h2 className="text-xl sm:text-2xl font-bold text-blue-800 mb-6 sm:mb-8 flex items-center">
          <FiPlusCircle className="mr-2 sm:mr-3 text-green-500" size={24} />
          Add New Product
        </h2>

        <Formik
          initialValues={{
            image: null,
            name: "",
            category: "",
            price: "",
            stock_quantity: "",
            discounted_price: "",
            discount_percentage: "",
            discount_period: "",
            amazing_offer: "",
            amazing_offer_period: "",
            collection: "",
            description: "",
          }}
          validationSchema={productFormSchema}
          onSubmit={(values, onSubmitProps) => {
            const formData = new FormData();
            formData.append("image", values.image);
            formData.append("name", values.name);
            formData.append("category", Number(selectedCategory.id));
            formData.append("price", values.price);
            formData.append("stock_quantity", values.stock_quantity);
            formData.append("discounted_price", values.discounted_price);
            formData.append("discount_percentage", values.discount_percentage);
            formData.append("discount_period", values.discount_period);
            formData.append("amazing_offer", values.amazing_offer);
            formData.append(
              "amazing_offer_period",
              values.amazing_offer_period
            );
            formData.append("collection", values.collection);
            formData.append("description", values.description);

            const response = addNewProduct(formData, onSubmitProps, setImage);

            response.then(() => {
              onSubmitProps.resetForm();
              setImage({});
              setSelectedCategory(null);
              setSelectedCollection(null);
              successToast("Product added successfully");
            });
          }}
        >
          {({ setFieldValue }) => (
            <Form className="space-y-6 px-0.5">
              {/* Product Image */}
              <div className="space-y-2">
                <label className="flex items-center text-blue-800 font-medium">
                  <FiImage className="mr-2 mb-0.5" /> Product Image*
                </label>

                <div className="relative group w-24 h-24 xl:w-28 xl:h-28">
                  <label
                    className={`block w-full h-full ${
                      !image[0]
                        ? "border-2 border-dashed border-blue-400 cursor-pointer"
                        : "border border-blue-200"
                    } rounded-lg flex items-center justify-center overflow-hidden hover:bg-blue-50 transition-colors duration-300`}
                  >
                    {image[0] ? (
                      <>
                        <img
                          src={URL.createObjectURL(image[0])}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage(0);
                          }}
                        >
                          <FiTrash2 size={12} />
                        </button>
                      </>
                    ) : (
                      <>
                        <FiPlusCircle
                          className="text-blue-500 group-hover:text-blue-700 transition-colors duration-300"
                          size={28}
                        />
                        <input
                          id="image"
                          name="image"
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            handleImageUpload(event, 0);
                            setFieldValue(
                              "image",
                              event.currentTarget.files[0]
                            );
                          }}
                          className="hidden"
                        />
                      </>
                    )}
                  </label>
                </div>
                <ErrorMessage
                  name="image"
                  component="div"
                  className="text-red-500 text-sm ml-0.5 mt-2"
                />
              </div>

              {/* Product Name */}
              <div className="space-y-2">
                <label className="flex items-center text-blue-800 font-medium">
                  <FiTag className="mr-2" /> Product Name*
                </label>
                <Field
                  name="name"
                  type="text"
                  className="w-full px-4 py-3 text-blue-800 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="Enter product name"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm ml-0.5"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="flex items-center text-blue-800 font-medium">
                  <BiCategory size={18} className="mr-2" /> Category*
                </label>

                <Field
                  type="hidden"
                  name="category"
                  value={selectedCategory?.id || ""}
                />

                <div className="relative group w-full">
                  <button
                    type="button"
                    className="flex justify-between w-full items-center bg-white border border-blue-300 rounded-lg px-4 py-3 text-blue-800 hover:border-blue-400 transition-colors duration-300 text-left"
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  >
                    <span>
                      {selectedCategory
                        ? selectedCategory.name
                        : "Select a category"}
                    </span>
                    <FiChevronDown
                      className={`ml-2 transform ${
                        isCategoryOpen ? "rotate-180" : ""
                      } transition-transform duration-300`}
                      size={16}
                    />
                  </button>

                  {isCategoryOpen && (
                    <div className="absolute w-full z-20 mt-1 bg-white rounded-lg shadow-xl border border-blue-200 max-h-64 overflow-y-auto">
                      {!selectedMainCategory &&
                        mainCategories.reverse().map((category) => (
                          <button
                            key={category.id}
                            type="button"
                            className="w-full cursor-pointer text-left px-4 py-2 hover:bg-blue-50 text-blue-800 transition-colors duration-200"
                            onClick={() => setSelectedMainCategory(category)}
                          >
                            {category.name}
                          </button>
                        ))}

                      {selectedMainCategory && (
                        <>
                          <div className="flex items-center px-4 py-2 border-b border-blue-100">
                            <button
                              type="button"
                              onClick={() => setSelectedMainCategory(null)}
                              className="flex items-center cursor-pointer text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <FiChevronLeft className="mr-1 mb-0.5 " /> Back
                            </button>
                            <span className="ml-2 font-semibold text-blue-700">
                              {selectedMainCategory.name}
                            </span>
                          </div>
                          {subCategories.map((sub) => (
                            <button
                              key={sub.id}
                              type="button"
                              className="w-full cursor-pointer text-left px-4 py-2 hover:bg-blue-50 text-blue-800 transition-colors duration-200"
                              onClick={() => {
                                setSelectedCategory(sub);
                                setFieldValue("category", sub.id);
                                setIsCategoryOpen(false);
                                setSelectedMainCategory(null);
                              }}
                            >
                              {sub.name}
                            </button>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>

                <ErrorMessage
                  name="category"
                  component="div"
                  className="text-red-500 text-sm mt-1 ml-0.5"
                />
              </div>

              {/* Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center text-blue-800 font-medium">
                    <FiDollarSign className="mr-2" /> Price*
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-blue-500">
                      $
                    </span>
                    <Field
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-full pl-8.5 text-blue-800 pr-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                  <ErrorMessage
                    name="price"
                    component="div"
                    className="text-red-500 text-sm ml-0.5"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-blue-800 font-medium">
                    <FiLayers className="mr-2" /> Stock Quantity*
                  </label>
                  <Field
                    name="stock_quantity"
                    type="number"
                    min="0"
                    className="w-full px-4 py-3 text-blue-800 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    placeholder="100"
                  />
                  <ErrorMessage
                    name="stock_quantity"
                    component="div"
                    className="text-red-500 text-sm ml-0.5"
                  />
                </div>
              </div>

              {/* Discount */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center text-blue-800 font-medium">
                    <FiPercent className="mr-2" /> Discount
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={hasDiscount}
                      onChange={() => {
                        if (hasDiscount) {
                          setFieldValue("discountPrice", "");
                          setFieldValue("discountPercentage", "");
                          setFieldValue("discountPeriod", "");
                        }
                        setHasDiscount(!hasDiscount);
                      }}
                    />
                    <div className="relative w-11 h-6 text-blue-800 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                {hasDiscount && (
                  <>
                    <div>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-blue-500">
                          $
                        </span>
                        <Field
                          name="discounted_price"
                          type="number"
                          step="0.01"
                          min="0"
                          className="w-full pl-8.5 text-blue-800 pr-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                          placeholder="Discounted price"
                        />
                      </div>
                      <ErrorMessage
                        name="discounted_price"
                        component="div"
                        className="text-red-500 text-sm ml-0.5 mt-2"
                      />
                    </div>
                    <div className="space-y-2 sm:flex sm:space-x-6">
                      <div className="sm:flex-1">
                        <Field
                          name="discount_percentage"
                          type="number"
                          step="1"
                          min="0"
                          max="100"
                          className="w-full pl-4 text-blue-800 pr-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                          placeholder="Discount %"
                        />
                        <ErrorMessage
                          name="discount_percentage"
                          component="div"
                          className="text-red-500 text-sm ml-0.5 mt-2"
                        />
                      </div>
                      <div className="sm:flex-1">
                        <div className="relative">
                          <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                          <Field
                            name="discount_period"
                            type="text"
                            className="w-full pl-9 text-blue-800 pr-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                            placeholder="Period"
                            onFocus={(e) => (e.target.type = "date")}
                            onBlur={(e) => (e.target.type = "text")}
                          />
                        </div>
                        <ErrorMessage
                          name="discount_period"
                          component="div"
                          className="text-red-500 text-sm ml-0.5 mt-2"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Amazing Offer */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center text-blue-800 font-medium">
                    <FiZap className="mr-2 text-amber-500" /> Amazing Offer
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer text-blue-800"
                      checked={isAmazingOffer}
                      onChange={() => {
                        if (isAmazingOffer) {
                          setFieldValue("amazingOffer", "");
                          setFieldValue("amazingOfferPeriod", "");
                        }
                        setIsAmazingOffer(!isAmazingOffer);
                      }}
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                {isAmazingOffer && (
                  <div className="space-y-2 sm:space-y-0 grid grid-cols-1 md:grid-cols-2 sm:gap-6">
                    <div>
                      <Field
                        name="amazing_offer"
                        type="text"
                        className="w-full px-4 py-3 text-blue-800 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                        placeholder="Offer title"
                      />
                      <ErrorMessage
                        name="amazing_offer"
                        component="div"
                        className="text-red-500 text-sm ml-0.5 mt-2"
                      />
                    </div>
                    <div>
                      <div className="relative">
                        <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                        <Field
                          name="amazing_offer_period"
                          type="text"
                          className="w-full pl-10 pr-4 py-3 text-blue-800 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                          placeholder="Offer period"
                          onFocus={(e) => (e.target.type = "date")}
                          onBlur={(e) => (e.target.type = "text")}
                        />
                      </div>
                      <ErrorMessage
                        name="amazing_offer_period"
                        component="div"
                        className="text-red-500 text-sm ml-0.5 mt-2"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Collection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center text-blue-800 font-medium">
                    <BiCollection className="mr-2" /> Collection
                  </label>

                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isCollectionOpen}
                      onChange={() => {
                        if (isCollectionOpen) {
                          setSelectedCollection(null);
                          setFieldValue("collection", "");
                        }
                        setIsCollectionOpen(!isCollectionOpen);
                      }}
                    />

                    <div
                      className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full 
                      peer peer-checked:bg-blue-500
                      peer-checked:after:translate-x-full
                      after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                      after:bg-white after:border-gray-300 after:border 
                      after:rounded-full after:h-5 after:w-5 after:transition-all"
                    ></div>
                  </label>
                </div>

                <Field
                  type="hidden"
                  name="collection"
                  value={selectedCollection?.id || ""}
                />

                {isCollectionOpen && (
                  <div className="relative">
                    <button
                      type="button"
                      className="flex justify-between w-full items-center bg-white border border-blue-300 
                   rounded-lg px-4 py-3 text-blue-800 hover:border-blue-400 
                   transition-colors duration-300"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <span>
                        {selectedCollection
                          ? selectedCollection.collection_name
                          : "Select collection"}
                      </span>

                      <FiChevronDown
                        className={`ml-2 transform ${
                          isDropdownOpen ? "rotate-180" : ""
                        } transition-transform duration-300`}
                        size={16}
                      />
                    </button>

                    {isDropdownOpen && (
                      <div
                        className="absolute w-full z-20 mt-1 bg-white rounded-lg shadow-xl border border-blue-200 
                        max-h-64 overflow-y-auto"
                      >
                        <button
                          type="button"
                          className="w-full text-left px-4 py-2 cursor-pointer bg-blue-50 hover:bg-blue-100
      text-blue-700 font-medium transition-colors duration-200 border-b border-blue-200"
                          onClick={() => setIsCreatePopupOpen(true)}
                        >
                          + Create new collection
                        </button>
                        {collections.map((col) => (
                          <button
                            key={col.id}
                            type="button"
                            className="w-full text-left px-4 py-2 cursor-pointer hover:bg-blue-50 text-blue-800 transition-colors duration-200"
                            onClick={() => {
                              setSelectedCollection(col);
                              setFieldValue("collection", col.id);
                              setIsDropdownOpen(false);
                            }}
                          >
                            {col.collection_name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {isCreatePopupOpen && (
                <CreateCollectionPopup
                  onClose={() => setIsCreatePopupOpen(false)}
                  setCollections={setCollections}
                  setSelectedCollection={setSelectedCollection}
                  setFieldValue={setFieldValue}
                />
              )}

              {/* Description */}
              <div className="space-y-2">
                <label className="flex items-center text-blue-800 font-medium">
                  <FiAlignLeft className="mr-2" /> Description*
                </label>
                <Field
                  name="description"
                  as="textarea"
                  rows={6}
                  className="w-full px-4 py-3 text-blue-800 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="Detailed product description..."
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm ml-0.5"
                />
              </div>

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 cursor-pointer bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg hover:shadow-lg transition-colors duration-300 font-medium flex items-center justify-center"
                >
                  <FiPlusCircle className="mr-2 mb-0.5" size={18} />
                  Publish Product
                </button>
                <button
                  type="reset"
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedCollection(null);
                    setImage({});
                  }}
                  className="px-6 py-3 cursor-pointer bg-white border border-rose-400 text-rose-700 rounded-lg hover:bg-rose-50 transition-colors duration-300 sm:ml-auto"
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </motion.div>
  );
};

export default AddProduct;
