import { useState, useEffect } from "react";
import { Portal } from "react-portal";
import { FiX, FiTrash2, FiAlertTriangle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { deleteProductQuestion } from "../../services/commentAPIServices";

const DeleteQuestionPopup = ({
  onClose,
  question,
  reloadComponent,
  setReloadComponent,
}) => {
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
    deleteProductQuestion(question.questionID).then(() => {
      handleClose();
      setReloadComponent(!reloadComponent);
    });

    handleClose();
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden"
              onClick={stopPropagation}
            >
              <div className="bg-gradient-to-r from-red-600 to-rose-500 p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative z-10 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-white/20 rounded-full p-2 mr-3">
                      <FiAlertTriangle size={20} />
                    </div>
                    <h3 className="text-xl font-bold">Delete Question</h3>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-1 cursor-pointer rounded-full hover:bg-white/20 transition-colors duration-200"
                  >
                    <FiX size={22} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div className="flex items-center justify-center">
                  <div className="bg-red-100 p-4 rounded-full">
                    <FiTrash2 className="text-red-600" size={28} />
                  </div>
                </div>

                <div className="text-center">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    Are you sure you want to delete this question?
                  </h4>
                  <p className="text-gray-600 text-sm mb-4">
                    This action cannot be undone. The question will be
                    permanently removed.
                  </p>
                </div>

                <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
                  <p className="text-sm font-medium text-red-900">
                    Q: {question.questionText}
                  </p>
                  <p className="text-xs text-red-700 mt-1">
                    Asked by: {question.askerName || "User"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleClose}
                    className="px-4 py-3 cursor-pointer bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-3 cursor-pointer bg-gradient-to-r from-red-600 to-rose-500 text-white rounded-xl font-semibold flex items-center justify-center hover:from-red-700 hover:to-rose-600 transition-colors duration-300 shadow-lg hover:shadow-red-500/25"
                  >
                    <FiTrash2 className="mr-2 mb-0.5" />
                    Delete
                  </button>
                </div>
              </div>

              <div className="bg-red-50/50 p-4 text-center border-t border-red-200">
                <p className="text-xs text-red-600 flex items-center justify-center">
                  <FiAlertTriangle className="mr-1" size={12} />
                  This action is permanent and cannot be reversed.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
};

export default DeleteQuestionPopup;
