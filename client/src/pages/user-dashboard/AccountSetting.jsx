import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { ChangeUserPassword, login } from "../../services/userAPIServices";
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiKey,
  FiX,
} from "react-icons/fi";

const AccountSetting = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const username = localStorage.getItem("username") || "User";

  const PasswordSchema = Yup.object().shape({
    currentPassword: Yup.string()
      .min(8, "Current password must be at least 8 characters")
      .required("Current password is required"),
    newPassword: Yup.string()
      .min(8, "New password must be at least 8 characters")
      .matches(/[A-Z]/, "at least one uppercase letter")
      .matches(/[a-z]/, "at least one lowercase letter")
      .matches(/[0-9]/, "at least one number")
      .matches(/[@$!%*?&]/, "at least one special character")
      .notOneOf(
        [Yup.ref("currentPassword")],
        "New password must be different from current password"
      )
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Please confirm your password"),
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    const payload = {
      old_password: values.currentPassword,
      password: values.confirmPassword,
    };
    ChangeUserPassword(payload)
      .then((res) => {
        toast.custom((t) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } bg-gradient-to-r from-green-500 to-cyan-400 text-white px-6 py-4 rounded-xl shadow-lg backdrop-blur-md flex items-center space-x-3`}
          >
            <div className="bg-white/20 p-2 rounded-full">
              <FiCheckCircle className="text-xl text-white" />
            </div>
            <div>
              <p className="font-medium">Password changed successfully!</p>
              <p className="text-sm opacity-90">
                Your password has been updated
              </p>
            </div>
          </motion.div>
        ));
        setSubmitting(false);
        resetForm();
      })
      .catch((err) => {
        console.log(err);
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-4 rounded-xl shadow-lg border border-white/20 backdrop-blur-md flex items-center space-x-3 rtl:space-x-reverse`}
            style={{ fontFamily: "Roboto" }}
          >
            <FiX className="text-xl shrink-0" />
            <span className="font-medium">
              {err.response.data.old_password ||
                err.response.data.detail ||
                "There is a problem. Please try again later"}
            </span>
          </div>
        ));
        setSubmitting(false);
        resetForm();
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
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-800 flex items-center">
            <FiKey className="mr-2 sm:mr-3 text-cyan-500" size={24} />
            Change Password
          </h2>
          <div className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
            @{username}
          </div>
        </div>

        <Formik
          initialValues={{
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          }}
          validationSchema={PasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-6">
              {/* Current Password */}
              <div className="space-y-2">
                <label className="flex items-center text-blue-800 font-medium">
                  <FiLock className="mr-2" /> Current Password*
                </label>
                <div className="relative">
                  <Field
                    name="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    className={`w-full px-4 py-3 text-blue-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent pr-12 ${
                      errors.currentPassword && touched.currentPassword
                        ? "border-red-300"
                        : "border-blue-300"
                    }`}
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-cyan-500 transition-colors duration-200"
                  >
                    {showCurrentPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>
                </div>
                <ErrorMessage
                  name="currentPassword"
                  component="div"
                  className="text-red-500 text-sm ml-0.5 flex items-center"
                >
                  {(msg) => (
                    <div className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                      {msg}
                    </div>
                  )}
                </ErrorMessage>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label className="flex items-center text-blue-800 font-medium">
                  <FiLock className="mr-2" /> New Password*
                </label>
                <div className="relative">
                  <Field
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    className={`w-full px-4 py-3 text-blue-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent pr-12 ${
                      errors.newPassword && touched.newPassword
                        ? "border-red-300"
                        : "border-blue-300"
                    }`}
                    placeholder="Create a new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-cyan-500 transition-colors duration-200"
                  >
                    {showNewPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>
                </div>
                <ErrorMessage
                  name="newPassword"
                  component="div"
                  className="text-red-500 text-sm ml-0.5 flex items-center"
                >
                  {(msg) => (
                    <div className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                      {msg}
                    </div>
                  )}
                </ErrorMessage>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="flex items-center text-blue-800 font-medium">
                  <FiLock className="mr-2" /> Confirm New Password*
                </label>
                <div className="relative">
                  <Field
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className={`w-full px-4 py-3 text-blue-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent pr-12 ${
                      errors.confirmPassword && touched.confirmPassword
                        ? "border-red-300"
                        : "border-blue-300"
                    }`}
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-cyan-500 transition-colors duration-200"
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>
                </div>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm ml-0.5 flex items-center"
                >
                  {(msg) => (
                    <div className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                      {msg}
                    </div>
                  )}
                </ErrorMessage>
              </div>

              {/* Password Requirements */}
              <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-700 mb-2">
                  Password must contain:
                </p>
                <ul className="text-xs text-blue-600 space-y-1">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                    At least 8 characters
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                    One uppercase letter
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                    One lowercase letter
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                    One number
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                    One special character (@$!%*?&)
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  ) : (
                    <FiCheckCircle className="mr-2" size={18} />
                  )}
                  {isSubmitting ? "Updating..." : "Update Password"}
                </button>

                <button
                  type="reset"
                  className="px-6 py-3 cursor-pointer bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                >
                  Reset
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </motion.div>
  );
};

export default AccountSetting;
