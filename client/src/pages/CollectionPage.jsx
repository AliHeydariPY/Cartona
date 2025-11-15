import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCollection, getProduct } from "../services/productAPIServices";
import {
  FiArrowLeft,
  FiPackage,
  FiStar,
  FiArrowRight,
} from "react-icons/fi";
import { PiLightningFill } from "react-icons/pi";
import CartonaLoader from "../components/CartonaLoader";

const CollectionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchCollectionData = async () => {
      try {
        setIsLoading(true);
        const collectionData = await getCollection(id);
        const productsWithDetails = await Promise.all(
          collectionData.data.products.map(async (item) => {
            const product = await getProduct(item.id);
            return product.data;
          })
        );

        setCollection({
          ...collectionData.data,
          products: productsWithDetails,
        });
        setTimeout(() => {
          setIsLoading(false);
        }, 100);
      } catch (error) {
        console.error("Error fetching collection:", error);
        setIsLoading(false);
        setNotFound(true);
      }
    };

    if (id) {
      fetchCollectionData();
    }
  }, [id]);

  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <>
      <CartonaLoader isLoading={isLoading} />
      {collection && (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors duration-200"
              >
                <FiArrowLeft size={18} />
                <span className="font-medium cursor-pointer">Back</span>
              </button>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-200 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-2">
                      {collection.collection_name}
                    </h1>
                    <p className="text-blue-600">
                      Explore all products in this exclusive collection
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-full flex items-center gap-2">
                      <FiPackage size={18} />
                      <span className="font-semibold">
                        {collection.products.length} Products
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Products Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {collection.products.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleProductClick(product.id)}
                  className="group cursor-pointer bg-white rounded-2xl border border-blue-200 overflow-hidden hover:shadow-2xl hover:border-cyan-300 transition-all duration-300 flex flex-col h-full"
                >
                  <div className="relative w-full h-64 overflow-hidden  flex items-center justify-center p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <div className="hidden w-full h-full items-center justify-center flex-col text-blue-400">
                      <FiPackage size={48} />
                      <span className="text-sm mt-3 text-blue-500 font-medium">
                        No Image Available
                      </span>
                    </div>

                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product.discounted_price && (
                        <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                          -{product.discount_percentage}% OFF
                        </span>
                      )}
                      {product.amazing_offer && (
                        <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                          <PiLightningFill size={12} />
                          {product.amazing_offer}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 p-5 space-y-4">
                    <h3 className="font-semibold text-blue-900 text-lg line-clamp-2 group-hover:text-cyan-700 transition-colors duration-200 leading-tight">
                      {product.name}
                    </h3>

                    <p className="text-blue-600 text-sm line-clamp-3 leading-relaxed">
                      {product.description}
                    </p>

                    {product.average_rating && (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FiStar
                              key={star}
                              size={16}
                              className={`${
                                star <= Math.floor(product.average_rating)
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-blue-600 font-medium text-sm">
                          {product.average_rating}
                        </span>
                        {product.comment_count > 0 && (
                          <span className="text-blue-500 text-sm">
                            ({product.comment_count} reviews)
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      {product.discounted_price ? (
                        <>
                          <span className="text-2xl font-bold text-blue-900">
                            ${formatPrice(product.discounted_price)}
                          </span>
                          <span className="text-lg text-rose-500 line-through">
                            ${formatPrice(product.price)}
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-blue-900">
                          ${formatPrice(product.price)}
                        </span>
                      )}
                    </div>

                    <div
                      className={`text-sm font-medium px-3 py-1 rounded-full w-fit ${
                        product.stock_quantity > 10
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : product.stock_quantity > 0
                          ? "bg-amber-100 text-amber-700 border border-amber-200"
                          : "bg-red-100 text-red-700 border border-red-200"
                      }`}
                    >
                      {product.stock_quantity > 10
                        ? "In Stock"
                        : product.stock_quantity > 0
                        ? `Only ${product.stock_quantity} left`
                        : "Out of Stock"}
                    </div>
                  </div>

                  <div className="px-5 pb-5">
                    <div className="flex justify-between items-center pt-4 border-t border-blue-100">
                      <span className="text-blue-600 font-medium text-sm">
                        View Full Details
                      </span>
                      <FiArrowRight
                        className="text-blue-400 group-hover:text-cyan-500 group-hover:translate-x-2 transition-all duration-300"
                        size={18}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {collection.products.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 border border-blue-200 max-w-2xl mx-auto">
                  <FiPackage className="text-blue-400 mx-auto mb-6" size={80} />
                  <h3 className="text-2xl font-bold text-blue-800 mb-3">
                    No products in this collection
                  </h3>
                  <p className="text-blue-600 text-lg mb-8">
                    This collection is currently empty. Check back later for new
                    products!
                  </p>
                  <button
                    onClick={() => navigate("/")}
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-lg hover:shadow-xl transition-all duration-300 font-medium text-lg"
                  >
                    Explore Other Collections
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}
      {notFound && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
          <div className="text-center">
            <FiPackage className="text-blue-400 mx-auto mb-4" size={48} />
            <h3 className="text-xl font-semibold text-blue-800 mb-2">
              Collection not found
            </h3>
            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CollectionPage;
