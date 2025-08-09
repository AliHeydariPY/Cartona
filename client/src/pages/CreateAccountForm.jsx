import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { createUser } from "../services/userAPIService";

const CreateAccountForm = () => {
  const SignupSchema = Yup.object().shape({
    username: Yup.string()
      .matches(/^[a-zA-Z0-9_]+$/, "فقط حروف انگلیسی، عدد و آندرلاین مجاز است")
      .min(3, "حداقل ۳ کاراکتر")
      .max(20, "حداکثر ۲۰ کاراکتر")
      .required("وارد کردن نام کاربری الزامی است"),
    password: Yup.string()
      .min(8, "حداقل ۸ کاراکتر")
      .matches(/[A-Z]/, "حداقل یک حرف بزرگ")
      .matches(/[a-z]/, "حداقل یک حرف کوچک")
      .matches(/[0-9]/, "حداقل یک عدد")
      .matches(/[@$!%*?&]/, "حداقل یک کاراکتر خاص")
      .required("وارد کردن رمز عبور الزامی است"),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-100 p-4">
      <div className="w-full max-w-md bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/30">
        <div className="bg-gradient-to-r from-blue-600/80 to-cyan-500/80 p-6 text-center">
          <h2 className="text-3xl font-bold text-white">Join Cartona</h2>
          <p className="text-blue-100 mt-1">Create your account in seconds</p>
        </div>

        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={SignupSchema}
          onSubmit={(values) => {
            console.log("ثبت نام:", values);
            const users = createUser(values)
            console.log(users)
          }}
        >
          {({ isSubmitting }) => (
            <Form className="p-6 space-y-5">
              {/* Username */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-blue-800">
                  User Name
                </label>
                <Field
                  type="text"
                  name="username"
                  placeholder="John_Doe"
                  className="w-full px-4 py-3 bg-white/70 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder-blue-300 text-blue-800"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-blue-800">
                  Password
                </label>
                <Field
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white/70 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder-blue-300 text-blue-800"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-cyan-500/30 transition-all duration-700 mt-4"
              >
                {isSubmitting ? "در حال ساخت..." : "Create Account"}
              </button>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-sm text-blue-700">
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
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateAccountForm;
