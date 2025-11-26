import { motion, AnimatePresence } from "framer-motion";
import { containerVariants, itemVariants } from "../../../utils/animations";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import toast from "react-hot-toast";

import {
  sendComment,
  sendCommentReply,
} from "../../../services/commentAPIServices";

import {
  FiStar,
  FiX,
  FiAlertCircle,
  FiEdit3,
  FiTrash2,
  FiSend,
} from "react-icons/fi";
import { LuReply } from "react-icons/lu";

import EditPostPopup from "../../pop-ups/EditPostPopup";
import DeletePostPopup from "../../pop-ups/DeletePostPopup";
import { errorToast, successToast } from "../../../utils/toast";

const Reviews = ({ setProductComments, productComments, user }) => {
  const { id } = useParams();
  const [commentText, setCommentText] = useState("");
  const [selectedStars, setSelectedStars] = useState(1);
  const [showRating, setShowRating] = useState(false);

  const [userPost, setUserPost] = useState({});

  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  const [openReplies, setOpenReplies] = useState(null);
  const replyInputRef = useRef(null);

  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    if (replyInputRef.current) {
      replyInputRef.current.focus();
    }
  }, [replyingTo]);

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
    sendCommentReply({
      comment: commentId,
      text: replyText,
    }).then((res) => {
      setProductComments((prevComments) =>
        prevComments.map((comment) => {
          if (comment.id == commentId) {
            if (comment.replies) {
              return { ...comment, replies: [res.data, ...comment.replies] };
            } else {
              return { ...comment, replies: [res.data] };
            }
          } else {
            return comment;
          }
        })
      );
      setReplyText("");
      setReplyingTo(null);
    });
  };

  const handleSubmit = () => {
    if (commentText.trim() == "") {
      showValidationError("Please write your comment before submitting");
    } else {
      const res = sendComment({
        text: commentText,
        rating: showRating ? selectedStars : null,
        product: id,
      });

      res
        .then((res) => {
          setCommentText("");
          setSelectedStars(1);
          setShowRating(false);

          setProductComments([
            {
              id: res.data.id,
              user: user?.username,
              text: commentText,
              rating: showRating ? selectedStars : null,
              product: id,
            },
            ...productComments,
          ]);

          successToast("Your review was successfully sent");
        })
        .catch((error) => {
          setCommentText("");
          setSelectedStars(1);
          setShowRating(false);
          const errorMessage =
            error.response.data.detail.includes("token")
              ? "To submit a review, first log in to your account"
              : error.response.data.rating;
          errorToast(errorMessage);
        });
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-5 sm:space-y-6 mt-5 sm:mt-6"
    >
      <motion.div
        variants={itemVariants}
        className="bg-white/80 border border-blue-200 p-3 sm:p-6 rounded-lg sm:rounded-2xl shadow-lg"
      >
        <h4 className="text-lg font-semibold text-blue-800 mb-2 sm:mb-4">
          Leave a Review
        </h4>

        <div className="mb-4 sm:mb-6">
          {!showRating ? (
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-sm text-blue-700 font-medium">
                Would you like to rate this product?
              </span>
              <button
                onClick={() => setShowRating(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 text-sm font-medium"
              >
                <FiStar size={14} className="fill-current mb-0.5" />
                Add Rating
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-700">
                  Your Rating:
                </span>
                <button
                  onClick={() => {
                    setShowRating(false);
                    setSelectedStars(1);
                  }}
                  className="cursor-pointer text-xs text-rose-600 hover:text-rose-700 font-medium transition-colors duration-200"
                >
                  Remove Rating
                </button>
              </div>

              <div className="flex justify-center gap-1 sm:gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
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

              {selectedStars > 0 && (
                <div className="text-center">
                  <span className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    {selectedStars} star{selectedStars > 1 ? "s" : ""} selected
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <textarea
          rows={3}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Share your experience with this product..."
          className="w-full p-3 sm:p-4 border border-blue-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none text-blue-900 transition-all duration-300 resize-none"
        />

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
          <button
            onClick={handleSubmit}
            className="flex-1 flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-4 sm:px-6 py-3 rounded-lg font-medium transition-colors duration-300"
          >
            <FiSend size={16} className="mb-0.5" />
            Submit Review
          </button>

          {showRating && (
            <button
              onClick={() => {
                setShowRating(false);
                setSelectedStars(1);
              }}
              className="px-4 sm:px-6 py-3 cursor-pointer bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300 font-medium"
            >
              Cancel Rating
            </button>
          )}
        </div>

        <p className="text-xs text-blue-600 mt-3 text-center">
          {showRating
            ? "Rating is optional but helps other shoppers"
            : "You can submit a review without rating"}
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-3 sm:space-y-4">
        {productComments.length === 0 && (
          <p className="text-blue-600">No comment have been asked yet.</p>
        )}

        {productComments.slice(0, visibleCount).map((comment) => {
          const isUserReview = comment.user == user?.username;
          return (
            <div key={comment.id} className="space-y-2 xs:space-y-3">
              <div
                className={`p-3 xs:p-4 rounded-lg sm:rounded-xl border shadow-sm ${
                  isUserReview
                    ? "bg-blue-100/50 border-2 border-blue-400"
                    : "bg-blue-50/60 border-blue-200"
                }`}
              >
                <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-2 xs:gap-3 mb-2 xs:mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1 xs:mb-2">
                      <span className="font-semibold text-blue-800 text-sm xs:text-base truncate">
                        {comment.user}
                      </span>

                      <div className="flex items-center gap-2">
                        {comment.rating && (
                          <div className="flex mb-0.5">
                            {[...Array(5)].map((_, i) => (
                              <FiStar
                                key={i}
                                size={14}
                                className={`xs:size-[16px] ${
                                  i < comment.rating
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-gray-300 fill-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        )}
                        <span className="text-xs text-blue-500 whitespace-nowrap">
                          {comment.updated_time}
                        </span>
                      </div>
                    </div>

                    <div className="text-blue-700 text-sm xs:text-base leading-relaxed whitespace-pre-wrap break-words word-break-break-all">
                      {comment.text}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 xs:gap-2 self-end xs:self-start flex-shrink-0">
                    {isUserReview && (
                      <button
                        className="p-1.5 xs:p-2 cursor-pointer rounded-full hover:bg-blue-100 text-blue-600 transition-colors duration-300 flex-shrink-0"
                        onClick={() => {
                          setUserPost({
                            id: comment.id,
                            type: "Review",
                            text: comment.text,
                            rating: comment.rating,
                          });
                          setShowEditPopup(true);
                        }}
                        title="Edit review"
                      >
                        <FiEdit3 size={16} className="xs:size-[18px]" />
                      </button>
                    )}
                    {isUserReview && (
                      <button
                        className="p-1.5 xs:p-2 cursor-pointer rounded-full hover:bg-rose-100 text-rose-500 transition-colors duration-300 flex-shrink-0"
                        onClick={() => {
                          setUserPost({
                            id: comment.id,
                            type: "Review",
                            text: comment.text,
                          });
                          setShowDeletePopup(true);
                        }}
                        title="Delete review"
                      >
                        <FiTrash2 size={16} className="xs:size-[18px]" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-4 mt-2 xs:mt-3">
                  <button
                    onClick={() => handleReply(comment.id)}
                    className="cursor-pointer flex items-center text-blue-600 text-xs xs:text-sm hover:text-blue-800 transition-colors self-start"
                  >
                    <LuReply
                      className="mr-1"
                      size={14}
                      style={{ transform: "rotate(180deg)" }}
                    />
                    Reply
                  </button>

                  {comment.replies && comment.replies.length > 0 && (
                    <button
                      onClick={() => toggleReplies(comment.id)}
                      className="cursor-pointer text-blue-600 text-xs xs:text-sm hover:text-blue-800 transition-colors self-start xs:self-auto"
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
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="ml-2 xs:ml-4 sm:ml-6 mt-1 xs:mt-2 bg-white border border-blue-200 rounded-lg p-2 xs:p-3 shadow-md"
                  >
                    <textarea
                      ref={replyInputRef}
                      rows={2}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write your reply..."
                      className="w-full p-2 xs:p-3 border border-blue-300 rounded-lg focus:ring-1 focus:ring-blue-400 focus:outline-none text-blue-900 text-sm xs:text-base transition-all duration-300 resize-none"
                    />
                    <div className="flex justify-end mt-2 xs:mt-3 gap-2">
                      <button
                        onClick={() => setReplyingTo(null)}
                        className="px-3 xs:px-4 py-1.5 xs:py-2 cursor-pointer rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 text-xs xs:text-sm transition-colors duration-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          sendReply(comment.id);
                        }}
                        className="px-3 xs:px-4 py-1.5 xs:py-2 cursor-pointer rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 text-xs xs:text-sm transition-colors duration-300 font-medium"
                      >
                        Send Reply
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
                      className="ml-2 xs:ml-4 sm:ml-6 space-y-2 xs:space-y-3 mt-2 xs:mt-3"
                    >
                      {comment.replies.map((reply) => {
                        const isUserReply = reply.user == user?.username;

                        return (
                          <div
                            key={reply.id}
                            className={`p-2 xs:p-3 border rounded-lg shadow-sm ${
                              isUserReply
                                ? "bg-blue-100/40 border-2 border-blue-300"
                                : "bg-white border-blue-200"
                            }`}
                          >
                            <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-2 xs:gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1 xs:mb-2">
                                  <span className="font-medium text-blue-700 text-xs xs:text-sm">
                                    User {reply.user}
                                  </span>
                                  <span className="text-xs text-blue-400 whitespace-nowrap">
                                    {reply.updated_time}
                                  </span>
                                </div>
                                <p className="text-blue-800 text-sm xs:text-base leading-relaxed whitespace-pre-wrap break-words word-break-break-all">
                                  {reply.text}
                                </p>
                              </div>

                              {isUserReply && (
                                <div className="flex items-center gap-1 xs:gap-2 self-end xs:self-start flex-shrink-0">
                                  <button
                                    className="p-1 xs:p-1.5 cursor-pointer rounded-full hover:bg-blue-100 text-blue-600 transition-colors duration-300"
                                    onClick={() => {
                                      setUserPost({
                                        id: reply.id,
                                        type: "Reply",
                                        text: reply.text,
                                      });
                                      setShowEditPopup(true);
                                    }}
                                    title="Edit reply"
                                  >
                                    <FiEdit3
                                      size={14}
                                      className="xs:size-[16px]"
                                    />
                                  </button>
                                  <button
                                    className="p-1 xs:p-1.5 cursor-pointer rounded-full hover:bg-rose-100 text-rose-500 transition-colors duration-300"
                                    onClick={() => {
                                      setUserPost({
                                        id: reply.id,
                                        comment: comment.id,
                                        type: "Reply",
                                        text: reply.text,
                                      });
                                      setShowDeletePopup(true);
                                    }}
                                    title="Delete reply"
                                  >
                                    <FiTrash2
                                      size={14}
                                      className="xs:size-[16px]"
                                    />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
              </AnimatePresence>
            </div>
          );
        })}

        {productComments.length > 5 && (
          <div className="flex justify-center pt-3 xs:pt-4 mt-4 xs:mt-5 border-t border-blue-300">
            {visibleCount < productComments.length ? (
              <button
                onClick={() => setVisibleCount(visibleCount + 5)}
                className="px-4 xs:px-6 py-2 cursor-pointer rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 text-sm xs:text-base font-medium"
              >
                Show more reviews
              </button>
            ) : (
              <button
                onClick={() => setVisibleCount(5)}
                className="px-4 xs:px-6 py-2 cursor-pointer rounded-lg border border-blue-400 text-blue-600 hover:bg-blue-50 transition-colors duration-300 text-sm xs:text-base font-medium"
              >
                Show less
              </button>
            )}
          </div>
        )}
      </motion.div>

      {showEditPopup && (
        <EditPostPopup
          onClose={() => setShowEditPopup(false)}
          userPost={userPost}
          setProductComments={setProductComments}
        />
      )}

      {showDeletePopup && (
        <DeletePostPopup
          onClose={() => setShowDeletePopup(false)}
          userPost={userPost}
          setProductComments={setProductComments}
        />
      )}
    </motion.div>
  );
};

export default Reviews;
