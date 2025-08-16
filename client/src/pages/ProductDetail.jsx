import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiChevronLeft,
  FiShoppingCart,
  FiTag,
  FiStar,
  FiClock,
  FiUser,
  FiHeart,
  FiAlertCircle,
  FiX,
  FiCheckCircle,
} from "react-icons/fi";

import toast from "react-hot-toast";

import { getProduct } from "../services/productAPIServices";
import { getComments, sendComment } from "../services/commentAPIServices";
import { getShopkeeper } from "../services/userAPIServices";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [productComments, setProductComments] = useState(null);
  const [seller, setSeller] = useState(null);

  const [commentText, setCommentText] = useState("");

  const [selectedStars, setSelectedStars] = useState(1);

  const [currentImage, setCurrentImage] = useState(null);

  // const [rating, setRating] = useState(0);
  // const [hover, setHover] = useState(0);
  // const [comment, setComment] = useState("");
  // const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const selectedProduct = await getProduct(id);
      setProduct(selectedProduct.data);

      const allComments = await getComments();
      const comments = allComments.data.map((comment) => {
        return comment.product == id ? comment : null;
      });

      const seller = getShopkeeper(selectedProduct.data.storekeeper);
      seller.then((res) => {
        console.log(res.data);
        setSeller(res.data);
      });

      setProductComments(comments.filter(Boolean));
      console.log(selectedProduct.data);
    };
    fetchData();
  }, [id]);

  // const handleSubmitReview = (e) => {
  //   e.preventDefault();
  //   if (comment.trim() !== "" && rating > 0) {
  //     const newReview = { text: comment, rating };
  //     setReviews([newReview, ...reviews]);
  //     setComment("");
  //     setRating(0);
  //   }
  // };

  const showValidationError = () => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } bg-gradient-to-r from-amber-500 to-amber-400 text-white px-6 py-4 rounded-xl shadow-lg border border-white/30 backdrop-blur-md flex items-center gap-3 max-w-md`}
      >
        <FiAlertCircle className="text-xl mb-0.5" />
        <div>
          <p className="text-md text-white">
            Please write your comment before submitting
          </p>
        </div>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="ml-auto p-1 hover:bg-white/20 cursor-pointer rounded-full transition-colors"
        >
          <FiX />
        </button>
      </div>
    ));
  };

  if (!product || !productComments || !seller)
    return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="bg-blue-100">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="lg:col-span-3 sm:px-5 sm:py-5 lg:px-0 lg:flex lg:justify-center"
      >
        <div className="bg-white/95 backdrop-blur-xl sm:rounded-3xl shadow-lg p-5 sm:p-6 2xl:p-8 border border-blue-400 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300">
          <div className="max-w-6xl mx-auto">
            {/* header */}
            <div className="sm:flex sm:items-center mb-6">
              <div className="flex items-center mb-3 sm:mb-0">
                <FiShoppingCart className="text-blue-600 mr-3" size={22} />
                <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  {product.name}
                </h1>
              </div>
              <span className="ml-auto bg-blue-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">
                Seller Information
              </h3>
              <div className="flex items-center">
                <div className="w-13 h-13 rounded-full bg-blue-100 mr-3 ring-2 ring-blue-500">
                  {/* <FiUser className="text-blue-600" size={20} /> */}
                  <img src={`${seller.image}`} alt="" className="rounded-4xl" />
                </div>
                <div>
                  <p className="font-medium text-blue-900">
                    {seller.store_name}
                  </p>
                  <p className="text-sm text-blue-600">
                    Member since:{" "}
                    {new Date(seller.created_time).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Image Gallery */}
              <div className="flex flex-col">
                {/* Main Image */}
                <div className="flex justify-center items-center bg-blue-50/70 p-6 rounded-2xl border border-blue-200 shadow-inner mb-4 h-[200px] md:w-[400px] md:h-[400px]">
                  <img
                    src={currentImage || product.image}
                    alt={product.name}
                    className="max-w-full max-h-full w-auto h-auto object-contain rounded-xl"
                  />
                </div>

                {/* Thumbnails */}
                <div className="flex gap-2 overflow-x-auto py-2">
                  {/* ابتدا تصویر اصلی را نمایش می‌دهیم */}
                  <div
                    key="main-image"
                    onClick={() => setCurrentImage(product.image)}
                    className={`flex-shrink-0 w-18 h-18 cursor-pointer rounded-lg border-2 ${
                      currentImage === product.image || !currentImage
                        ? "border-blue-500"
                        : "border-blue-300"
                    }`}
                  >
                    <img
                      src={product.image}
                      alt={`Product Main`}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>

                  {/* سپس بقیه تصاویر را نمایش می‌دهیم */}
                  {product.images_set.map((img, index) => (
                    <div
                      key={img.id}
                      onClick={() => setCurrentImage(img.image)}
                      className={`flex-shrink-0 w-18 h-18 cursor-pointer rounded-lg border-2 ${
                        currentImage === img.image
                          ? "border-blue-500"
                          : "border-blue-300"
                      }`}
                    >
                      <img
                        src={img.image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* product details */}
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold text-blue-900 mb-3">
                  {product.name}
                </h2>
                <p className="text-blue-700 mb-4">{product.description}</p>

                {/* price */}
                <div className="flex items-center mb-6">
                  <span className="text-3xl font-bold text-blue-900">
                    ${product.discounted_price}
                  </span>
                  {product.discounted_price !== product.price && (
                    <span className="text-lg text-blue-500 line-through ml-3">
                      ${product.price}
                    </span>
                  )}
                  {product.discount_percentage && (
                    <span className="ml-3 text-sm font-medium bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-3 py-1 rounded-full">
                      {product.discount_percentage}% OFF
                    </span>
                  )}
                </div>

                {/* amazing offer */}
                {product.amazing_offer && (
                  <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-200">
                    <p className="text-blue-800 font-semibold">
                      {product.amazing_offer}
                    </p>
                    <p className="text-sm text-blue-600">
                      Valid until:{" "}
                      {new Date(
                        product.amazing_offer_period
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center">
                    <FiShoppingCart className="mr-2" /> Add to Cart
                  </button>
                  <button className="flex-1 bg-white border border-blue-300 text-blue-700 py-3 rounded-xl font-medium hover:bg-blue-50 transition-colors duration-300 flex items-center justify-center">
                    <FiHeart className="mr-2 text-rose-500" /> Add to Wishlist
                  </button>
                </div>
              </div>
            </div>

            {/* reviews & rating */}
            <div className="mt-12">
              <h3 className="text-xl font-bold text-blue-900 mb-6">
                Customer Reviews ({product.comment_count})
              </h3>

              {/* leave a review */}
              <div className="mb-10 bg-white/80 border border-blue-200 p-6 rounded-2xl shadow-lg">
                <h4 className="text-lg font-semibold text-blue-800 mb-4">
                  Leave a Review
                </h4>
                <div className="flex items-center mb-4 space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      size={22}
                      onMouseOver={() => setSelectedStars(i + 1)}
                      className={`cursor-pointer transition-colors ${
                        i < selectedStars
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300 fill-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <textarea
                  rows={4}
                  value={commentText}
                  onChange={(e) => {
                    setCommentText(e.target.value);
                  }}
                  placeholder="Write your comment..."
                  className="w-full p-4 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none text-blue-900"
                />
                <button
                  onClick={() => {
                    if (commentText.split(" ").join("") != "") {
                      console.log(commentText.split(" ").join(""));
                      const res = sendComment({
                        user: 5,
                        text: commentText,
                        rating: selectedStars,
                        product: id,
                      });
                      res
                        .then(() => {
                          setCommentText("");
                          setSelectedStars(1);
                          toast.custom((t) => (
                            <div
                              className={`${
                                t.visible ? "animate-enter" : "animate-leave"
                              } 
      transform transition-all duration-300`}
                            >
                              <div className="bg-gradient-to-r from-green-500 to-cyan-400 text-white px-6 py-3 rounded-xl shadow-lg border border-white/30 backdrop-blur-md flex items-center space-x-3">
                                <div className="bg-blue-500/20 p-2 rounded-full">
                                  <FiCheckCircle className="text-xl text-white" />
                                </div>
                                <div>
                                  <p className="font-medium">
                                    Your comment was successfully sent
                                  </p>
                                </div>
                              </div>
                            </div>
                          ));
                        })
                        .catch((err) => {
                          toast.custom((t) => (
                            <div
                              className={`${
                                t.visible ? "animate-enter" : "animate-leave"
                              } bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-4 rounded-xl shadow-lg border border-white/20 backdrop-blur-md flex items-center space-x-3 rtl:space-x-reverse`}
                              style={{ fontFamily: "Roboto" }}
                            >
                              <FiX className="text-xl shrink-0" />
                              <span className="font-medium">
                                {err.response.data.rating[0]}
                              </span>
                            </div>
                          ));
                        });
                    } else {
                      showValidationError();
                    }
                  }}
                  className="mt-4 cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-6 py-2 rounded-md font-medium transition-colors duration-300"
                >
                  Submit Review
                </button>
              </div>

              {/* reviews list */}
              <div className="space-y-3">
                {productComments.map((comment, inx) => {
                  return (
                    <div key={inx} className="space-y-6">
                      <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 shadow-sm">
                        <div className="flex justify-between">
                          <div className="flex items-center mb-2">
                            <span className="font-semibold text-blue-800 mr-2">
                              User {comment.user}
                            </span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <FiStar
                                  key={i}
                                  size={16}
                                  className={`cursor-pointer transition-colors ${
                                    i < comment.rating
                                      ? "text-yellow-500 fill-yellow-500"
                                      : "text-gray-300 fill-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-xs ml-3 text-blue-500">
                            {comment.updated_time}
                          </span>
                        </div>

                        <p className="text-blue-700 text-sm">{comment.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductDetails;
