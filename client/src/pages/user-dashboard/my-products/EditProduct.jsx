import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { productFormSchema } from "../../../validations/productForm";

import {
  FiTag,
  FiImage,
  FiDollarSign,
  FiLayers,
  FiPercent,
  FiClock,
  FiZap,
  FiAlignLeft,
  FiChevronDown,
  FiSave,
  FiChevronLeft,
  FiEdit,
  FiPlusCircle,
  FiTrash2,
} from "react-icons/fi";
import { BiCategory } from "react-icons/bi";

import { FaArrowLeft } from "react-icons/fa6";

import {
  getMainCategories,
  getSubCategories,
  getProduct,
  getCategory,
  editProduct,
} from "../../../services/productAPIServices";

// همون StoreSchema که ساختی:
// import { StoreSchema } from "./validationSchema";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [image, setImage] = useState([]);
  const [firstImage, setFirstImage] = useState(true);
  const [hasDiscount, setHasDiscount] = useState();
  const [isAmazingOffer, setIsAmazingOffer] = useState();

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const selectedProduct = await getProduct(id);
      setProduct(selectedProduct.data);
      console.log(selectedProduct.data);
      if (selectedProduct.data.discount_period) {
        setHasDiscount(true);
      } else {
        setHasDiscount(false);
      }
      if (selectedProduct.data.amazing_offer_period) {
        setIsAmazingOffer(true);
      } else {
        setIsAmazingOffer(false);
      }

      const category = await getCategory(selectedProduct.data.category);
      setSelectedCategory(category.data);
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!selectedMainCategory) return;

    const fetchSubCategories = async () => {
      const categories = await getSubCategories(selectedMainCategory.id);
      setSubCategories(categories.data);
    };

    fetchSubCategories();
  }, [selectedMainCategory]);

  useEffect(() => {
    if (!product) return;
    if (product.image) {
      setImage([product.image]);
    }
  }, [product]);

  useEffect(() => {
    getMainCategories().then((res) => {
      setMainCategories(res.data);
    });
  }, []);

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
    setFirstImage(false);
  };

  if (!product) return <p>Loading...</p>;

  const initialValues = {
    id: id,
    image: image[0] || null,
    name: product.name || "",
    price: product.price || "",
    stock_quantity: product.stock_quantity || "",
    description: product.description || "",
    discounted_price: product.discounted_price || "",
    discount_percentage: product.discount_percentage || "",
    discount_period: product.discount_period
      ? new Date(product.discount_period).toISOString().split("T")[0]
      : "",
    amazing_offer: product.amazing_offer || "",
    amazing_offer_period: product.amazing_offer_period
      ? new Date(product.amazing_offer_period).toISOString().split("T")[0]
      : "",
    images_set: product.images_set || [],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="lg:col-span-3"
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl p-5 sm:p-6 2xl:p-8 border border-blue-400 hover:shadow-lg hover:shadow-blue-400/50 transition-all duration-300">
        <div className="flex items-center gap-y-2 flex-wrap-reverse justify-between mb-4 sm:mb-6">
          <div className="flex items-center">
            <span>
              <FiEdit className="text-blue-700 mr-1 sm:mr-3" size={24} />
            </span>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-800">
              Edit Product
            </h2>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center cursor-pointer sm:mb-0 gap-2 px-3 sm:px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors duration-300 text-sm sm:text-base"
          >
            <FaArrowLeft />
            Back
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={productFormSchema}
          enableReinitialize
          onSubmit={(values, onSubmitProps) => {
            const formData = new FormData();

            formData.append("id", id);
            if (image[0].name) {
              formData.append("image", values.image);
            }
            formData.append(
              "storekeeper",
              Number(localStorage.getItem("storekeeperID"))
            );
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
            formData.append("description", values.description);
            formData.append("images_set", values.images_set);
            console.log(values.images_set);

            console.log(Object.fromEntries(formData.entries()));

            editProduct(formData)
              .then((res) => {
                console.log("res", res);
              })
              .catch((err) => {
                console.log("err", err);
              });
          }}
        >
          {({ setFieldValue }) => (
            <Form className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center text-blue-800 font-medium">
                  <FiImage className="mr-2" /> Product Image
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
                          src={
                            firstImage
                              ? image[0]
                              : URL.createObjectURL(image[0])
                          }
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

              <div className="space-y-2">
                <label className="flex items-center text-blue-800 font-medium">
                  <FiTag className="mr-2" /> Product Name*
                </label>
                <Field
                  name="name"
                  type="text"
                  className="w-full px-4 py-3 text-blue-800 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="Product title"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm ml-0.5"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-blue-800 font-medium">
                  <BiCategory size={18} className="mr-2" /> Category*
                </label>

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
              </div>

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
                          setFieldValue("discounted_price", "");
                          setFieldValue("discount_percentage", "");
                          setFieldValue("discount_period", "");
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
                          setFieldValue("amazing_offer", "");
                          setFieldValue("amazing_offer_period", "");
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
                  className="px-6 py-3 cursor-pointer bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white rounded-lg hover:shadow-lg transition-colors duration-300 font-medium flex items-center justify-center"
                >
                  <FiSave className="mr-2 mb-0.5" size={18} />
                  Update Product
                </button>
                <button
                  type="reset"
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

export default EditProduct;
