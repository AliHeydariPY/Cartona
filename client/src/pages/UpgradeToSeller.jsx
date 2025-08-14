import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { upgradeToSeller } from "../services/userAPIServices";

import toast from "react-hot-toast";
import { FiCheckCircle, FiX } from "react-icons/fi";

const UpgradeToSeller = () => {
  const StoreSchema = Yup.object().shape({
    user: Yup.string()
      .min(3, "at least 3 characters")
      .max(30, "at most 30 characters")
      .required("required"),
    storeName: Yup.string()
      .min(3, "at least 3 characters")
      .max(50, "at most 50 characters")
      .required("required"),
    description: Yup.string().max(200, "at most 200 characters"),
    address: Yup.string()
      .min(10, "at least 10 characters")
      .required("required"),
    image: Yup.mixed().required("Please select an image"),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 to-cyan-100 p-4">
      <div className="w-full max-w-md bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-center">
          <h2 className="text-3xl font-bold text-white">Register Your Store</h2>
          <p className="text-blue-100 mt-1">Complete your store information</p>
        </div>

        <Formik
          initialValues={{
            user: "",
            storeName: "",
            description: "",
            address: "",
            image: null,
          }}
          validationSchema={StoreSchema}
          onSubmit={(values, { setSubmitting }) => {
            const formData = new FormData();
            formData.append("user", 23);
            formData.append("store_name", values.storeName);
            formData.append("description", values.description);
            formData.append("address", values.address);
            formData.append("image", values.image);

            // console.log(Object.fromEntries(formData.entries()));
            const response = upgradeToSeller(formData);
            response
              .then((res) => {
                console.log(res.data);
                toast.custom((t) => (
                  <div
                    className={`${
                      t.visible ? "animate-enter" : "animate-leave"
                    } 
      transform transition-all duration-300`}
                  >
                    <div className="bg-gradient-to-r from-green-500 to-cyan-400 text-white px-6 py-3 rounded-xl shadow-lg border border-white/30 backdrop-blur-md flex items-center space-x-3">
                      <div className="bg-blue-500/20 p-2 rounded-full">
                        <FiCheckCircle className="text-xl text-white" />
                      </div>
                      <div>
                        <p className="font-medium">
                          Account upgraded to seller successfully!
                        </p>
                      </div>
                    </div>
                  </div>
                ));
              })
              .catch((err) => {
                console.error(err);

                toast.custom((t) => (
                  <div
                    className={`${
                      t.visible ? "animate-enter" : "animate-leave"
                    } 
      transform transition-all duration-300`}
                  >
                    <div className="bg-gradient-to-r from-red-600 to-rose-500 text-white px-6 py-4 rounded-xl shadow-lg border border-white/30 backdrop-blur-md flex items-center space-x-3">
                      <FiX className="text-xl shrink-0" />
                      <span className="font-medium">
                        {err.response?.data?.message ||
                          "Upgrade failed. Please try again."}
                      </span>
                    </div>
                  </div>
                ));
              });
          }}
        >
          {({ setFieldValue }) => (
            <Form className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-blue-800">
                  User
                </label>
                <Field
                  type="text"
                  name="user"
                  placeholder="Your username"
                  className="w-full px-4 py-3 bg-white/80 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder-blue-400 text-blue-950"
                />
                <ErrorMessage
                  name="user"
                  component="div"
                  className="text-red-500 text-sm ml-0.5 mt-1"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-blue-800">
                  Store name
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

              <div className="space-y-1">
                <label className="block text-sm font-medium text-blue-800">
                  Description
                </label>
                <Field
                  as="textarea"
                  name="description"
                  placeholder="Store description..."
                  rows="3"
                  className="w-full px-4 py-3 bg-white/80 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder-blue-400 text-blue-950"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm ml-0.5 mt-1"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-blue-800">
                  Address
                </label>
                <Field
                  as="textarea"
                  name="address"
                  rows="3"
                  placeholder="Store address"
                  className="w-full px-4 py-3 bg-white/80 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder-blue-400 text-blue-950"
                />
                <ErrorMessage
                  name="address"
                  component="div"
                  className="text-red-500 text-sm ml-0.5 mt-1"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-blue-800">
                  Store Image
                </label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    setFieldValue("image", event.currentTarget.files[0]);
                  }}
                  className="w-full px-4 py-2 bg-white/80 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-blue-950 text-sm"
                />
                <ErrorMessage
                  name="image"
                  component="div"
                  className="text-red-500 text-sm ml-0.5 mt-1"
                />
              </div>

              <button
                type="submit"
                className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-cyan-500/40 transition-colors duration-700 mt-4"
              >
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
