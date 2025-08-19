import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { getStorekeeperProducts } from "../../services/productAPIServices";

import { FiEdit, FiTrash2, FiImage, FiList, FiX, FiPackage } from "react-icons/fi";

export default function MyProducts() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

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
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden rounded-2xl shadow-md hover:shadow-xl border border-gray-200 bg-white transition-all duration-300"
              >
                {/* Product Image */}
                <div className="flex justify-center items-center bg-blue-50/70 p-4 md:p-6 rounded-lg sm:rounded-2xl border border-blue-200 shadow-inner mb-4 w-full h-[260px] md:min-w-[260px] md:h-[260px]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="min-w-40 max-w-full max-h-full object-contain rounded-xl"
                  />
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-2 text-sm">
                    {product.discounted_price ? (
                      <>
                        <span className="line-through text-gray-400">
                          ${product.price}
                        </span>
                        <span className="font-bold text-green-600">
                          ${product.discounted_price}
                        </span>
                      </>
                    ) : (
                      <span className="font-bold text-gray-700">
                        ${product.price}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-500">
                    Stock: {product.stock_quantity}
                  </p>

                  <p className="text-xs text-gray-500">
                    ⭐ {product.average_rating} ({product.comment_count}{" "}
                    reviews)
                  </p>

                  <div className="flex flex-wrap gap-2 pt-3">
                    <button
                      className="flex items-center justify-center p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-300"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <FiEdit className="w-4 h-4 text-blue-600 4 mb-0.5" /> Edit
                    </button>

                    <button
                      className="flex items-center justify-center p-2 bg-cyan-100 text-cyan-700 rounded-lg hover:bg-cyan-200 transition-colors duration-300"
                      onClick={() => alert("Add / Edit Images")}
                    >
                      <FiImage className="w-4 h-4" /> Images
                    </button>

                    <button
                      className="flex items-center justify-center p-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors duration-300"
                      onClick={() => alert("Manage Features")}
                    >
                      <FiList className="w-4 h-4" /> Features
                    </button>

                    <button
                      className="flex items-center justify-center p-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors duration-300"
                      onClick={() => alert("Delete product")}
                    >
                      <FiTrash2 className="w-4 h-4 4 mb-0.5" /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full">
              <h3 className="text-lg font-bold mb-4">
                Edit Product: {selectedProduct.name}
              </h3>
              <p className="text-gray-600 text-sm">
                Here you can add forms to edit product details, add images,
                features, etc.
              </p>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
