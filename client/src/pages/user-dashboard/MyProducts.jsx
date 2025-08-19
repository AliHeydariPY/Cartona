import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { getStorekeeperProducts } from "../../services/productAPIServices";

import {
  FiEdit,
  FiTrash2,
  FiImage,
  FiList,
  FiStar,
  FiPackage,
} from "react-icons/fi";

export default function MyProducts() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getStorekeeperProducts(localStorage.getItem("storekeeperID")).then(
      (res) => {
        console.log(res.data);
        setProducts(res.data);
      }
    );
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="lg:col-span-3"
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl p-5 sm:p-6 2xl:p-8 border border-blue-400 hover:shadow-lg hover:shadow-blue-400/50 transition-all duration-300">
        <h2 className="text-xl sm:text-2xl font-bold text-blue-800 mb-6 sm:mb-8 flex items-center">
          <FiPackage className="mr-2 sm:mr-3 text-amber-600" size={24} />
          Add New Product
        </h2>

        {products.length === 0 ? (
          <div className="text-gray-500">
            You haven’t added any products yet.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <div className="overflow-hidden rounded-2xl shadow-md hover:shadow-xl border border-gray-200 bg-white transition-all duration-300">
                {/* Product Image */}
                <div className="flex justify-center items-center bg-blue-50/70 p-4 md:p-6 rounded-lg sm:rounded-2xl border border-blue-200 shadow-inner w-full h-[260px] md:min-w-[260px] md:h-[260px]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="min-w-40 max-w-full max-h-full object-contain rounded-xl"
                  />
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="text-lg font-bold text-blue-900 truncate">
                    {product.name}
                  </h3>

                  <div className="flex items-center  flex-wrap gap-2">
                    <span className="text-lg sm:text-lg font-bold text-blue-900">
                      ${product.discounted_price || product.price}
                    </span>
                    {product.discounted_price && (
                      <span className="text-sm text-blue-500 line-through ml-1">
                        ${product.price}
                      </span>
                    )}
                    {product.discount_percentage && (
                      <span className="ml-1 text-xs bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-2 sm:px-2 py-1 rounded-full">
                        {product.discount_percentage}% OFF
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-500">
                    Stock: {product.stock_quantity}
                  </p>

                  <div className="flex items-center mb-3 gap-2">
                    <div className="flex items-center bg-blue-100 w-max px-2 py-1 rounded-full">
                      <FiStar className="text-yellow-500 fill-yellow-500 mr-1 mb-0.5" />
                      <span className="text-sm text-blue-600">
                        {product.average_rating?.toFixed(1) || "0"}
                      </span>
                    </div>
                    <span className="text-sm text-blue-600">
                      ({product.comment_count || 0} reviews)
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      className="flex cursor-pointer items-center justify-center p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-300"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <FiEdit className="w-4 h-4 text-blue-600 4 mb-0.5" /> Edit
                    </button>

                    <button
                      className="flex cursor-pointer items-center justify-center p-2 bg-cyan-100 text-cyan-700 rounded-lg hover:bg-cyan-200 transition-colors duration-300"
                      onClick={() => alert("Add / Edit Images")}
                    >
                      <FiImage className="w-4 h-4 mb-0.5" /> Images
                    </button>

                    <button
                      className="flex cursor-pointer items-center justify-center p-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors duration-300"
                      onClick={() => {
                        navigate(`features/${product.id}`);
                      }}
                    >
                      <FiList className="mb-0.5" size={19} /> Features
                    </button>

                    <button
                      className="flex cursor-pointer items-center justify-center p-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors duration-300"
                      onClick={() => alert("Delete product")}
                    >
                      <FiTrash2 className="w-4 h-4 4 mb-0.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
