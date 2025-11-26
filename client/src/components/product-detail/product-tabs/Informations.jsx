import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { containerVariants, itemVariants } from "../../../utils/animations";
import {
  getCollection,
  getProduct,
} from "../../../services/productAPIServices";

import { FiPackage, FiArrowRight, FiZap, FiStar } from "react-icons/fi";

const Informations = ({ product }) => {
  const [collectionProductds, setCollectionProductds] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCollectionProdcts = async () => {
      if (!product.collection) return;

      const collection = await getCollection(product.collection);
      const collectionItems = await Promise.all(
        collection.data.products.map(async (item) => {
          const product = await getProduct(item.id);
          return product.data;
        })
      );

      setCollectionProductds({ ...collection.data, products: collectionItems });
    };

    fetchCollectionProdcts();
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 mt-4 sm:mt-6"
    >
      <motion.div
        variants={itemVariants}
        className="p-6 bg-white/90 border border-blue-200 rounded-2xl shadow-lg"
      >
        <h2 className="text-xl font-semibold text-blue-800 mb-3">
          Product Description
        </h2>
        <p className="text-blue-700 leading-relaxed">{product.description}</p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl shadow-sm"
      >
        <h2 className="text-xl font-semibold text-blue-800 mb-5">
          Product Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {product.features_set && product.features_set.length > 0 ? (
            product.features_set.map((feature) => (
              <div
                key={feature.id}
                className="flex gap-3 p-4 bg-white rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition"
              >
                <div className="min-w-10 max-w-10 max-h-10 min-h-10 flex items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-bold">
                  {feature.feature_name[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm text-blue-900 font-medium">
                    {feature.feature_name}
                  </p>
                  <p className="text-sm text-blue-600">
                    {feature.feature_value}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 bg-white border border-blue-100 rounded-xl text-center text-blue-600 text-sm shadow-sm">
              No features have been registered for this product yet
            </div>
          )}
        </div>
      </motion.div>

      {collectionProductds &&
        collectionProductds.products &&
        collectionProductds.products.length > 1 && (
          <motion.div
            variants={itemVariants}
            className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-2xl shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-blue-800 mb-1">
                  Related Products
                </h2>
                <p className="text-blue-600 text-sm">
                  More from "{collectionProductds.collection_name}" collection
                </p>
              </div>
              <div className="flex items-center gap-2 text-cyan-600 bg-white px-3 py-1 rounded-full border border-cyan-200">
                <FiPackage size={16} />
                <span className="text-sm font-medium">
                  {collectionProductds.products.length} products
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {collectionProductds.products
                .filter((prod) => prod.id !== product.id)
                .slice(0, 3)
                .map((collectionProduct) => (
                  <div
                    key={collectionProduct.id}
                    onClick={() => handleProductClick(collectionProduct.id)}
                    className="group cursor-pointer bg-white rounded-xl border border-blue-200 p-4 hover:border-cyan-300 hover:shadow-xl transition-all duration-300 flex flex-col"
                  >
                    <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden flex items-center justify-center">
                      <img
                        src={collectionProduct.image}
                        alt={collectionProduct.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 p-2"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                      <div className="hidden w-full h-full items-center justify-center flex-col text-blue-400">
                        <FiPackage size={32} />
                        <span className="text-xs mt-2 text-blue-500">
                          No Image
                        </span>
                      </div>

                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {collectionProduct.discounted_price && (
                          <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                            -{collectionProduct.discount_percentage}%
                          </span>
                        )}
                        {collectionProduct.amazing_offer && (
                          <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                            <FiZap size={10} />
                            {collectionProduct.amazing_offer.length < 25 ? collectionProduct.amazing_offer : "Special sale" }
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 space-y-3">
                      <h3 className="font-semibold text-blue-900 text-base line-clamp-2 group-hover:text-cyan-700 transition-colors min-h-[3rem] leading-tight">
                        {collectionProduct.name}
                      </h3>

                      {collectionProduct.average_rating && (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FiStar
                                key={star}
                                size={14}
                                className={`${
                                  star <=
                                  Math.floor(collectionProduct.average_rating)
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-blue-600 font-medium">
                            {collectionProduct.average_rating}
                          </span>
                          {collectionProduct.comment_count > 0 && (
                            <span className="text-sm text-blue-500">
                              ({collectionProduct.comment_count})
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-2 flex-wrap">
                        {collectionProduct.discounted_price ? (
                          <>
                            <span className="text-xl font-bold text-blue-900">
                              ${formatPrice(collectionProduct.discounted_price)}
                            </span>
                            <span className="text-base text-rose-500 line-through">
                              ${formatPrice(collectionProduct.price)}
                            </span>
                          </>
                        ) : (
                          <span className="text-xl font-bold text-blue-900">
                            ${formatPrice(collectionProduct.price)}
                          </span>
                        )}
                      </div>

                      <div
                        className={`text-sm font-medium px-3 py-1.5 rounded-full w-fit ${
                          collectionProduct.stock_quantity > 10
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : collectionProduct.stock_quantity > 0
                            ? "bg-amber-100 text-amber-700 border border-amber-200"
                            : "bg-red-100 text-red-700 border border-red-200"
                        }`}
                      >
                        {collectionProduct.stock_quantity > 10
                          ? "In Stock"
                          : collectionProduct.stock_quantity > 0
                          ? `Only ${collectionProduct.stock_quantity} left`
                          : "Out of Stock"}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-blue-100">
                      <span className="text-sm text-blue-500 font-medium">
                        View Details
                      </span>
                      <FiArrowRight
                        className="text-blue-400 group-hover:text-cyan-500 group-hover:translate-x-2 transition-all duration-300"
                        size={16}
                      />
                    </div>
                  </div>
                ))}
            </div>

            {collectionProductds.products.length > 3 && (
              <div className="flex justify-center mt-8 pt-6 border-t border-blue-200">
                <button
                  onClick={() =>
                    navigate(`/collection/${collectionProductds.id}`)
                  }
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium text-sm transition-colors cursor-pointer duration-200 flex items-center gap-2 px-6 py-3 rounded-lg hover:from-blue-600 hover:to-cyan-600"
                >
                  View all {collectionProductds.products.length} products
                  <FiArrowRight size={16} />
                </button>
              </div>
            )}
          </motion.div>
        )}
    </motion.div>
  );
};

export default Informations;
