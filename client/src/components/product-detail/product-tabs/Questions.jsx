import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "../../../utils/animations";

import { useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

import { sendProductQuestion } from "../../../services/commentAPIServices";

import { FiX, FiCheckCircle, FiEdit3, FiAlertCircle } from "react-icons/fi";
import { FixedSizeList as List } from "react-window";

const Questions = ({
  productQuestions,
  setShowAnswerPopup,
  setQuestion,
  userID,
  seller,
  setReloadComponent,
  reloadComponent,
}) => {
  const [questionText, setQuestionText] = useState("");
  const { id } = useParams();

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

  // 👇 رندر هر آیتم برای react-window
  const QuestionItem = ({ index, style }) => {
    const faq = productQuestions[index];
    const isUserQuestion = faq.user == userID;

    return (
      <div
        style={{
          ...style,
          top: style.top, 
          height: style.height - 14, 
        }} 
        className={`p-3 sm:p-4 border rounded-lg sm:rounded-xl shadow space-y-1 sm:space-y-2 transition ${
          isUserQuestion
            ? "bg-blue-100/50 border-blue-400 ring-2 ring-blue-300"
            : "bg-blue-50/60 border-blue-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <p className="font-semibold text-blue-900">Q: {faq.question_text}</p>
          <div className="flex items-center gap-2">
            {isUserQuestion && (
              <span className="px-2 py-1 text-xs font-bold rounded-full bg-blue-600 text-white">
                Your Question
              </span>
            )}
            {userID == seller.user && !faq.answer_text && (
              <button
                className="p-2 cursor-pointer rounded-full hover:bg-blue-100 text-blue-600 transition-colors duration-300"
                onClick={() => {
                  setShowAnswerPopup(true);
                  setQuestion({
                    questionText: faq.question_text,
                    questionID: faq.id,
                  });
                }}
              >
                <FiEdit3 size={18} />
              </button>
            )}
          </div>
        </div>

        {faq.answer_text && (
          <div className="flex items-start gap-2 mt-1 sm:mt-2">
            <span className="px-2 py-1 text-xs font-semibold bg-blue-200 text-blue-800 rounded-lg">
              Storekeeper
            </span>
            <p className="text-blue-700 text-sm mt-0.5">{faq.answer_text}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-5 sm:space-y-6 mt-5 sm:mt-6"
    >
      {/* Ask a Question */}
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
            type="text"
            placeholder="Type your question here..."
            className="flex-1 border border-blue-300 rounded-lg px-2 sm:px-3 py-1 sm:py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300"
          />
          <button
            onClick={() => {
              if (questionText.trim() !== "") {
                sendProductQuestion({
                  product: id,
                  user: userID,
                  question_text: questionText,
                })
                  .then(() => {
                    setQuestionText("");
                    setReloadComponent(!reloadComponent);
                    toast.success("Your question was successfully sent ✅");
                  })
                  .catch((err) => {
                    toast.error(
                      err.response.data[0] || "Something went wrong ❌"
                    );
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

      {/* Questions List */}
      <motion.div variants={itemVariants}>
        {productQuestions.length === 0 ? (
          <div className="text-blue-600">No questions have been asked yet.</div>
        ) : (
          <List
            height={450} 
            itemCount={productQuestions.length}
            itemSize={116} 
            width={"100%"}
            className="custom-scrollbar"
          >
            {QuestionItem}
          </List>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Questions;
