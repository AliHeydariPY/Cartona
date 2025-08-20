import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import toast from "react-hot-toast";

import {
  FiPlus,
  FiTrash2,
  FiImage,
  FiPlusCircle,
  FiCheckCircle,
  FiX,
} from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa6";

import { useNavigate, useParams } from "react-router-dom";

import {
  getProduct,
  addImage,
  deleteImage,
} from "../../../services/productAPIServices";

import RemoveImagePopup from "../../../components/pop-ups/RemoveImagePopup";

const ProductImages = ({ reloadComponent, setReloadComponent }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showRemovePopup, setShowRemovePopup] = useState(false);

  useEffect(() => {
    getProduct(id).then((res) => {
      setProduct(res.data);
    });
  }, [reloadComponent]);

  const handleAddImage = (values, resetForm, setFieldValue) => {
    addImage(values).then(() => {
      resetForm();
      setFieldValue("image", null);
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
              <p className="font-medium">The image was sent successfully</p>
            </div>
          </div>
        </div>
      ));
    });
  };

  const handleRemoveImage = () => {
    deleteImage(selectedImage.id).then(() => {
      setReloadComponent(!reloadComponent);
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } bg-gradient-to-r from-red-600 to-rose-500 text-white px-6 py-4 rounded-xl shadow-lg border border-white/20 backdrop-blur-md flex items-center space-x-3 rtl:space-x-reverse`}
        >
          <FiX className="text-xl shrink-0" />
          <span className="font-medium">Image successfully removed</span>
        </div>
      ));
    });
  };

  const validationSchema = Yup.object({
    image: Yup.mixed().required("Product image is required."),
  });

  if (!product) return <p>loading...</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="lg:col-span-3"
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl p-5 sm:p-6 2xl:p-8 border border-blue-400 hover:shadow-lg hover:shadow-blue-400/50 transition-all duration-300">
        {/* Header */}
        <div className="flex items-center gap-y-2 flex-wrap-reverse justify-between mb-4 sm:mb-6">
          <div className="flex items-center">
            <span>
              <FiImage
                className="mb-0.5 mr-1 sm:mr-3 text-cyan-600"
                size={24}
              />
            </span>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-800">
              Product Images
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
          <div className="flex justify-center items-center p-2 bg-blue-50/70 rounded-lg sm:rounded-xl border border-blue-200 shadow-inner w-24 h-24">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
          <div>
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-blue-900">
              {product.name}
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-blue-600">
              Managing images for this product
            </p>
          </div>
        </div>

        {/* Upload Form */}
        <Formik
          initialValues={{ image: null }}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm, setFieldValue }) => {
            if (values.image) {
              const formData = new FormData();
              formData.append("product", product.id);
              formData.append("image", values.image);

              handleAddImage(formData, resetForm, setFieldValue);
            }
          }}
        >
          {({ setFieldValue, values }) => (
            <Form className="space-y-4 mb-6">
              <div className="space-y-2">
                <label className="flex items-center text-blue-800 font-medium">
                  <FiImage className="mr-2" /> Product Image
                </label>

                <div className="relative group w-24 h-24 xl:w-28 xl:h-28">
                  <label
                    className={`block w-full h-full ${
                      !values.image
                        ? "border-2 border-dashed border-blue-400 cursor-pointer"
                        : "border border-blue-200"
                    } rounded-lg flex items-center justify-center overflow-hidden hover:bg-blue-50 transition-colors duration-300`}
                  >
                    {values.image ? (
                      <>
                        <img
                          src={URL.createObjectURL(values.image)}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFieldValue("image", null);
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
                  className="text-red-500 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center text-sm sm:text-base"
              >
                <FiPlus className="mr-1 mb-0.5" size={18} strokeWidth={3} />
                Add Image
              </button>
            </Form>
          )}
        </Formik>

        {/* Images List */}
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-blue-800 mb-3">
            Added Images ({product.images_set.length})
          </h3>

          {product.images_set.length === 0 ? (
            <div className="text-center py-6 sm:py-8 bg-blue-50/50 rounded-xl border border-blue-200">
              <p className="text-blue-600/80 text-sm sm:text-base">
                No images added yet.
              </p>
              <p className="text-xs sm:text-sm text-blue-500/60 mt-1">
                Add multiple images to better showcase your product.
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {product.images_set.map((img, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-3 sm:p-4 border border-blue-200 hover:border-blue-300 transition-colors duration-300"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <img
                      src={img.image}
                      alt={`Product Image ${index + 1}`}
                      className="w-14 h-14 sm:w-20 sm:h-20 object-cover rounded-lg border border-blue-200 bg-white"
                    />
                    <span className="text-sm sm:text-base text-blue-700">
                      Image {index + 1}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedImage(img);
                      setShowRemovePopup(true);
                    }}
                    className="ml-1 p-1.5 sm:p-2 bg-white/80 cursor-pointer rounded-lg border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-300"
                    title="Remove image"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {showRemovePopup && (
          <RemoveImagePopup
            onClose={() => setShowRemovePopup(false)}
            image={selectedImage}
            removeImage={handleRemoveImage}
          />
        )}

        {/* Quick Tips */}
        {product.images_set.length > 0 && (
          <div className="mt-6 p-3 sm:p-4 bg-cyan-50/50 rounded-xl border border-cyan-200">
            <p className="text-xs sm:text-sm md:text-base text-cyan-800">
              💡 <strong>Tip:</strong> Adding multiple images increases trust
              and helps customers understand your product better.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductImages;
