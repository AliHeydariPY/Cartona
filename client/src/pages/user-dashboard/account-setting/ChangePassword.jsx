import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";

import { ChangeUserPassword } from "../../../services/userAPIServices";
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiKey,
} from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa";
import { errorToast, successToast } from "../../../utils/toast";
import { useAtom } from "jotai";
import { userAtom } from "../../../atoms/userAtom";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [user] = useAtom(userAtom);

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
    ChangeUserPassword(payload, user.username)
      .then(() => {
        successToast("Password changed successfully!");
        setSubmitting(false);
        resetForm();
      })
      .catch((err) => {
        const errorMessage  =
          err.response?.data?.old_password ||
          err.response?.data?.detail ||
          "There is a problem. Please try again later";
        errorToast(errorMessage );

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
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 2xl:p-8 border border-blue-400 hover:shadow-lg hover:shadow-blue-400/50 transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div className="flex flex-col sm:flex-row">
            <div className="flex items-center ">
              <FiKey
                className="text-cyan-500 mr-2 sm:mr-3 flex-shrink-0"
                size={20}
              />
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-800">
                Change Password
              </h2>
            </div>
            <div className="sm:ml-3 mt-1 text-xs sm:text-sm text-blue-600 bg-blue-100 px-2 sm:px-3 py-1 rounded-full flex items-center self-start sm:self-auto">
              <span className="mb-0.5">@</span>
              {user?.username}
            </div>
          </div>
          <div className="flex items-center gap-2 ">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-full sm:w-auto cursor-pointer sm:mb-0 gap-2 px-3 sm:px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors duration-300 text-sm sm:text-base"
            >
              <FaArrowLeft className="mb-0.5" />
              Back
            </button>
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
            <Form className="space-y-4 sm:space-y-6">
              <div className="space-y-1 sm:space-y-2">
                <label className="flex items-center text-blue-800 font-medium text-sm sm:text-base">
                  <FiLock className="mr-1 sm:mr-2 flex-shrink-0" size={14} />
                  Current Password*
                </label>
                <div className="relative">
                  <Field
                    name="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-blue-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent pr-10 sm:pr-12 text-sm sm:text-base ${
                      errors.currentPassword && touched.currentPassword
                        ? "border-red-300"
                        : "border-blue-300"
                    }`}
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-cyan-500 transition-colors duration-200"
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
                  <FiLock className="mr-1 sm:mr-2 flex-shrink-0" size={14} />
                  New Password*
                </label>
                <div className="relative">
                  <Field
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-blue-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent pr-10 sm:pr-12 text-sm sm:text-base ${
                      errors.newPassword && touched.newPassword
                        ? "border-red-300"
                        : "border-blue-300"
                    }`}
                    placeholder="Create a new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-cyan-500 transition-colors duration-200"
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
                  <FiLock className="mr-1 sm:mr-2 flex-shrink-0" size={14} />
                  Confirm New Password*
                </label>
                <div className="relative">
                  <Field
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-blue-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent pr-10 sm:pr-12 text-sm sm:text-base ${
                      errors.confirmPassword && touched.confirmPassword
                        ? "border-red-300"
                        : "border-blue-300"
                    }`}
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-cyan-500 transition-colors duration-200"
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

              <div className="bg-blue-50/50 p-3 sm:p-4 rounded-lg border border-blue-200">
                <p className="text-xs sm:text-sm font-medium text-blue-700 mb-2">
                  Password must contain:
                </p>
                <ul className="text-xs text-blue-600 space-y-1">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 flex-shrink-0"></span>
                    At least 8 characters
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 flex-shrink-0"></span>
                    One uppercase letter
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 flex-shrink-0"></span>
                    One lowercase letter
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 flex-shrink-0"></span>
                    One number
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 flex-shrink-0"></span>
                    One special character (@$!%*?&)
                  </li>
                </ul>
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
                    <FiCheckCircle
                      className="mr-1 sm:mr-2 flex-shrink-0"
                      size={16}
                    />
                  )}
                  {isSubmitting ? "Updating..." : "Update Password"}
                </button>

                <button
                  type="reset"
                  className="px-4 sm:px-6 py-2 sm:py-3 cursor-pointer bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300 text-sm sm:text-base"
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

export default ChangePassword;
