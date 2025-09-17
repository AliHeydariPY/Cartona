import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "../../../utils/animations";

const Informations = ({ product }) => {
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 mt-4 sm:mt-6"
    >
      {/* Product Description */}
      <motion.div
        variants={itemVariants}
        className="p-6 bg-white/90 border border-blue-200 rounded-2xl shadow-lg"
      >
        <h2 className="text-xl font-semibold text-blue-800 mb-3">
          Product Description
        </h2>
        <p className="text-blue-700 leading-relaxed">{product.description}</p>
      </motion.div>

      {/* Product Features */}
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
    </motion.div>
  );
};

export default Informations;
