import { motion } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiCheckCircle,
  FiX,
  FiEye,
  FiEyeOff,
  FiUserPlus,
} from "react-icons/fi";
import { createUser, login } from "../services/userAPIServices";
import { useAtom } from "jotai";
import { authAtom } from "../atoms/authAtom";
import { successToast } from "../utils/toast";
import { fetchUserData } from "../utils/fetchUserData";

const CreateAccountForm = () => {
  const [isAuth] = useAtom(authAtom);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  if (isAuth) {
    navigate("/account/profile");
  }

  const SignupSchema = Yup.object().shape({
    username: Yup.string()
      .matches(
        /^[a-zA-Z0-9@./+\-_]+$/,
        "Only English letters, numbers and @./+-_ characters are allowed"
      )
      .min(4, "At least 4 characters")
      .max(18, "Maximum 18 characters")
      .required("Username is required"),
    password: Yup.string()
      .min(8, "At least 8 characters")
      .matches(/[A-Z]/, "at least one uppercase letter")
      .matches(/[a-z]/, "at least one lowercase letter")
      .matches(/[0-9]/, "at least one number")
      .matches(/[@$!%*?&]/, "at least one special character")
      .required("Password is required"),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-cyan-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative z-10"
          >
            <FiUserPlus className="text-4xl text-white mx-auto mb-3" />
            <h2 className="text-3xl font-bold text-white">Join Cartona</h2>
            <p className="text-blue-100 mt-1">Create your account in seconds</p>
          </motion.div>
        </div>

        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={SignupSchema}
          onSubmit={(values, { setSubmitting }) => {
            createUser({
              username: values.username,
              password: values.password,
            })
              .then((res) => {
                localStorage.setItem("username", res.data.username);
                
                login({
                  username: values.username,
                  password: values.password,
                }).then(() => {
                  fetchUserData();
                  setSubmitting(false);
                  navigate("/account/profile");
                });

                successToast({
                  title: "Account created successfully",
                  text: "Welcome to Cartona",
                });
              })
              .catch((error) => {
                toast.custom((t) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`${
                      t.visible ? "animate-enter" : "animate-leave"
                    } bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-4 rounded-xl shadow-lg backdrop-blur-md flex items-center space-x-3`}
                  >
                    <FiX className="text-xl shrink-0" />
                    <span className="font-medium">
                      {error.response?.data.username || "An error occurred"}
                    </span>
                  </motion.div>
                ));
                setSubmitting(false);
              });
          }}
        >
          {({ isSubmitting }) => (
            <Form className="p-6 space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-blue-800">
                  Username
                </label>
                <Field
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  className="w-full px-4 py-3 bg-white/80 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder-blue-300 text-blue-950 transition-all duration-300"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-500 text-sm mt-1 flex items-center"
                >
                  {(msg) => (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center text-red-500"
                    >
                      <FiX className="mr-1" size={14} />
                      {msg}
                    </motion.div>
                  )}
                </ErrorMessage>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-blue-800">
                  Password
                </label>
                <div className="relative">
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a strong password"
                    className="w-full px-4 py-3 bg-white/80 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder-blue-300 text-blue-950 transition-all duration-300 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-cyan-500 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1 flex items-center"
                >
                  {(msg) => (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center text-red-500"
                    >
                      <FiX className="mr-1" size={14} />
                      {msg}
                    </motion.div>
                  )}
                </ErrorMessage>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-blue-50/50 p-3 rounded-lg border border-blue-200"
              >
                <p className="text-xs font-medium text-blue-700 mb-2">
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
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <FiUserPlus size={18} />
                  )}
                  <span>
                    {isSubmitting ? "Creating account..." : "Create Account"}
                  </span>
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="relative flex items-center py-1"
              >
                <div className="flex-grow border-t border-blue-200"></div>
                <span className="flex-shrink mx-4 text-blue-500 text-sm">
                  or
                </span>
                <div className="flex-grow border-t border-blue-200"></div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="text-center"
              >
                <p className="text-sm text-blue-700">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-cyan-600 hover:text-cyan-700 transition-colors duration-200"
                  >
                    Log in
                  </Link>
                </p>
              </motion.div>
            </Form>
          )}
        </Formik>
      </motion.div>
    </div>
  );
};

export default CreateAccountForm;
