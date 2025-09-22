import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "../../../utils/animations";
import { useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  FiX,
  FiEdit3,
  FiCheckCircle,
  FiAlertCircle,
  FiTrash2,
} from "react-icons/fi";
import { RiQuestionAnswerLine } from "react-icons/ri";

import AnswerQuestionPopup from "../../pop-ups/AnswerQuestionPopup";
import DeletePostPopup from "../../pop-ups/DeletePostPopup";
import EditPostPopup from "../../pop-ups/EditPostPopup";

import { sendProductQuestion } from "../../../services/commentAPIServices";

const Questions = ({
  productQuestions,
  seller,
  setReloadComponent,
  reloadComponent,
  user,
}) => {
  const { id } = useParams();
  const [questionText, setQuestionText] = useState("");
  const [userPost, setUserPost] = useState("");

  const [showAnswerPopup, setShowAnswerPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

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
                if (questionText.trim() !== "") {
                  sendProductQuestion({
                    product: id,
                    question_text: questionText,
                  })
                    .then(() => {
                      setQuestionText("");
                      setReloadComponent(!reloadComponent);
                      toast.custom((t) => (
                        <div
                          className={`${
                            t.visible ? "animate-enter" : "animate-leave"
                          } transform transition-all duration-300`}
                        >
                          <div className="bg-gradient-to-r from-green-500 to-cyan-400 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg border border-white/30 backdrop-blur-md flex items-center space-x-2 sm:space-x-3">
                            <div className="bg-blue-500/20 p-2 rounded-full">
                              <FiCheckCircle className="text-xl text-white" />
                            </div>
                            <div>
                              <p className="font-medium">
                                Your question was successfully sent
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
                          } bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-lg border border-white/20 backdrop-blur-md flex items-center space-x-2 sm:space-x-3 rtl:space-x-reverse`}
                        >
                          <FiX className="text-xl shrink-0" />
                          <span className="font-medium">
                            {err.response.data.detail ==
                            "Refresh token not found."
                              ? "To ask a question, first log in to your account"
                              : err.response.data.detail}
                          </span>
                        </div>
                      ));
                    });
                } else {
                  showValidationError(
                    "Please write your question before submitting"
                  );
                }
              }
            }}
            type="text"
            placeholder="Type your question here..."
            className="flex-1 text-blue-950 border border-blue-300 rounded-lg px-2 sm:px-3 py-1 sm:py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300"
          />
          <button
            onClick={() => {
              if (questionText.trim() !== "") {
                sendProductQuestion({
                  product: id,
                  question_text: questionText,
                })
                  .then(() => {
                    setQuestionText("");
                    setReloadComponent(!reloadComponent);
                    toast.custom((t) => (
                      <div
                        className={`${
                          t.visible ? "animate-enter" : "animate-leave"
                        } transform transition-all duration-300`}
                      >
                        <div className="bg-gradient-to-r from-green-500 to-cyan-400 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg border border-white/30 backdrop-blur-md flex items-center space-x-2 sm:space-x-3">
                          <div className="bg-blue-500/20 p-2 rounded-full">
                            <FiCheckCircle className="text-xl text-white" />
                          </div>
                          <div>
                            <p className="font-medium">
                              Your question was successfully sent
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
                        } bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-lg border border-white/20 backdrop-blur-md flex items-center space-x-2 sm:space-x-3 rtl:space-x-reverse`}
                      >
                        <FiX className="text-xl shrink-0" />
                        <span className="font-medium">
                          {err.response.data.detail ==
                          "Refresh token not found."
                            ? "To ask a question, first log in to your account"
                            : err.response.data.detail}
                        </span>
                      </div>
                    ));
                  });
              } else {
                showValidationError(
                  "Please write your question before submitting"
                );
              }
            }}
            className="px-2 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-lg cursor-pointer sm:rounded-lg transition-colors duration-300"
          >
            Ask
          </button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="space-y-4 sm:space-y-3 mt-5 sm:mt-6">
          {productQuestions.length === 0 ? (
            <div className="text-blue-600">
              No questions have been asked yet.
            </div>
          ) : (
            productQuestions.map((faq) => {
              const isUserQuestion = faq.user == user[0].username;

              return (
                <div
                  key={faq.id}
                  className={`p-3 sm:p-4 border rounded-lg sm:rounded-xl shadow space-y-1 sm:space-y-2 transition ${
                    isUserQuestion
                      ? "bg-blue-100/50 border-2 border-blue-400"
                      : "bg-blue-50/60 border-blue-200"
                  }`}
                >
                  <div className="flex items-center justify-between ">
                    <p className="font-semibold text-blue-900 break-words whitespace-pre-wrap break-all">
                      {faq.user}: {faq.question_text}
                    </p>
                    <div className="flex items-center gap-2">
                      {isUserQuestion && (
                        <span className="px-2 py-1 text-xs font-bold rounded-full bg-blue-600 text-white">
                          Your Question
                        </span>
                      )}
                      {user[0].username == seller.user && !faq.answer_text && (
                        <button
                          className="p-2 cursor-pointer rounded-full hover:bg-blue-100 text-blue-600 transition-colors duration-300"
                          onClick={() => {
                            setUserPost({
                              id: faq.id,
                              type: "Question",
                              text: faq.question_text,
                            });
                            setShowAnswerPopup(true);
                          }}
                        >
                          <RiQuestionAnswerLine size={18} />
                        </button>
                      )}
                      {isUserQuestion && (
                        <button
                          className="p-2 cursor-pointer rounded-full hover:bg-blue-100 text-blue-600 transition-colors duration-300"
                          onClick={() => {
                            setUserPost({
                              id: faq.id,
                              type: "Question",
                              text: faq.question_text,
                            });
                            setShowEditPopup(true);
                          }}
                        >
                          <FiEdit3 size={18} />
                        </button>
                      )}
                      {user[0].username == seller.user || isUserQuestion ? (
                        <button
                          className="p-2 cursor-pointer rounded-full hover:bg-rose-100 text-rose-500 transition-colors duration-300"
                          onClick={() => {
                            setUserPost({
                              id: faq.id,
                              type: "Question",
                              text: faq.question_text,
                            });
                            setShowDeletePopup(true);
                          }}
                        >
                          <FiTrash2 size={18} />
                        </button>
                      ) : null}
                    </div>
                  </div>

                  {faq.answer_text && (
                    <div className="flex items-start gap-2 mt-1 sm:mt-2">
                      <span className="px-2 py-1 text-xs font-semibold bg-blue-200 text-blue-800 rounded-lg">
                        Storekeeper
                      </span>
                      <p className="text-blue-700 text-sm mt-0.5">
                        {faq.answer_text}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </motion.div>

      {showAnswerPopup && (
        <AnswerQuestionPopup
          onClose={() => setShowAnswerPopup(false)}
          userPost={userPost}
          reloadComponent={reloadComponent}
          setReloadComponent={setReloadComponent}
        />
      )}

      {showEditPopup && (
        <EditPostPopup
          onClose={() => setShowEditPopup(false)}
          userPost={userPost}
          reloadComponent={reloadComponent}
          setReloadComponent={setReloadComponent}
        />
      )}

      {showDeletePopup && (
        <DeletePostPopup
          onClose={() => setShowDeletePopup(false)}
          userPost={userPost}
          reloadComponent={reloadComponent}
          setReloadComponent={setReloadComponent}
        />
      )}
    </motion.div>
  );
};

export default Questions;
