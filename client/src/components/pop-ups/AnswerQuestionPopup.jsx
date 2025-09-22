import { useState, useEffect } from "react";
import { Portal } from "react-portal";

import { FiX } from "react-icons/fi";
import { RiQuestionAnswerLine } from "react-icons/ri";
import { RiSendPlaneFill } from "react-icons/ri";
import { answerProductQuestion } from "../../services/commentAPIServices";

const AnswerQuestionPopup = ({
  onClose,
  userPost,
  reloadComponent,
  setReloadComponent,
}) => {
  const [answer, setAnswer] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 10);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => onClose(), 300);
  };

  const stopPropagation = (e) => e.stopPropagation();

  const handleSubmit = () => {
    if (answer.trim() === "") return;
    answerProductQuestion(
      {
        answer_text: answer,
      },
      userPost.id
    ).then(() => {
      setAnswer("");
      handleClose();
      setReloadComponent(!reloadComponent);
    });
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
                  <RiQuestionAnswerLine size={20} />
                </span>
                Answer Question
              </h3>
              <button
                onClick={handleClose}
                className="p-1 cursor-pointer rounded-full hover:bg-white/20 transition-colors duration-200"
              >
                <FiX size={22} />
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-4">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
              <p className="text-sm font-medium text-blue-900">
                Q: {userPost.text}
              </p>
            </div>

            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={4}
              placeholder="Write your answer here..."
              className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <div className="flex flex-col sm:flex-row-reverse gap-2 sm:gap-3">
              <button
                onClick={handleSubmit}
                className="flex items-center justify-center px-4 cursor-pointer py-3 sm:py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white gap-2 transition-colors duration-200"
              >
                <RiSendPlaneFill size={18} className="mb-0.5" />
                Submit
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

export default AnswerQuestionPopup;
