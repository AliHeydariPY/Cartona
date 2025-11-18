import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";

import {
  FiMapPin,
  FiEdit3,
  FiImage,
  FiUser,
  FiArrowLeft,
} from "react-icons/fi";
import { errorToast, successToast } from "../../../utils/toast";
import { useAtom } from "jotai";
import { userAtom } from "../../../atoms/userAtom";
import { MdStorefront } from "react-icons/md";
import { useEffect, useState } from "react";
import {
  changeStoreInfo,
  getStorekeeper,
} from "../../../services/userAPIServices";

const StoreSetting = () => {
  const [user, setUser] = useAtom(userAtom);
  const [storeInfo, setStoreInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    getStorekeeper(user.username).then((res) => {
      setStoreInfo(res.data);
    });
  }, [user]);

  const SellerSchema = Yup.object().shape({
    storeName: Yup.string()
      .min(3, "Store name must be at least 3 characters")
      .max(50, "Store name cannot exceed 50 characters")
      .required("Store name is required"),
    description: Yup.string()
      .max(200, "Description cannot exceed 200 characters")
      .nullable(),
    address: Yup.string()
      .min(10, "Address must be at least 10 characters")
      .required("Store address is required"),
    image: Yup.mixed()
      .nullable()
      .test("fileSize", "Image size must be less than 5MB", (value) => {
        if (!value) return true;
        return value.size <= 5 * 1024 * 1024;
      })
      .test("fileType", "Only image files are allowed", (value) => {
        if (!value) return true;
        return ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          value.type
        );
      }),
  });
  if (!user || !storeInfo) return null;

  const initialValues = {
    storeName: storeInfo.store_name || "",
    description: storeInfo.description || "",
    address: storeInfo.address || "",
    image: null,
  };

  const handleSubmit = (
    values,
    { setSubmitting, resetForm, setFieldValue }
  ) => {
    const formData = new FormData();
    formData.append("store_name", values.storeName);
    formData.append("description", values.description);
    formData.append("address", values.address);
    if (values.image) {
      formData.append("image", values.image);
    }

    changeStoreInfo(formData, user.username)
      .then((res) => {
        successToast("Store information updated successfully!");

        setUser((prev) => ({
          ...prev,
          store: "new",
        }));
        setFieldValue("store_name", res.data.storeName);
        setFieldValue("description", res.data.description);
        setFieldValue("address", res.data.address);
        setFieldValue("image", null);

        setSubmitting(false);
        // resetForm();
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.store_name ||
          err.response?.data?.address ||
          err.response?.data?.detail ||
          "Update failed. Please try again.";

        errorToast(errorMessage);

        setSubmitting(false);
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="lg:col-span-3"
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 2xl:p-8 border border-blue-400 hover:shadow-lg hover:shadow-blue-400/50 transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="flex items-center">
              <MdStorefront
                className="text-cyan-500 mr-2 sm:mr-3 flex-shrink-0"
                size={22}
              />
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-800">
                Update Store Information
              </h2>
            </div>
            <div className="flex items-center gap-1">
              <div className="text-xs sm:text-sm text-blue-600 bg-blue-100 px-2 sm:px-3 py-1 rounded-full flex items-center">
                <FiUser className="mb-0.5 mr-1" size={12} />
                {user?.username}
              </div>
              {storeInfo?.store_name && (
                <div className="text-xs sm:text-sm text-cyan-600 bg-cyan-100 px-2 sm:px-3 py-1 rounded-full flex items-center">
                  <MdStorefront className="mb-0.5 mr-1" size={12} />
                  {storeInfo.store_name}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-full sm:w-auto cursor-pointer gap-2 px-3 sm:px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors duration-300 text-sm sm:text-base"
          >
            <FiArrowLeft className="mb-0.5" />
            Back
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={SellerSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values, isSubmitting, errors, touched }) => (
            <Form className="space-y-4 sm:space-y-6">
              <div className="space-y-1 sm:space-y-2">
                <label className="flex items-center text-blue-800 font-medium text-sm sm:text-base">
                  <FiEdit3 className="mr-1 sm:mr-2 flex-shrink-0" size={14} />
                  Store Name*
                </label>
                <Field
                  type="text"
                  name="storeName"
                  placeholder="Enter your store name"
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-blue-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-sm sm:text-base ${
                    errors.storeName && touched.storeName
                      ? "border-red-300"
                      : "border-blue-300"
                  }`}
                />
                <ErrorMessage
                  name="storeName"
                  component="div"
                  className="text-red-500 text-xs sm:text-sm ml-0.5 flex items-center"
                >
                  {(msg) => (
                    <div className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1 sm:mr-2 flex-shrink-0"></span>
                      <span className="text-xs sm:text-sm">{msg}</span>
                    </div>
                  )}
                </ErrorMessage>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <label className="flex items-center text-blue-800 font-medium text-sm sm:text-base">
                  <FiEdit3 className="mr-1 sm:mr-2 flex-shrink-0" size={14} />
                  Store Description
                </label>
                <Field
                  as="textarea"
                  name="description"
                  placeholder="Describe your store, products, and what makes it special..."
                  rows="4"
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-blue-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-sm sm:text-base resize-none ${
                    errors.description && touched.description
                      ? "border-red-300"
                      : "border-blue-300"
                  }`}
                />
                <div className="flex justify-between items-center">
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-xs sm:text-sm ml-0.5 flex items-center"
                  >
                    {(msg) => (
                      <div className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1 sm:mr-2 flex-shrink-0"></span>
                        <span className="text-xs sm:text-sm">{msg}</span>
                      </div>
                    )}
                  </ErrorMessage>
                  <span className="text-xs text-blue-500">
                    {values.description?.length || 0}/200
                  </span>
                </div>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <label className="flex items-center text-blue-800 font-medium text-sm sm:text-base">
                  <FiMapPin className="mr-1 sm:mr-2 flex-shrink-0" size={14} />
                  Store Address*
                </label>
                <Field
                  as="textarea"
                  name="address"
                  rows="3"
                  placeholder="Enter your complete store address..."
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-blue-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-sm sm:text-base resize-none ${
                    errors.address && touched.address
                      ? "border-red-300"
                      : "border-blue-300"
                  }`}
                />
                <ErrorMessage
                  name="address"
                  component="div"
                  className="text-red-500 text-xs sm:text-sm ml-0.5 flex items-center"
                >
                  {(msg) => (
                    <div className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1 sm:mr-2 flex-shrink-0"></span>
                      <span className="text-xs sm:text-sm">{msg}</span>
                    </div>
                  )}
                </ErrorMessage>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <label className="flex items-center text-blue-800 font-medium text-sm sm:text-base">
                  <FiImage className="mr-1 sm:mr-2 flex-shrink-0" size={14} />
                  Store Image
                </label>
                <div className="space-y-3">
                  {user.store?.image && !values.image && (
                    <div className="flex items-center space-x-3 p-3 bg-blue-50/50 rounded-lg border border-blue-200">
                      <img
                        src={user.store.image}
                        alt="Current store"
                        className="w-16 h-16 object-cover rounded-lg border border-blue-300"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-blue-700 font-medium">
                          Current Image
                        </p>
                        <p className="text-xs text-blue-500">
                          This will be replaced if you upload a new image
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="relative">
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        setFieldValue("image", event.currentTarget.files[0]);
                      }}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-blue-800 text-sm sm:text-base file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />

                    {values.image && (
                      <div className="mt-3 p-3 bg-green-50/50 rounded-lg border border-green-200">
                        <p className="text-sm text-green-700 font-medium mb-2">
                          New Image Preview:
                        </p>
                        <img
                          src={URL.createObjectURL(values.image)}
                          alt="New store preview"
                          className="w-32 h-32 object-cover rounded-lg border border-green-300 mx-auto"
                        />
                        <p className="text-xs text-green-600 text-center mt-2">
                          {values.image.name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <ErrorMessage
                  name="image"
                  component="div"
                  className="text-red-500 text-xs sm:text-sm ml-0.5 flex items-center"
                >
                  {(msg) => (
                    <div className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1 sm:mr-2 flex-shrink-0"></span>
                      <span className="text-xs sm:text-sm">{msg}</span>
                    </div>
                  )}
                </ErrorMessage>
                <p className="text-xs text-blue-500 ml-0.5">
                  Optional. Max file size: 5MB. Supported formats: JPG, PNG,
                  WebP
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 sm:pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 sm:px-6 py-2 sm:py-3 cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  ) : (
                    <FiEdit3 className="mr-1 sm:mr-2 flex-shrink-0" size={16} />
                  )}
                  {isSubmitting ? "Updating..." : "Update Store Info"}
                </button>

                <button
                  type="reset"
                  className="px-4 sm:px-6 py-2 sm:py-3 cursor-pointer bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300 text-sm sm:text-base"
                >
                  Reset Changes
                </button>
              </div>

              <div className="bg-blue-50/50 p-3 sm:p-4 rounded-lg border border-blue-200">
                <p className="text-xs sm:text-sm font-medium text-blue-700 flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                  <span>
                    <strong>Note:</strong> Updating your store information helps
                    customers find and trust your business. Make sure all
                    information is accurate and up-to-date.
                  </span>
                </p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </motion.div>
  );
};

export default StoreSetting;
