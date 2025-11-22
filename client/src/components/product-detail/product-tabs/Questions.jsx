import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "../../../utils/animations";
import { useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { FiX, FiEdit3, FiAlertCircle, FiTrash2 } from "react-icons/fi";
import { RiQuestionAnswerLine } from "react-icons/ri";

import AnswerQuestionPopup from "../../pop-ups/AnswerQuestionPopup";
import DeletePostPopup from "../../pop-ups/DeletePostPopup";
import EditPostPopup from "../../pop-ups/EditPostPopup";

import { sendProductQuestion } from "../../../services/commentAPIServices";
import { errorToast, successToast } from "../../../utils/toast";

const Questions = ({ productQuestions, seller, user, setProductQuestions }) => {
  const { id } = useParams();
  const [questionText, setQuestionText] = useState("");
  const [userPost, setUserPost] = useState("");

  const [showAnswerPopup, setShowAnswerPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const [visibleCount, setVisibleCount] = useState(5);

  const handleSubmit = () => {
    if (questionText.trim() !== "") {
      sendProductQuestion({
        product: id,
        question_text: questionText,
      })
        .then((res) => {
          setProductQuestions([res.data, ...productQuestions]);
          setQuestionText("");
          successToast("Your question was successfully sent");
        })
        .catch((err) => {
          const errorMessage =
            err.response.data.detail == "Refresh token not found."
              ? "To ask a question, first log in to your account"
              : err.response.data.detail;

          errorToast(errorMessage);
        });
    } else {
      showValidationError("Please write your question before submitting");
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

  if (!user) {
    return (
      <div className="mt-6 col-span-2 2xl:col-span-1">
        <div className="w-full bg-white/80 backdrop-blur-lg rounded-2xl p-4 border border-white/30 shadow-lg">
          <div className="animate-pulse">
            <div className="h-6 bg-blue-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-blue-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-blue-200 rounded w-2/3 "></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-5 sm:space-y-6 mt-5 sm:mt-6"
    >
      <motion.div
        variants={itemVariants}
        className="p-3 sm:p-4 bg-white/90 border border-blue-200 rounded-lg sm:rounded-xl shadow-lg"
      >
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Ask a Question
        </h3>
        <div className="flex items-center gap-2">
          <input
            autoFocus
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            onKeyDown={(e) => {
              if (e.code == "Enter") {
                handleSubmit();
              }
            }}
            type="text"
            placeholder="Type your question here..."
            className="flex-1 text-blue-950 border border-blue-300 rounded-lg px-2 sm:px-3 py-1 sm:py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300"
          />
          <button
            onClick={handleSubmit}
            className="px-2 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-lg cursor-pointer sm:rounded-lg transition-colors duration-300"
          >
            Ask
          </button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="space-y-3 xs:space-y-4 mt-4 xs:mt-5 sm:mt-6">
          {productQuestions.length === 0 ? (
            <div className="text-blue-600 text-sm xs:text-base text-center py-4 xs:py-6">
              No questions have been asked yet.
            </div>
          ) : (
            productQuestions.slice(0, visibleCount).map((faq) => {
              const isUserQuestion = faq.user == user[0].username;

              return (
                <div
                  key={faq.id}
                  className={`p-3 xs:p-4 border rounded-lg sm:rounded-xl shadow-sm space-y-2 xs:space-y-3 transition-all duration-300 ${
                    isUserQuestion
                      ? "bg-blue-100/50 border-2 border-blue-400"
                      : "bg-blue-50/60 border-blue-200"
                  }`}
                >
                  <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-2 xs:gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 xs:mb-2">
                        <span className="font-medium text-blue-800 text-sm xs:text-base truncate">
                          {faq.user}
                        </span>
                        <span className="text-blue-600 hidden xs:inline">
                          :
                        </span>
                      </div>
                      <p className="text-blue-900 text-sm xs:text-base leading-relaxed whitespace-pre-wrap break-words word-break-break-all overflow-hidden">
                        {faq.question_text}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 xs:gap-2 self-end xs:self-start flex-shrink-0">
                      {isUserQuestion && (
                        <span className="px-2 py-1 text-xs font-bold rounded-full bg-blue-600 text-white whitespace-nowrap">
                          Your Question
                        </span>
                      )}

                      {user[0].username == seller.user && !faq.answer_text && (
                        <button
                          className="p-1.5 xs:p-2 cursor-pointer rounded-full hover:bg-blue-100 text-blue-600 transition-colors duration-300 flex-shrink-0"
                          onClick={() => {
                            setUserPost({
                              id: faq.id,
                              type: "Question",
                              text: faq.question_text,
                            });
                            setShowAnswerPopup(true);
                          }}
                          title="Answer question"
                        >
                          <RiQuestionAnswerLine
                            size={16}
                            className="xs:size-[18px]"
                          />
                        </button>
                      )}

                      {isUserQuestion && (
                        <button
                          className="p-1.5 xs:p-2 cursor-pointer rounded-full hover:bg-blue-100 text-blue-600 transition-colors duration-300 flex-shrink-0"
                          onClick={() => {
                            setUserPost({
                              id: faq.id,
                              type: "Question",
                              text: faq.question_text,
                            });
                            setShowEditPopup(true);
                          }}
                          title="Edit question"
                        >
                          <FiEdit3 size={16} className="xs:size-[18px]" />
                        </button>
                      )}

                      {(user[0].username == seller.user || isUserQuestion) && (
                        <button
                          className="p-1.5 xs:p-2 cursor-pointer rounded-full hover:bg-rose-100 text-rose-500 transition-colors duration-300 flex-shrink-0"
                          onClick={() => {
                            setUserPost({
                              id: faq.id,
                              type: "Question",
                              text: faq.question_text,
                            });
                            setShowDeletePopup(true);
                          }}
                          title="Delete question"
                        >
                          <FiTrash2 size={16} className="xs:size-[18px]" />
                        </button>
                      )}
                    </div>
                  </div>

                  {faq.answer_text && (
                    <div className="flex flex-col xs:flex-row xs:items-start gap-2 xs:gap-3 mt-2 xs:mt-3 pt-2 xs:pt-3 border-t border-blue-200">
                      <span className="px-2 py-1 text-xs font-semibold bg-blue-200 text-blue-800 rounded-lg whitespace-nowrap flex-shrink-0 self-start">
                        Storekeeper
                      </span>
                      <p className="text-blue-700 text-sm xs:text-base leading-relaxed whitespace-pre-wrap break-words word-break-break-all flex-1">
                        {faq.answer_text}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}

          {productQuestions.length > 5 && (
            <div className="flex justify-center pt-3 xs:pt-4 mt-4 xs:mt-5 border-t border-blue-300">
              {visibleCount < productQuestions.length ? (
                <button
                  onClick={() => setVisibleCount(visibleCount + 5)}
                  className="px-4 xs:px-6 py-2 cursor-pointer rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 text-sm xs:text-base font-medium"
                >
                  Show more questions
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
        </div>
      </motion.div>

      {showAnswerPopup && (
        <AnswerQuestionPopup
          onClose={() => setShowAnswerPopup(false)}
          userPost={userPost}
          setProductQuestions={setProductQuestions}
        />
      )}

      {showEditPopup && (
        <EditPostPopup
          onClose={() => setShowEditPopup(false)}
          userPost={userPost}
          setProductQuestions={setProductQuestions}
        />
      )}

      {showDeletePopup && (
        <DeletePostPopup
          onClose={() => setShowDeletePopup(false)}
          userPost={userPost}
          setProductQuestions={setProductQuestions}
        />
      )}
    </motion.div>
  );
};

export default Questions;
