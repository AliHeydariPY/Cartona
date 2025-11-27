import { motion } from "framer-motion";
import {
  FiMoreHorizontal,
  FiEdit,
  FiTrash2,
  FiImage,
  FiList,
  FiStar,
} from "react-icons/fi";
import { PiLightningFill } from "react-icons/pi";

export default function ProductCard({
  product,
  openMenu,
  setOpenMenu,
  setShowRemovePopup,
  setSelectedProduct,
  openInNewTab,
  navigate,
}) {
  return (
    <motion.div
      layout="position"
      initial={{ opacity: 1, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl border border-gray-200 bg-white transition-all duration-300"
    >
      <div
        onClick={() => openInNewTab(`/product/${product.id}`)}
        className="relative flex cursor-pointer justify-center items-center p-4 md:p-6 rounded-xl sm:rounded-2xl border-2 border-blue-200 shadow-inner w-full h-[260px] md:min-w-[260px] md:h-[260px]"
      >
        <img
          src={product.image}
          alt={product.name}
          className="max-w-full max-h-full object-contain rounded-md"
        />

        {product.amazing_offer && (
          <div className="absolute flex top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
            <PiLightningFill className="mt-0.25 mr-0.75" size={13} />
            {product.amazing_offer.length < 25
              ? product.amazing_offer
              : "Special sale"}
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg font-bold text-blue-900 flex-1 line-clamp-2">
            {product.name}
          </h3>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenu(openMenu === product.id ? null : product.id);
              }}
              className={`p-2 cursor-pointer text-blue-600 ${
                openMenu === product.id
                  ? "bg-blue-100 hover:bg-blue-200"
                  : "hover:bg-blue-100"
              } rounded-lg transition-colors duration-200`}
            >
              <FiMoreHorizontal size={18} />
            </button>

            {openMenu === product.id && (
              <div
                className="absolute right-1 bottom-10 sm:right-10 sm:bottom-0 mt-1 w-48 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-blue-200 z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-2 space-y-1">
                  <button
                    onClick={() => {
                      navigate(`edit/${product.id}`);
                      setOpenMenu(null);
                    }}
                    className="flex w-full items-center gap-3 px-3 py-2 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  >
                    <FiEdit className="text-blue-600 mb-0.5" size={16} />{" "}
                    <span className="text-sm font-medium">Edit Product</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate(`images/${product.id}`);
                      setOpenMenu(null);
                    }}
                    className="flex w-full items-center gap-3 px-3 py-2 text-cyan-700 hover:bg-cyan-50 rounded-lg transition-colors duration-200"
                  >
                    <FiImage className="text-cyan-600 mb-0.5" size={16} />{" "}
                    <span className="text-sm font-medium">Manage Images</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate(`features/${product.id}`);
                      setOpenMenu(null);
                    }}
                    className="flex w-full items-center gap-3 px-3 py-2 text-purple-700 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                  >
                    <FiList className="text-purple-600 mb-0.5" size={16} />{" "}
                    <span className="text-sm font-medium">Edit Features</span>
                  </button>

                  <div className="border-t border-blue-100 my-1"></div>

                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowRemovePopup(true);
                      setOpenMenu(null);
                    }}
                    className="flex w-full items-center gap-3 px-3 py-2 text-rose-700 hover:bg-rose-50 rounded-lg transition-colors duration-200"
                  >
                    <FiTrash2 className="text-rose-600 mb-0.5" size={16} />{" "}
                    <span className="text-sm font-medium">Delete Product</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <span className="text-lg font-bold text-blue-900">
            ${product.discounted_price || product.price}
          </span>
          {product.discounted_price && (
            <span className="text-sm text-rose-500 line-through">
              ${product.price}
            </span>
          )}
          {product.discount_percentage && (
            <span className="text-xs bg-gradient-to-r from-rose-500 to-pink-500 text-white px-2 py-1 rounded-full">
              {product.discount_percentage}% OFF
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-blue-100 px-2 py-1 rounded-full">
              <FiStar className="text-yellow-500 fill-yellow-500" size={12} />
              <span className="text-sm text-blue-600 ml-1">
                {product.average_rating?.toFixed(1) || "0"}
              </span>
            </div>
            <span className="text-sm text-blue-600">
              ({product.comment_count || 0})
            </span>
          </div>

          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              product.stock_quantity > 10
                ? "bg-green-100 text-green-700"
                : product.stock_quantity > 0
                ? "bg-amber-100 text-amber-700"
                : "bg-rose-100 text-rose-700"
            }`}
          >
            Stock: {product.stock_quantity}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
