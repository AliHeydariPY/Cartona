import { useState, useEffect } from "react";
import { Portal } from "react-portal";
// import { useNavigate } from "react-router-dom";

import { FiX, FiMessageSquare, FiSend } from "react-icons/fi";

import { answerProductQuestion } from "../services/commentAPIServices";

export default function AnswerQuestionPopup({ onClose, question }) {
  const [answer, setAnswer] = useState("");
  const [show, setShow] = useState(false);
  // const naviagate = useNavigate()

  useEffect(() => {
    setTimeout(() => setShow(true), 10);
    console.log("aldkfj");
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => onClose(), 300);
  };

  const stopPropagation = (e) => e.stopPropagation();

  const handleSubmit = () => {
    if (answer.trim() === "") return;
    answerProductQuestion(
      { answer_text: answer, storekeeper: 1 },
      question.questionID
    ).then(() => {
      setAnswer("");
      onClose();
      // naviagate(0)
    });
  };

  return (
    <Portal>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-colors duration-300 ${
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
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold flex items-center">
                <FiMessageSquare
                  className="mr-2 bg-white text-blue-600 rounded-full p-0.75"
                  size={26}
                  strokeWidth={2}
                />
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

          <div className="p-6 space-y-4">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
              <p className="text-sm font-medium text-blue-900">
                Q: {question.questionText}
              </p>
            </div>

            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={4}
              placeholder="Write your answer here..."
              className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 cursor-pointer rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 cursor-pointer py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center gap-2 hover:shadow-lg transition-all duration-200"
              >
                <FiSend size={18} />
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
