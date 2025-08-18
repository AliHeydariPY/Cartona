import { useState } from "react";

import {
  FiShoppingCart,
  FiHeart,
} from "react-icons/fi";

const ProductDisplay = ({product}) => {
      const [currentImage, setCurrentImage] = useState(null);
    
  return (
    <div className="grid md:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-8">
      {/* Product Image Gallery */}
      <div className="flex flex-col items-center">
        <div className="flex justify-center items-center bg-blue-50/70 p-4 md:p-6 rounded-lg sm:rounded-2xl border border-blue-200 shadow-inner mb-4 w-full h-[260px] md:min-w-[360px] md:h-[360px]">
          <img
            src={currentImage || product.image}
            alt={product.name}
            className="min-w-40 max-w-full max-h-full object-contain rounded-xl sm:rounded-xl"
          />
        </div>

        <div className="flex flex-wrap gap-2 py-2 w-full">
          <div
            key="main-image"
            onClick={() => setCurrentImage(product.image)}
            className={`flex-shrink-0 w-14 h-14 md:w-18 md:h-18 cursor-pointer overflow-hidden rounded-lg border-2 ${
              currentImage === product.image || !currentImage
                ? "border-blue-500"
                : "border-blue-300"
            }`}
          >
            <img
              src={product.image}
              alt={`Product Main`}
              className="w-full h-full object-cover"
            />
          </div>

          {product.images_set.map((img, index) => (
            <div
              key={img.id}
              onClick={() => setCurrentImage(img.image)}
              className={`flex-shrink-0 w-14 h-14 md:w-18 md:h-18 cursor-pointer overflow-hidden rounded-lg border-2 ${
                currentImage === img.image
                  ? "border-blue-500"
                  : "border-blue-300"
              }`}
            >
              <img
                src={img.image}
                alt={`Product ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold text-blue-900 mb-3">
          {product.name}
        </h2>
        {/* <p className="text-blue-700 mb-4">{product.description}</p> */}

        <div className="flex items-center mb-4 md:mb-6 flex-wrap gap-3">
          <span className="text-2xl sm:text-3xl font-bold text-blue-900">
            ${product.discounted_price}
          </span>
          {product.discounted_price !== product.price && (
            <span className="text-lg text-blue-500 line-through ml-1">
              ${product.price}
            </span>
          )}
          {product.discount_percentage && (
            <span className="ml-1 text-sm font-medium bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-2 sm:px-3 py-1 rounded-full">
              {product.discount_percentage}% OFF
            </span>
          )}
        </div>

        {product.amazing_offer && (
          <div className="mb-4 md:mb-6 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-200">
            <p className="text-blue-800 font-semibold">
              {product.amazing_offer}
            </p>
            <p className="text-sm text-blue-600">
              Valid until:{" "}
              {new Date(product.amazing_offer_period).toLocaleDateString()}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center">
            <FiShoppingCart className="mr-2" /> Add to Cart
          </button>
          <button className="flex-1 bg-white border border-blue-300 text-blue-700 py-3 rounded-lg sm:rounded-xl font-medium hover:bg-blue-50 transition-colors duration-300 flex items-center justify-center">
            <FiHeart className="mr-2 text-rose-500" /> Add to Wishlist
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;
