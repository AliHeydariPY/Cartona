import { motion, AnimatePresence } from "framer-motion";
import { containerVariants, itemVariants } from "../../../utils/animations";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import toast from "react-hot-toast";

import {
  sendComment,
  sendCommentReply,
} from "../../../services/commentAPIServices";

import { FiStar, FiX, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { LuReply } from "react-icons/lu";

const Reviews = ({
  productComments,
  setReloadComponent,
  reloadComponent,
  seller,
}) => {
  const { id } = useParams();
  const [commentText, setCommentText] = useState("");
  const [selectedStars, setSelectedStars] = useState(1);

  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  const [openReplies, setOpenReplies] = useState(null);
  const replyInputRef = useRef(null);

  useEffect(() => {
    if (replyInputRef.current) {
      replyInputRef.current.focus();
    }
  }, [replyingTo]);

  useEffect(() => {
    console.log(productComments);
  }, [productComments]);

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

  const toggleReplies = (commentId) => {
    setOpenReplies(openReplies === commentId ? null : commentId);
  };

  const handleReply = (commentId) => {
    if (replyingTo === commentId) {
      setReplyingTo(null);
      setReplyText("");
    } else {
      setReplyingTo(commentId);
    }
  };

  const sendReply = (commentId) => {
    if (!replyText.trim()) return;
    // sendReplyToComment({ parent: commentId, text: replyText, user: userID })
    sendCommentReply({
      comment: commentId,
      user: localStorage.getItem("userID"),
      text: replyText,
    }).then(() => {
      setReplyText("");
      setReplyingTo(null);
    });
    console.log("Reply sent to comment:", commentId, "text:", replyText);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-5 sm:space-y-6 mt-5 sm:mt-6"
    >
      {/* Leave a Review */}
      <motion.div
        variants={itemVariants}
        className="bg-white/80 border border-blue-200 p-3 sm:p-6 rounded-lg sm:rounded-2xl shadow-lg"
      >
        <h4 className="text-lg font-semibold text-blue-800 mb-2 sm:mb-4">
          Leave a Review
        </h4>
        <div className="flex items-center mb-2 sm:mb-4 space-x-1">
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
          rows={3}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write your comment..."
          className="w-full p-2 sm:p-4 border border-blue-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none text-blue-900 transition-all duration-300"
        />
        <button
          onClick={() => {
            if (seller.user == localStorage.getItem("userID")) {
              toast.custom((t) => (
                <div
                  className={`${
                    t.visible ? "animate-enter" : "animate-leave"
                  } bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-4 rounded-xl shadow-lg border border-white/20 backdrop-blur-md flex items-center space-x-3 rtl:space-x-reverse`}
                >
                  <FiX className="text-xl shrink-0" />
                  <span className="font-medium">
                    The seller cannot leave comments
                  </span>
                </div>
              ));
              setCommentText("");
              setSelectedStars(1);
            } else if (commentText.trim() == "") {
              showValidationError(
                "Please write your comment before submitting"
              );
            } else {
              const res = sendComment({
                user: localStorage.getItem("userID"),
                text: commentText,
                rating: selectedStars,
                product: id,
              });

              res
                .then(() => {
                  setCommentText("");
                  setSelectedStars(1);
                  setReloadComponent(!reloadComponent);
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
                          <p className="font-medium">
                            Your comment was successfully sent
                          </p>
                        </div>
                      </div>
                    </div>
                  ));
                })
                .catch((err) => {
                  console.log(err);
                  toast.custom((t) => (
                    <div
                      className={`${
                        t.visible ? "animate-enter" : "animate-leave"
                      } bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-4 rounded-xl shadow-lg border border-white/20 backdrop-blur-md flex items-center space-x-3 rtl:space-x-reverse`}
                    >
                      <FiX className="text-xl shrink-0" />
                      <span className="font-medium">
                        {err.response.data.rating[0]}
                      </span>
                    </div>
                  ));
                });
            }
          }}
          className="mt-2 sm:mt-4 cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-4 sm:px-6 py-2 rounded-lg sm:rounded-lg font-medium transition-colors duration-300"
        >
          Submit Review
        </button>
      </motion.div>

      {/* Reviews List */}
      <motion.div variants={itemVariants} className="space-y-3 sm:space-y-4">
        {productComments.length === 0 && (
          <p className="text-blue-600">No comment have been asked yet.</p>
        )}

        {productComments.map((comment) => (
          <div key={comment.id} className="space-y-1 sm:space-y-2 ">
            <div className="p-3 sm:p-4 bg-blue-50/60 rounded-lg sm:rounded-xl border border-blue-200 shadow-sm">
              <div className="flex justify-between mb-1 sm:mb-2">
                <div className="flex items-center">
                  <span className="font-semibold text-blue-800 mr-2">
                     {comment.user}
                  </span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        size={16}
                        className={`${
                          i < comment.rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300 fill-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs ml-2 text-blue-500">
                  {comment.updated_time}
                </span>
              </div>
              <div style={{ whiteSpace: 'pre-wrap' }} className="text-blue-700 text-sm">{comment.text}</div>
              <div className="flex justify-between">
                <button
                  onClick={() => handleReply(comment.id)}
                  className="mt-1 sm:mt-2 cursor-pointer flex items-center text-blue-600 text-sm hover:text-blue-800 transition-colors"
                >
                  <LuReply
                    className="mr-1"
                    size={16}
                    style={{ transform: "rotate(180deg)" }}
                  />{" "}
                  Reply
                </button>
                {comment.replies && comment.replies.length > 0 && (
                  <button
                    onClick={() => toggleReplies(comment.id)}
                    className="mt-2 cursor-pointer text-blue-600 text-sm hover:text-blue-800 transition-colors"
                  >
                    {openReplies === comment.id
                      ? "Hide Replies"
                      : `Show Replies (${comment.replies.length})`}
                  </button>
                )}
              </div>
            </div>

            <AnimatePresence>
              {replyingTo === comment.id && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }} // شروع محو و کمی بالاتر
                  animate={{ opacity: 1, y: 0 }} // پایان انیمیشن: کامل ظاهر
                  exit={{ opacity: 0, y: -10 }} // هنگام بسته شدن: دوباره محو و بالا بره
                  transition={{ duration: 0.3 }} // سرعت انیمیشن
                  className="ml-3 sm:ml-6 mt-1 sm:mt-2 bg-white border border-blue-200 rounded-lg sm:rounded-lg p-2 sm:p-3 shadow-md"
                >
                  <textarea
                    ref={replyInputRef}
                    rows={2}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write your reply..."
                    className="w-full p-1 sm:p-2 border border-blue-300 rounded-lg sm:rounded-lg focus:ring-1 focus:ring-blue-400 focus:outline-none text-blue-900 transition-all duration-300"
                  />
                  <div className="flex justify-end mt-1 sm:mt-2 space-x-1 sm:space-x-2">
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="px-2 py-1 cursor-pointer rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 text-xs sm:text-sm transition-colors duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        sendReply(comment.id);
                        setReloadComponent(!reloadComponent);
                      }}
                      className="px-3 py-1 cursor-pointer rounded-md bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 text-xs sm:text-sm transition-colors duration-300"
                    >
                      Send
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {openReplies === comment.id &&
                comment.replies &&
                comment.replies.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="ml-3 sm:ml-6 space-y-1 sm:space-y-2 mt-1 sm:mt-2"
                  >
                    {comment.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className="p-2 sm:p-3 bg-white border border-blue-200 rounded-lg sm:rounded-lg shadow-sm"
                      >
                        <div className="flex justify-between mb-1">
                          <span className="font-medium text-blue-700 text-xs sm:text-sm">
                            User {reply.user}
                          </span>
                          <span className="text-xs text-blue-400">
                            {reply.updated_time}
                          </span>
                        </div>
                         <p  style={{ whiteSpace: 'pre-wrap' }}  className="text-blue-800 text-sm">{reply.text}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
            </AnimatePresence>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Reviews;
