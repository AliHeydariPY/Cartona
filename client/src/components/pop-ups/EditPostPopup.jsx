import { useState, useEffect } from "react";
import { Portal } from "react-portal";

import { FiX, FiEdit3, FiStar } from "react-icons/fi";
import { RiSendPlaneFill } from "react-icons/ri";
import {
  editProductQuestion,
  editComment,
  editCommentReply,
  getCommentReplies,
} from "../../services/commentAPIServices";
import { errorToast } from "../../utils/toast";

const EditPostPopup = ({
  onClose,
  userPost,
  setProductComments,
  setProductQuestions,
}) => {
  const [editedPost, setEditedPost] = useState(userPost.text);
  const [show, setShow] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedStars, setSelectedStars] = useState(
    userPost.rating ? userPost.rating : null
  );

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => onClose(), 300);
  };

  const stopPropagation = (e) => e.stopPropagation();

  const handleSubmit = async () => {
    if (editedPost.trim() === "" || editedPost === userPost.text) return;

    setIsSubmitting(true);

    try {
      if (userPost.type == "Question") {
        const res = await editProductQuestion(
          { question_text: editedPost },
          userPost.id
        );
        setProductQuestions((prevQuestions) =>
          prevQuestions.map((q) => (q.id === res.data.id ? res.data : q))
        );
      } else if (userPost.type == "Review") {
        const res = await editComment(
          { text: editedPost, rating: selectedStars },
          userPost.id
        );
        let replies = [];
        try {
          const repliesResponse = await getCommentReplies(res.data.id);
          replies = repliesResponse.data;
        } catch {
          replies = [];
        }
        setProductComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === res.data.id ? { ...res.data, replies } : comment
          )
        );
      } else if (userPost.type == "Reply") {
        const res = await editCommentReply({ text: editedPost }, userPost.id);
        setProductComments((prevComments) =>
          prevComments.map((comment) => {
            if (comment.id === res.data.comment) {
              const replies = comment.replies.map((rep) =>
                rep.id === res.data.id ? res.data : rep
              );
              return { ...comment, replies };
            }
            return comment;
          })
        );
      }
      setEditedPost("");
      handleClose();
    } catch {
      errorToast("Failed to submit the edited post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Portal>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center sm:p-4 transition-colors duration-300 ${
          show ? "bg-black/30" : "bg-black/0"
        }`}
        onClick={handleClose}
      >
        <div
          className={`bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden transform transition-all duration-300 ${
            show ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
          onClick={stopPropagation}
        >
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-5 sm:p-6 text-white">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold flex items-center">
                <span className="bg-white/25 text-white rounded-full p-1.5 mr-2">
                  <FiEdit3 size={18} />
                </span>
                Edti {userPost.type}
              </h3>
              <button
                onClick={handleClose}
                className="p-1 cursor-pointer rounded-full hover:bg-white/20 transition-colors duration-200"
              >
                <FiX size={22} />
              </button>
            </div>
          </div>

          <div
            className={`p-5 sm:p-6 ${
              userPost.type === "Review" ? "space-y-2" : "space-y-4"
            } `}
          >
            {userPost.rating && (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex items-center justify-between">
                <span className="text-sm font-semibold text-yellow-800">
                  Previous rating:
                </span>
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      size={18}
                      className={`${
                        i < userPost.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300 fill-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm font-medium mt-0.5 text-yellow-700">
                    {userPost.rating}/5
                  </span>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
              <p className="text-sm font-medium text-blue-900 break-words whitespace-pre-wrap">
                {userPost.type[0]}: {userPost.text}
              </p>
            </div>

            {userPost.type === "Review" && userPost.rating && (
              <div className="flex justify-center gap-2 py-2">
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
            )}
            {userPost.type == "Question" ? (
              <input
                value={editedPost}
                onChange={(e) => setEditedPost(e.target.value)}
                placeholder="Edit your question..."
                className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <textarea
                rows={4}
                value={editedPost}
                onChange={(e) => setEditedPost(e.target.value)}
                placeholder="Edit your review..."
                className="w-full p-3 resize-none border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-blue-900 transition-all duration-300"
              />
            )}

            <div className="flex flex-col sm:flex-row-reverse gap-2 sm:gap-3">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`flex items-center justify-center px-4 cursor-pointer py-3 sm:py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white gap-2 transition-colors duration-200 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <RiSendPlaneFill size={18} className="mb-0.5" />
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
              <button
                onClick={handleClose}
                className="px-4 py-3 sm:py-2 cursor-pointer rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-50 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default EditPostPopup;
