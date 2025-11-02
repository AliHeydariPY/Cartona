import { motion } from "framer-motion";
import { FiSearch, FiPackage, FiArrowLeft } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

const ProductNotFound = ({ searchQuery = "", setIsFocus }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`${
        window.location.href.includes("account")
          ? "flex justify-center px-1 lg:col-span-3"
          : ""
      }`}
    >
      <div
        className={`w-full bg-white backdrop-blur-xl overflow-hidden ${
          window.location.href.includes("account")
            ? "rounded-3xl shadow-2xl  border border-blue-400 hover:shadow-lg hover:shadow-blue-400/50 transition-all duration-300"
            : ""
        }`}
      >
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center p-4 bg-white/20 rounded-full mb-4">
              <FiPackage className="text-4xl text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Product Not Found
            </h1>
            <p className="text-blue-100 text-lg">
              {searchQuery
                ? `No results found for "${searchQuery}"`
                : "The product you're looking for doesn't exist"}
            </p>
          </div>
        </div>

        <div className="p-8 text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6"
          >
            <div className="inline-flex items-center justify-center p-6 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl mb-4">
              <FiSearch className="text-4xl text-blue-600" />
              <div className="w-2 h-2 mx-2 bg-blue-400 rounded-full animate-pulse"></div>
              <FiPackage className="text-4xl text-cyan-600 opacity-70" />
            </div>
          </motion.div>

          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-semibold text-blue-900">
              Suggestions:
            </h2>
            <ul className="text-blue-700 space-y-2 text-left max-w-md mx-auto">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 mb-0.5"></span>
                Check your spelling and try again
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 mb-0.5"></span>
                Try more general keywords
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 mb-0.5"></span>
                Browse through our categories
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 mb-0.5"></span>
                Contact support if you need help
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <FiArrowLeft className="mr-2" />
              Go Back
            </motion.button>

            {window.location.href.includes("search") && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={setIsFocus}
                className="flex items-center justify-center px-6 py-3 bg-white border border-blue-300 text-blue-700 font-semibold rounded-xl shadow-md hover:bg-blue-50 transition-all duration-300"
              >
                <FiSearch className="mr-2" />
                Search Again
              </motion.button>
            )}

            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center w-full justify-center px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Go Home
              </motion.button>
            </Link>
          </div>
        </div>

        <div className={`${window.location.href.includes("account") ? "" : "bg-blue-50" } p-4 text-center border-t border-blue-200`}>
          <p className="text-sm text-blue-600">
            Need help?{" "}
            <a
              href="/contact"
              className="text-cyan-600 hover:text-cyan-700 font-medium"
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductNotFound;
