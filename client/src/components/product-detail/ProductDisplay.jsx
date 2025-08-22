import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import toast from "react-hot-toast";

import { getCartProducts, addToCart } from "../../services/cartAPIServices";

import { FiShoppingCart, FiHeart, FiStar, FiShare2 } from "react-icons/fi";
import { BiSolidOffer } from "react-icons/bi";

import ProductImageCarousel from "../ProductImageCarousel";

const ProductDisplay = ({
  product,
  reloadComponent,
  setReloadComponent,
  setAddToCartPopup,
  setSelectedProduct,
  setRremoveFromCartPopup,
}) => {
  const { id } = useParams();
  const [currentImage, setCurrentImage] = useState(null);
  const [isInCart, setIsInCart] = useState();
  const [showImages, setShowImages] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      const cartProductsRes = await getCartProducts(
        localStorage.getItem("userID")
      );

      setIsInCart(() => {
        const hasCart = cartProductsRes.data.items.find((cartProduct) => {
          return cartProduct.product == product.id;
        });
        return hasCart;
      });
    };

    fetchCartItems();
  }, [reloadComponent]);

  return (
    <div className="grid md:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-8">
      {/* Product Image Gallery */}
      <div className="flex flex-col items-center">
        <div
          onClick={() => {
            setImages([{ image: product.image }, ...product.images_set]);
            setShowImages(true);
          }}
          className="flex justify-center items-center cursor-pointer p-3 sm:p-4 rounded-lg sm:rounded-2xl border border-blue-300 shadow-inner mb-4 w-full h-[260px] md:min-w-[360px] md:h-[360px]"
        >
          <img
            src={currentImage || product.image}
            alt={product.name}
            className="max-w-full max-h-full object-contain rounded-lg"
            // className="max-w-full max-h-full object-contain rounded-md" ?? check it !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          />
        </div>

        <div className="flex flex-wrap gap-2 py-2 w-full">
          <button
            key={"main-image"}
            onClick={() => setCurrentImage(product.image)}
            className={`w-14 h-14 md:w-18 md:h-18 cursor-pointer rounded-lg overflow-hidden ring-2 transition-all duration-200 ${
              currentImage === product.image || !currentImage
                ? "ring-blue-500 scale-105"
                : "ring-transparent hover:ring-blue-300"
            }`}
          >
            <img
              src={product.image}
              alt={`Thumbnail`}
              className="w-full h-full object-cover"
            />
          </button>
          {/* <div
            key="main-image"
            onClick={() => setCurrentImage(product.image)}
            className={`flex-shrink-0 w-14 h-14 md:w-18 md:h-18 cursor-pointer overflow-hidden rounded-lg ${
              currentImage === product.image || !currentImage
                ? "ring-2 ring-blue-400"
                : ""
            }`}
          >
            <img
              src={product.image}
              alt={`Product Main`}
              className="w-full h-full object-cover"
            />
          </div> */}

          {product.images_set.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setCurrentImage(image.image)}
              className={`w-14 h-14 md:w-18 md:h-18 cursor-pointer rounded-lg overflow-hidden ring-2 transition-all duration-200 ${
                currentImage === image.image
                  ? "ring-blue-500 scale-105"
                  : "ring-transparent hover:ring-blue-300"
              }`}
            >
              <img
                src={image.image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
          {/* {product.images_set.map((img, index) => (
            <div
              key={img.id}
              onClick={() => setCurrentImage(img.image)}
              className={`flex-shrink-0 w-14 h-14 md:w-18 md:h-18 cursor-pointer overflow-hidden rounded-lg ${
                currentImage === img.image ? "ring-2 ring-blue-400" : ""
              }`}
            >
              <img
                src={img.image}
                alt={`Product ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))} */}
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold text-blue-900 mb-3">
          {product.name}
        </h2>

        <p className="text-blue-700 line-clamp-3">
          {product.short_description}
        </p>

        {/* Rating Section */}
        <div className="flex items-center mb-3 gap-2">
          <div className="flex items-center bg-blue-100 px-2 py-1 rounded-full">
            <FiStar className="text-yellow-500 fill-yellow-500 mr-1 mb-0.5" />
            <span className="font-medium text-blue-800">
              {product.average_rating?.toFixed(1) || "0"}
            </span>
          </div>
          <span className="text-sm text-blue-600">
            ({product.comment_count || 0} reviews)
          </span>
        </div>

        <div className="flex items-center mb-4 md:mb-6 flex-wrap gap-3">
          <span className="text-2xl sm:text-3xl font-bold text-blue-900">
            ${product.discounted_price || product.price}
          </span>
          {product.discounted_price && (
            <span className="text-lg text-rose-500 line-through ml-1">
              ${product.price}
            </span>
          )}
          {product.discount_percentage && (
            <div className="right-3 flex bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
              <span className="mt-0.25 mr-1">
                {product.discount_percentage}{" "}
              </span>
              <BiSolidOffer className="" size={18} />
            </div>
          )}
        </div>

        {/* Stock Status */}
        <div className="mb-4 flex items-center">
          <span
            className={`inline-block w-2 h-2 rounded-full mr-2 mb-0.25 ${
              product.stock_quantity > 10
                ? "bg-green-500"
                : product.stock_quantity > 0
                ? "bg-amber-400"
                : "bg-red-500"
            }`}
          ></span>
          <span className="text-sm">
            {product.stock_quantity > 0
              ? `In Stock (${product.stock_quantity} available)`
              : "Out of Stock"}
          </span>
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

        <div className="flex flex-col sm:flex-row gap-3 md:gap-1 lg:gap-4">
          {isInCart ? (
            <button
              onClick={() => {
                console.log(product);
                console.log(isInCart);
                setSelectedProduct(() => {
                  const currentPrice = product.discounted_price
                    ? product.discounted_price
                    : product.price;
                  const payload = {
                    id: isInCart.id,
                    image: product.image,
                    name: product.name,
                    price: currentPrice,
                    stock_quantity: product.stock_quantity,
                  };

                  return payload;
                });
                setRremoveFromCartPopup(true);
              }}
              className="flex-1 text-base md:text-sm lg:text-base cursor-pointer py-3 rounded-lg sm:rounded-xl font-semibold transition-colors duration-300 flex items-center justify-center bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-700 hover:to-red-600 text-white"
            >
              <FiShoppingCart className="mr-2 mb-0.5" /> Remove from Cart
            </button>
          ) : (
            <button
              onClick={() => {
                setSelectedProduct(product);
                const response = addToCart({
                  product: id,
                  quantity: 1,
                  cart: localStorage.getItem("userID"),
                });
                response.then(() => {
                  setAddToCartPopup(true);
                  setReloadComponent(!reloadComponent);
                });
              }}
              className="flex-1 text-base md:text-sm lg:text-base cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white py-3 rounded-lg sm:rounded-xl font-semibold transition-colors duration-300 flex items-center justify-center"
            >
              <FiShoppingCart className="mr-2 mb-0.5" /> Add to Cart
            </button>
          )}
          <button className="flex-1 text-base md:text-sm lg:text-base cursor-pointer bg-white border border-blue-300 text-blue-700 py-3 rounded-lg sm:rounded-xl font-medium hover:bg-blue-50 transition-colors duration-300 flex items-center justify-center">
            <FiHeart className="mr-2 text-rose-500" /> Add to Wishlist
          </button>
        </div>

        {/* Specifications */}
        {/* <div className="mt-6 space-y-3">
          <h3 className="font-semibold text-blue-900 border-b pb-2">
            Specifications
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-blue-600">Brand:</span> {product.brand}
            </div>
            <div>
              <span className="text-blue-600">SKU:</span> {product.sku}
            </div>
            <div>
              <span className="text-blue-600">Weight:</span> {product.weight}
            </div>
            <div>
              <span className="text-blue-600">Dimensions:</span>{" "}
              {product.dimensions}
            </div>
          </div>
        </div> */}

        {/* Social Sharing */}
        <div className="mt-6 flex items-center justify-between border-t border-blue-500 pt-4">
          <span className="text-sm text-blue-600">Share this product:</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const currentUrl = window.location.href;
                navigator.clipboard.writeText(currentUrl).then(() => {
                  toast.custom((t) => (
                    <div
                      className={`${
                        t.visible ? "animate-enter" : "animate-leave"
                      } transform transition-all duration-300`}
                    >
                      <div className="bg-gradient-to-r from-green-500 to-cyan-400 text-white px-6 py-3 rounded-xl shadow-lg border border-white/30 backdrop-blur-md flex items-center space-x-3">
                        <div>
                          <p className="font-medium">Copied</p>
                        </div>
                      </div>
                    </div>
                  ));
                });
              }}
              className="p-2 rounded-full bg-blue-100 text-blue-600 cursor-pointer hover:bg-blue-200 transition-colors duration-300"
            >
              <FiShare2 />
            </button>
          </div>
        </div>
      </div>
      {showImages && (
        <ProductImageCarousel
          images={images}
          onClose={() => setShowImages(false)}
        />
      )}
    </div>
  );
};

export default ProductDisplay;
