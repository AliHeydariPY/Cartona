import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Formik, Form, Field } from "formik";
import {
  FiTrash2,
  FiPlus,
  FiList,
  FiCheckCircle,
  FiAlertCircle,
  FiX,
} from "react-icons/fi";

import toast from "react-hot-toast";

import {
  getProduct,
  addFeature,
  removeFeature,
} from "../../../services/productAPIServices";
import { FaArrowLeft } from "react-icons/fa6";

const ProductFeatures = ({ reloadComponent, setReloadComponent }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    getProduct(id).then((res) => {
      setProduct(res.data);
    });
  }, [reloadComponent]);

  const handleAddFeature = (values, resetForm) => {
    if (values.feature_name.trim() != "" && values.feature_value.trim() != "") {
      const feature = {
        product: id,
        feature_name: values.feature_name,
        feature_value: values.feature_value,
      };
      addFeature(feature).then(() => {
        resetForm();
        setReloadComponent(!reloadComponent);
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } transform transition-all duration-300`}
          >
            <div className="bg-gradient-to-r from-green-500 to-cyan-400 text-white px-6 py-3 rounded-xl shadow-lg border border-white/30 backdrop-blur-md flex items-center space-x-3">
              <div className="bg-blue-500/20 p-2 rounded-full">
                <FiCheckCircle className="text-xl text-white" />
              </div>
              <div>
                <p className="font-medium">
                  Your comment was successfully sent
                </p>
              </div>
            </div>
          </div>
        ));
      });
    } else {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } bg-gradient-to-r from-amber-500 to-amber-400 text-white px-6 py-4 rounded-xl shadow-lg border border-white/30 backdrop-blur-md flex items-center gap-3 max-w-md`}
        >
          <FiAlertCircle className="text-xl mb-0.5" />
          <div>
            <p className="text-md text-white">Please enter complete details </p>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="ml-auto p-1 hover:bg-white/20 cursor-pointer rounded-full transition-colors"
          >
            <FiX />
          </button>
        </div>
      ));
    }
  };

  const handleRemoveFeature = (featureID) => {
    removeFeature(featureID).then(() => {
      setReloadComponent(!reloadComponent);
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } bg-gradient-to-r from-red-600 to-rose-500 text-white px-6 py-4 rounded-xl shadow-lg border border-white/20 backdrop-blur-md flex items-center space-x-3 rtl:space-x-reverse`}
        >
          <FiX className="text-xl shrink-0" />
          <span className="font-medium">Feature successfully removed</span>
        </div>
      ));
    });
  };

  if (!product) return <p>loading...</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="lg:col-span-3"
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl p-5 sm:p-6 2xl:p-8 border border-blue-400 hover:shadow-lg hover:shadow-blue-400/50 transition-all duration-300">
        {/* Header with Back Button */}
        <div className="flex items-center gap-y-2 flex-wrap-reverse justify-between mb-4 sm:mb-6">
          <div className="flex items-center">
            <span>
              <FiList className="text-purple-600 mr-1 sm:mr-3" size={24} />
            </span>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-800">
              Product Features
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

        {/* Product Info */}
        <div className="flex items-center gap-4 mb-6 sm:mb-8 p-2 sm:p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
          <img
            src={product.image}
            alt={product.name}
            className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-lg border border-blue-200 bg-white p-2"
          />
          <div>
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-blue-900">
              {product.name}
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-blue-600">
              Managing features for this product
            </p>
          </div>
        </div>

        {/* Formik Form */}
        <Formik
          initialValues={{ feature_name: "", feature_value: "" }}
          onSubmit={(values, { resetForm }) =>
            handleAddFeature(values, resetForm)
          }
        >
          {() => (
            <Form className="space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm md:text-base font-medium text-blue-800 mb-2">
                    Feature Name
                  </label>
                  <Field
                    name="feature_name"
                    placeholder="e.g., Color, Size, Material"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/80 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder-blue-400 text-blue-950 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm md:text-base font-medium text-blue-800 mb-2">
                    Feature Value
                  </label>
                  <Field
                    name="feature_value"
                    placeholder="e.g., Red, Large, Cotton"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/80 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder-blue-400 text-blue-950 text-sm sm:text-base"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center text-sm sm:text-base"
              >
                <FiPlus className="mr-1 mb-0.5" size={18} strokeWidth={3} />
                Add Feature
              </button>
            </Form>
          )}
        </Formik>

        {/* Features List */}
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-blue-800 mb-3">
            Added Features ({product.features_set.length})
          </h3>

          {product.features_set.length === 0 ? (
            <div className="text-center py-6 sm:py-8 bg-blue-50/50 rounded-xl border border-blue-200">
              <p className="text-blue-600/80 text-sm sm:text-base">
                No features added yet.
              </p>
              <p className="text-xs sm:text-sm text-blue-500/60 mt-1">
                Add features like color, size, material, etc.
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {product.features_set.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-3 sm:p-4 border border-blue-200 hover:border-blue-300 transition-colors duration-300"
                >
                  <div className="flex-1 text-sm sm:text-base">
                    <span className="font-medium text-blue-900 capitalize">
                      {feature.feature_name}:
                    </span>
                    <span className="text-blue-700 ml-1 capitalize">
                      {feature.feature_value}
                    </span>
                  </div>

                  <button
                    onClick={() => handleRemoveFeature(feature.id)}
                    className="ml-1 p-1.5 sm:p-2 bg-white/80 cursor-pointer rounded-lg border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-300"
                    title="Remove feature"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Tips */}
        {product.features_set.length > 0 && (
          <div className="mt-6 p-3 sm:p-4 bg-cyan-50/50 rounded-xl border border-cyan-200">
            <p className="text-xs sm:text-sm md:text-base text-cyan-800">
              💡 <strong>Tip:</strong> Features help customers find your product
              easily. Add relevant specifications like size, color, material,
              etc.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductFeatures;
