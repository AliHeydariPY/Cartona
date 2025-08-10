import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { createUser } from "../services/userAPIService";

const CreateAccountForm = () => {
  const SignupSchema = Yup.object().shape({
    username: Yup.string()
      .matches(/^[a-zA-Z0-9@./+\-_]+$/, "Only English letters, numbers and @./+-_ characters are allowed")
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
        createUser({
          username: values.username,
          password: values.password,
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
