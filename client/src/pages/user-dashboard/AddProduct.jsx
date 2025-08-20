import { motion } from "framer-motion";

import { useState, useEffect } from "react";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import {
  addNewProduct,
  getMainCategories,
  getSubCategories,
} from "../../services/productAPIServices";

import toast from "react-hot-toast";

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
  FiCheckCircle,
  FiChevronLeft,
} from "react-icons/fi";

const AddProduct = () => {
  const [image, setImage] = useState({});
  const [hasDiscount, setHasDiscount] = useState(false);
  const [isAmazingOffer, setIsAmazingOffer] = useState(false);
  // const { setFieldValue } = useFormikContext();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null); // دسته اصلی
  const [selectedCategory, setSelectedCategory] = useState(null); // دسته نهایی (زیرمجموعه یا اصلی)
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    if (!selectedMainCategory) return;

    const fetchSubCategories = async () => {
      const categories = await getSubCategories(selectedMainCategory.id);
      setSubCategories(categories.data);
    };

    fetchSubCategories();
  }, [selectedMainCategory]);

  useEffect(() => {
    getMainCategories().then((res) => {
      console.log(res.data);
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
  };

  const StoreSchema = Yup.object()
    .shape({
      image: Yup.mixed().required("Please select an image"),
      productName: Yup.string()
        .min(3, "at least 3 characters")
        .max(50, "at most 50 characters")
        .required("required"),
      price: Yup.number().required("required"),
      stockQuantity: Yup.string()
        .min(1, "at least 1 characters")
        .max(4, "at most 50 characters")
        .required("required"),
      description: Yup.string()
        .min(3, "at least 3 characters")
        .max(900, "at most 900 characters")
        .required("required"),

      discountPrice: Yup.number()
        .nullable()
        .transform((v, o) => (o === "" ? null : v))
        .min(0, "must not be negative")
        .typeError("Enter a valid number"),
      discountPercentage: Yup.number()
        .nullable()
        .transform((v, o) => (o === "" ? null : v))
        .min(0, "must not be less than 0")
        .max(100, "must not be greater than 100")
        .typeError("Enter a valid number"),
      discountPeriod: Yup.string()
        .nullable()
        .transform((v, o) => (o === "" ? null : v)),

      amazingOffer: Yup.string()
        .nullable()
        .transform((v, o) => (o === "" ? null : v)),
      amazingOfferPeriod: Yup.string()
        .nullable()
        .transform((v, o) => (o === "" ? null : v)),
    })
    // قوانین تخفیف
    .test("discount-rules", null, function (values) {
      const { discountPrice, discountPercentage, discountPeriod } =
        values || {};
      const hasPrice = discountPrice != null && discountPrice !== "";
      const hasPercent =
        discountPercentage != null && discountPercentage !== "";
      const hasPeriod = !!discountPeriod;

      const errors = [];

      // فقط یکی از price/percentage باید پر باشه
      if (hasPrice && hasPercent) {
        errors.push(
          this.createError({
            path: "discountPercentage",
            message:
              "Please enter only one of discount price or discount percentage",
          })
        );
      }

      // اگر یکی پر شد، period اجباریه
      if ((hasPrice || hasPercent) && !hasPeriod) {
        errors.push(
          this.createError({
            path: "discountPeriod",
            message: "When entering a discount, a discount period is required",
          })
        );
      }

      // اگر period پر شد، یکی از price/percentage هم باید پر بشه
      if (hasPeriod && !hasPrice && !hasPercent) {
        const msg =
          "When entering a discount period, also fill in the discount price or discount percentage";
        errors.push(this.createError({ path: "discountPrice", message: msg }));
        errors.push(
          this.createError({ path: "discountPercentage", message: msg })
        );
      }

      return errors.length ? new Yup.ValidationError(errors) : true;
    })
    // قوانین بخش "amazing offer"
    .test("amazing-offer-rules", null, function (values) {
      const { amazingOffer, amazingOfferPeriod } = values || {};
      const hasOffer = !!amazingOffer;
      const hasOfferPeriod = !!amazingOfferPeriod;

      const errors = [];

      // اگر یکی پر شد، اون یکی هم باید پر باشه
      if (hasOffer && !hasOfferPeriod) {
        errors.push(
          this.createError({
            path: "amazingOfferPeriod",
            message: "When entering an offer title, offer period is required",
          })
        );
      }

      if (hasOfferPeriod && !hasOffer) {
        errors.push(
          this.createError({
            path: "amazingOffer",
            message: "When entering an offer period, offer title is required",
          })
        );
      }

      return errors.length ? new Yup.ValidationError(errors) : true;
    });

  // if(subCategories) return <p>loading...</p>

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
            productName: "",
            category: "",
            price: "",
            stockQuantity: "",
            description: "",
            discountPrice: "",
            discountPercentage: "",
            discountPeriod: "",
            amazingOffer: "",
            amazingOfferPeriod: "",
          }}
          validationSchema={StoreSchema}
          onSubmit={(values, onSubmitProps) => {
            const formData = new FormData();
            formData.append("image", values.image);
            formData.append(
              "storekeeper",
              Number(localStorage.getItem("storekeeperID"))
            );
            formData.append("name", values.productName);
            formData.append("category", Number(selectedCategory.id));
            formData.append("price", values.price);
            formData.append("discounted_price", values.discountPrice);
            formData.append("discount_percentage", values.discountPercentage);
            formData.append("discount_period", values.discountPeriod);
            formData.append("stock_quantity", values.stockQuantity);
            formData.append("amazing_offer", values.amazingOffer);
            formData.append("amazing_offer_period", values.amazingOfferPeriod);
            formData.append("description", values.description);

            console.log(Object.fromEntries(formData.entries()));

            const response = addNewProduct(formData, onSubmitProps, setImage);

            response.then((res) => {
              console.log(res.data);
              onSubmitProps.resetForm();
              setImage({});
              setSelectedCategory(null);
              toast.custom((t) => (
                <div
                  className={`${t.visible ? "animate-enter" : "animate-leave"} 
      transform transition-all duration-300`}
                >
                  <div className="bg-gradient-to-r from-green-500 to-cyan-400 text-white px-6 py-3 rounded-xl shadow-lg border border-white/30 backdrop-blur-md flex items-center space-x-3">
                    <div className="bg-blue-500/20 p-2 rounded-full">
                      <FiCheckCircle className="text-xl text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Product added successfully</p>
                    </div>
                  </div>
                </div>
              ));
            });
          }}
        >
          {({ setFieldValue }) => (
            <Form className="space-y-6 px-0.5">
              {/* بخش تصویر محصول */}
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
                          className="text-blue-500 group-hover:text-blue-700"
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

                  <ErrorMessage
                    name="image"
                    component="div"
                    className="text-red-500 text-sm ml-0.5 mt-2"
                  />
                </div>
              </div>

              {/* نام محصول */}
              <div className="space-y-2">
                <label className="flex items-center text-blue-800 font-medium">
                  <FiTag className="mr-2" /> Product Name*
                </label>
                <Field
                  name="productName"
                  type="text"
                  className="w-full px-4 py-3 text-blue-800 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="Enter product name"
                />
                <ErrorMessage
                  name="productName"
                  component="div"
                  className="text-red-500 text-sm ml-0.5"
                />
              </div>

              {/* دسته‌بندی */}
              <div className="space-y-2">
                <label className="flex items-center text-blue-800 font-medium">
                  <BiCategory size={18} className="mr-2" /> Category*
                </label>

                <div className="relative group w-full">
                  {/* دکمه بازکردن */}
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

                  {/* لیست دسته‌ها */}
                  {isCategoryOpen && (
                    <div className="absolute w-full z-20 mt-1 bg-white rounded-lg shadow-xl border border-blue-200 max-h-64 overflow-y-auto">
                      {/* اگر دسته اصلی انتخاب نشده → لیست ۱۰ تا اصلی */}
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

                      {/* اگر دسته اصلی انتخاب شد → لیست زیرمجموعه‌ها */}
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

              {/* قیمت‌ها */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* قیمت اصلی */}
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

                {/* موجودی */}
                <div className="space-y-2">
                  <label className="flex items-center text-blue-800 font-medium">
                    <FiLayers className="mr-2" /> Stock Quantity*
                  </label>
                  <Field
                    name="stockQuantity"
                    type="number"
                    min="0"
                    className="w-full px-4 py-3 text-blue-800 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    placeholder="100"
                  />
                  <ErrorMessage
                    name="stockQuantity"
                    component="div"
                    className="text-red-500 text-sm ml-0.5"
                  />
                </div>
              </div>

              {/* تخفیف */}
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
                          name="discountPrice"
                          type="number"
                          step="0.01"
                          min="0"
                          className="w-full pl-8.5 text-blue-800 pr-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                          placeholder="Discounted price"
                        />
                      </div>
                      <ErrorMessage
                        name="discountPrice"
                        component="div"
                        className="text-red-500 text-sm ml-0.5 mt-2"
                      />
                    </div>
                    <div className="space-y-2 sm:flex sm:space-x-6">
                      <div className="sm:flex-1">
                        <Field
                          name="discountPercentage"
                          type="number"
                          step="1"
                          min="0"
                          max="100"
                          className="w-full pl-4 text-blue-800 pr-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                          placeholder="Discount %"
                        />
                        <ErrorMessage
                          name="discountPercentage"
                          component="div"
                          className="text-red-500 text-sm ml-0.5 mt-2"
                        />
                      </div>
                      <div className="sm:flex-1">
                        <div className="relative">
                          <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                          <Field
                            name="discountPeriod"
                            type="text"
                            className="w-full pl-9 text-blue-800 pr-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                            placeholder="Period"
                            onFocus={(e) => (e.target.type = "date")}
                            onBlur={(e) => (e.target.type = "text")}
                          />
                        </div>
                        <ErrorMessage
                          name="discountPeriod"
                          component="div"
                          className="text-red-500 text-sm ml-0.5 mt-2"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* پیشنهاد ویژه */}
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
                        name="amazingOffer"
                        type="text"
                        className="w-full px-4 py-3 text-blue-800 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                        placeholder="Offer title"
                      />
                      <ErrorMessage
                        name="amazingOffer"
                        component="div"
                        className="text-red-500 text-sm ml-0.5 mt-2"
                      />
                    </div>
                    <div>
                      <div className="relative">
                        <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                        <Field
                          name="amazingOfferPeriod"
                          type="text"
                          className="w-full pl-10 pr-4 py-3 text-blue-800 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                          placeholder="Offer period"
                          onFocus={(e) => (e.target.type = "date")}
                          onBlur={(e) => (e.target.type = "text")}
                        />
                      </div>
                      <ErrorMessage
                        name="amazingOfferPeriod"
                        component="div"
                        className="text-red-500 text-sm ml-0.5 mt-2"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* توضیحات */}
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

              {/* دکمه‌های اقدام */}
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 cursor-pointer bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white rounded-lg hover:shadow-lg transition-colors duration-300 font-medium flex items-center justify-center"
                >
                  <FiPlusCircle className="mr-2" />
                  Publish Product
                </button>
                <button
                  type="reset"
                  onClick={() => {
                    setSelectedCategory(null);
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
