import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { FiUpload, FiUser, FiMapPin, FiEdit3 } from "react-icons/fi";
import { MdStorefront } from "react-icons/md";
import { useEffect } from "react";

import { upgradeToSeller } from "../services/userAPIServices";
import { errorToast, successToast } from "../utils/toast";
import { useAtom } from "jotai";
import { userAtom } from "../atoms/userAtom";

const UpgradeToSeller = () => {
  const navigate = useNavigate();
  const [user, setUser] = useAtom(userAtom);
  const [previewImage, setPreviewImage] = useState(null);
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!user) return;

    if (user.role === "storekeeper") {
      navigate("/account/profile");
    }
  }, [user, navigate]);

  const StoreSchema = Yup.object().shape({
    storeName: Yup.string()
      .min(3, "at least 3 characters")
      .max(50, "at most 50 characters")
      .required("required"),
    description: Yup.string().max(200, "at most 200 characters"),
    address: Yup.string()
      .min(10, "at least 10 characters")
      .required("required"),
    image: Yup.mixed().required("Please select a store image"),
  });

  if (!user) return;

  const handleImageChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setFieldValue("image", file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 to-cyan-100 sm:p-4">
      <div
        className={`${width < 640 ? "min-w-screen" : "w-full"}
 h-screen sm:h-auto max-w-md bg-white/20 backdrop-blur-lg sm:rounded-2xl shadow-xl overflow-hidden`}
      >
        <div className="bg-gradient-to-r  from-blue-600 to-cyan-500 p-6 text-center">
          <h2 className="text-3xl font-bold text-white">Register Your Store</h2>
          <p className="text-blue-100 mt-1">Complete your store information</p>
        </div>

        <Formik
          initialValues={{
            storeName: "",
            description: "",
            address: "",
            image: null,
          }}
          validationSchema={StoreSchema}
          onSubmit={async (values) => {
            try {
              const formData = new FormData();
              formData.append("store_name", values.storeName);
              formData.append("description", values.description);
              formData.append("address", values.address);
              formData.append("image", values.image);

              const res = await upgradeToSeller(formData);

              setUser((prev) => ({
                ...prev,
                role: "storekeeper",
                storekeeper_id: res.data.id,
              }));

              successToast("Account upgraded to seller successfully!");
              navigate("/account/profile");
            } catch (err) {
              const errorMessage =
                err.response?.data?.store_name ||
                "Upgrade failed. Please try again.";

              errorToast(errorMessage);
            }
          }}
        >
          {({ setFieldValue }) => (
            <Form className="p-6 space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-white/80 shadow-lg overflow-hidden bg-gradient-to-br from-blue-100 to-cyan-100">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Store preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-blue-400">
                        <MdStorefront size={32} />
                      </div>
                    )}
                  </div>

                  <label
                    htmlFor="image-upload"
                    className="absolute -bottom-2 -right-2 cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                  >
                    <FiUpload size={16} />
                    <input
                      id="image-upload"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        handleImageChange(event, setFieldValue)
                      }
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="text-center">
                  <p className="text-sm font-medium text-blue-800">
                    Store Profile Image
                  </p>
                </div>

                <ErrorMessage
                  name="image"
                  component="div"
                  className="text-red-500 text-sm text-center"
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-blue-800">
                    <MdStorefront className="mr-2 mb-0.5" size={16} />
                    Store Name
                  </label>
                  <Field
                    type="text"
                    name="storeName"
                    placeholder="Your store name"
                    className="w-full px-4 py-3 bg-white/80 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder-blue-400 text-blue-950"
                  />
                  <ErrorMessage
                    name="storeName"
                    component="div"
                    className="text-red-500 text-sm ml-0.5 mt-1"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-blue-800">
                    <FiEdit3 className="mr-2 mb-0.5" size={16} />
                    Description
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    placeholder="Describe your store..."
                    rows="3"
                    className="w-full px-4 py-3 bg-white/80 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder-blue-400 text-blue-950 resize-none"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-sm ml-0.5 mt-1"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-blue-800">
                    <FiMapPin className="mr-2" size={16} />
                    Address
                  </label>
                  <Field
                    as="textarea"
                    name="address"
                    rows="3"
                    placeholder="Your store address"
                    className="w-full px-4 py-3 bg-white/80 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder-blue-400 text-blue-950 resize-none"
                  />
                  <ErrorMessage
                    name="address"
                    component="div"
                    className="text-red-500 text-sm ml-0.5 mt-1"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-colors duration-300 mt-4 flex items-center justify-center gap-2"
              >
                <MdStorefront size={18} className="mb-0.5" />
                Register Store
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UpgradeToSeller;
