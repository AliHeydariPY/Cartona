import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { ChangeUserName } from "../../../services/userAPIServices";

import { FiUser, FiCheckCircle, FiX, FiEdit3, FiAtSign } from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa";
import { successToast } from "../../../utils/toast";
import { useAtom } from "jotai";
import { userAtom } from "../../../atoms/userAtom";
import { useNavigate } from "react-router-dom";

const ChangeUsername = () => {
  const navigate = useNavigate();
  const [user, setUser] = useAtom(userAtom);

  const UsernameSchema = Yup.object().shape({
    newUsername: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username cannot exceed 20 characters")
      .matches(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      )
      .matches(/^[a-zA-Z]/, "Username must start with a letter")
      .notOneOf(
        [user?.username],
        "New username must be different from current username"
      )
      .required("New username is required"),
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    const payload = {
      username: values.newUsername,
    };

    ChangeUserName(payload, user.username)
      .then(() => {
        successToast("Username updated successfully!");
        setUser((prev) => ({ ...prev, username: values.newUsername }));
        setSubmitting(false);
        resetForm();
      })
      .catch((err) => {
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-xl shadow-lg border border-white/20 backdrop-blur-md flex items-center space-x-3 rtl:space-x-reverse`}
            style={{ fontFamily: "Roboto" }}
          >
            <FiX className="text-lg sm:text-xl shrink-0" />
            <span className="font-medium text-sm sm:text-base">
              {err.response?.data?.detail ||
                err.response?.data?.username ||
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
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 2xl:p-8 border border-blue-400 hover:shadow-lg hover:shadow-blue-400/50 transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center">
              <FiUser
                className="text-cyan-500 mr-2 sm:mr-3 flex-shrink-0"
                size={20}
              />
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-800">
                Change Username
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xs sm:text-sm text-blue-600 bg-blue-100 px-2 sm:px-3 py-1 rounded-full flex items-center">
                <FiAtSign className="mb-0.5 mr-1" size={12} />
                Current: {user?.username}
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-full sm:w-auto cursor-pointer gap-2 px-3 sm:px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors duration-300 text-sm sm:text-base"
          >
            <FaArrowLeft className="mb-0.5" />
            Back
          </button>
        </div>

        <Formik
          initialValues={{
            newUsername: "",
          }}
          validationSchema={UsernameSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-4 sm:space-y-6">
              <div className="space-y-1 sm:space-y-2">
                <label className="flex items-center text-blue-800 font-medium text-sm sm:text-base">
                  <FiEdit3 className="mr-1 sm:mr-2 flex-shrink-0" size={14} />
                  New Username*
                </label>
                <div className="relative">
                  <Field
                    name="newUsername"
                    type="text"
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-blue-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent pr-10 sm:pr-12 text-sm sm:text-base ${
                      errors.newUsername && touched.newUsername
                        ? "border-red-300"
                        : "border-blue-300"
                    }`}
                    placeholder="Enter new username"
                  />
                </div>
                <ErrorMessage
                  name="newUsername"
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
                  Username requirements:
                </p>
                <ul className="text-xs text-blue-600 space-y-1">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 flex-shrink-0"></span>
                    3-20 characters long
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 flex-shrink-0"></span>
                    Must start with a letter
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 flex-shrink-0"></span>
                    Letters, numbers, and underscores only
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 flex-shrink-0"></span>
                    Cannot be same as current username
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
                  {isSubmitting ? "Updating..." : "Update Username"}
                </button>

                <button
                  type="reset"
                  className="px-4 sm:px-6 py-2 sm:py-3 cursor-pointer bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300 text-sm sm:text-base"
                >
                  Reset
                </button>
              </div>

              <div className="bg-amber-50/50 p-3 sm:p-4 rounded-lg border border-amber-200">
                <p className="text-xs sm:text-sm font-medium text-amber-700 flex items-start">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                  <span>
                    <strong>Important:</strong> Changing your username will
                    update how you appear across Cartona. Your profile URL and
                    mentions will be updated accordingly.
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

export default ChangeUsername;
