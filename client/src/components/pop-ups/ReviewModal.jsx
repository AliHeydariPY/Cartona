import { Portal } from "react-portal";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiStar, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import toast from "react-hot-toast";
import { sendComment } from "../../services/commentAPIServices";

const ReviewPopup = ({ onClose, product, seller, setReloadComponent }) => {
  const [show, setShow] = useState(false);
  const [selectedStars, setSelectedStars] = useState(1);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 10);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => onClose(), 300);
  };

  const stopPropagation = (e) => e.stopPropagation();

  const handleSubmit = async () => {
    if (seller.user == localStorage.getItem("userID")) {
      toast.error("The seller cannot leave comments");
      return;
    }

    if (commentText.trim() === "") {
      showValidationError("Please write your comment before submitting");
      return;
    }

    setIsSubmitting(true);
    try {
      await sendComment({
        user: localStorage.getItem("userID"),
        text: commentText,
        rating: selectedStars,
        product: product.id,
      });

      setCommentText("");
      setSelectedStars(1);
      setReloadComponent((prev) => !prev);
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } transform transition-all duration-300`}
        >
          <div className="bg-gradient-to-r from-green-500 to-cyan-400 text-white px-6 py-3 rounded-xl shadow-lg border border-white/30 backdrop-blur-md flex items-center space-x-3">
            <div className="bg-blue-500/20 p-2 rounded-full">
              <FiCheckCircle className="text-xl text-white" />
            </div>
            <div>
              <p className="font-medium">Your comment was successfully sent</p>
            </div>
          </div>
        </div>
      ));
      handleClose();
    } catch (err) {
      console.log(err);
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-4 rounded-xl shadow-lg border border-white/20 backdrop-blur-md flex items-center space-x-3 rtl:space-x-reverse`}
        >
          <FiX className="text-xl shrink-0" />
          <span className="font-medium">{err.response.data.rating[0]}</span>
        </div>
      ));
    } finally {
      setIsSubmitting(false);
    }
  };

  const showValidationError = (context) => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } bg-gradient-to-r from-amber-500 to-amber-400 text-white px-6 py-4 rounded-xl shadow-lg border border-white/30 backdrop-blur-md flex items-center gap-3 max-w-md`}
      >
        <FiAlertCircle className="text-xl mb-0.5" />
        <div>
          <p className="text-md text-white">{context}</p>
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

  return (
    <Portal>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 "
            onClick={handleClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-lg sm:max-w-md relative overflow-hidden"
              onClick={stopPropagation}
            >
              {/* هدر */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-4 sm:p-6 text-white">
                <div className="flex flex-row justify-between items-center gap-3 sm:gap-0">
                  <div className="flex items-center">
                    <div className="bg-white/20 p-2 rounded-full mr-3">
                      <FiStar className="text-white" size={22} />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold">
                        Rate Product
                      </h3>
                      <p className="text-blue-100/90 text-xs sm:text-sm mt-1">
                        Share your experience with {product.name}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 cursor-pointer rounded-full hover:bg-white/20 transition-colors duration-300 self-end sm:self-auto"
                  >
                    <FiX size={22} className="text-white" />
                  </button>
                </div>
              </div>

              {/* محتوا */}
              <div className="p-4 sm:p-6">
                {/* ستاره‌ها */}
                <div className="mb-3 sm:mb-4">
                  <label className="block text-sm font-medium text-blue-800 mb-1 sm:mb-2">
                    Your Rating
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onMouseEnter={() => setSelectedStars(star)}
                        onClick={() => setSelectedStars(star)}
                        className="transition-transform duration-200 hover:scale-110"
                      >
                        <FiStar
                          size={28}
                          className={`${
                            star <= selectedStars
                              ? "text-amber-400 fill-amber-400"
                              : "text-gray-300 fill-gray-300"
                          } transition-colors duration-200`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* textarea */}
                <div className="mb-5 sm:mb-6">
                  <textarea
                    rows={3}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your thoughts about this product..."
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/80 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder-blue-400/70 text-blue-900 transition-all duration-300 text-sm sm:text-base"
                  />
                </div>

                {/* دکمه‌ها */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <button
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="px-4 py-2 sm:py-3 cursor-pointer bg-white border border-blue-300 text-blue-700 rounded-xl hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium text-sm sm:text-base"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-4 py-2 sm:py-3 cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:from-blue-700 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 font-semibold flex items-center justify-center text-sm sm:text-base"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <FiCheckCircle className="mr-2" size={18} />
                        Submit Review
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* فوتر */}
              <div className="px-4 sm:px-6 pb-4">
                <p className="text-[10px] sm:text-xs text-blue-500/80 text-center">
                  Your review helps other shoppers make better decisions
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
};

export default ReviewPopup;
