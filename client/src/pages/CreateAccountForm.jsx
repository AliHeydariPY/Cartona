import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import toast from "react-hot-toast";
import { FiCheckCircle, FiX } from "react-icons/fi";

import { createUser } from "../services/userAPIServices";

const CreateAccountForm = () => {
  const SignupSchema = Yup.object().shape({
    username: Yup.string()
      .matches(
        /^[a-zA-Z0-9@./+\-_]+$/,
        "Only English letters, numbers and @./+-_ characters are allowed"
      )
      .min(3, "At least 3 characters")
      .max(18, "Maximum 18 characters")
      .required("Username is required"),
    password: Yup.string()
      .min(8, "At least 8 characters")
      .matches(/[A-Z]/, "at least one uppercase letter")
      .matches(/[a-z]/, "at least one lowercase letter")
      .matches(/[0-9]/, "at least one number")
      .matches(/[@$!%*?&]/, "at least one special character")
      .required("Password entry is required"),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-cyan-200 p-4">
      <div className="w-full max-w-md bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/30">
        {/* هدر فرم */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-center">
          <h2 className="text-3xl font-bold text-white">Join Cartona</h2>
          <p className="text-blue-100 mt-1">Create your account in seconds</p>
        </div>

        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={SignupSchema}
          onSubmit={(values) => {
            const response = createUser({
              username: values.username,
              password: values.password,
            });
            response
              .then((response) => {
                console.log(response);
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
                          Account created successfully
                        </p>
                      </div>
                    </div>
                  </div>
                ));
              })
              .catch((error) => {
                toast.custom((t) => (
                  <div
                    className={`${
                      t.visible ? "animate-enter" : "animate-leave"
                    } bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-4 rounded-xl shadow-lg border border-white/20 backdrop-blur-md flex items-center space-x-3 rtl:space-x-reverse`}
                    style={{ fontFamily: "Roboto" }}
                  >
                    <FiX className="text-xl shrink-0" />
                    <span className="font-medium">
                      {error.response?.data.username}
                    </span>
                  </div>
                ));
              });
          }}
        >
          <Form className="p-6 space-y-5">
            {/* یوزرنیم */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-blue-800">
                User Name
              </label>
              <Field
                type="text"
                name="username"
                placeholder="John_Doe"
                className="w-full px-4 py-3 bg-white/80 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder-blue-400 text-blue-950"
              />
              <ErrorMessage
                name="username"
                component="div"
                className="text-red-500 text-sm ml-0.5 mt-1"
              />
            </div>

            {/* پسورد */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-blue-800">
                Password
              </label>
              <Field
                type="text"
                name="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/80 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder-blue-400 text-blue-950"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm ml-0.5 mt-1"
              />
            </div>

            {/* دکمه */}
            <button
              type="submit"
              className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-cyan-500/40 transition-colors duration-700 mt-2"
            >
              Create Account
            </button>

            {/* لینک لاگین */}
            <div className="text-center">
              <p className="text-sm text-blue-800">
                Already have an account?{" "}
                <a
                  href="#"
                  className="font-medium text-cyan-600 hover:text-cyan-700"
                >
                  Log in
                </a>
              </p>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default CreateAccountForm;
