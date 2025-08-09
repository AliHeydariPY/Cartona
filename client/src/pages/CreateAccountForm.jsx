import { useEffect, useState } from "react";

const CreateAccountForm = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-100 p-4">
      <div className="w-full max-w-md bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/30">
        {/* هدر فرم */}
        <div className="bg-gradient-to-r from-blue-600/80 to-cyan-500/80 p-6 text-center">
          <h2 className="text-3xl font-bold text-white">Join Cartona</h2>
          <p className="text-blue-100 mt-1">Create your account in seconds</p>
        </div>

        {/* بدنه فرم */}
        <div className="p-6 space-y-5">
          {/* فیلد نام */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-blue-800">
              Full Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-white/70 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder-blue-300 text-blue-800"
              placeholder="John Doe"
            />
          </div>

          {/* فیلد ایمیل */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-blue-800">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 bg-white/70 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder-blue-300 text-blue-800"
              placeholder="your@email.com"
            />
          </div>

          {/* فیلد رمز عبور */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-blue-800">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 bg-white/70 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder-blue-300 text-blue-800"
              placeholder="••••••••"
            />
          </div>

          {/* دکمه ثبت نام */}
          <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 mt-4">
            Sign Up
          </button>

          {/* لینک ورود */}
          <div className="text-center pt-2">
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
        </div>
      </div>
    </div>
  );
};

export default CreateAccountForm;
