import { Portal } from "react-portal";
import { useEffect, useRef, useState } from "react";
import { FiX } from "react-icons/fi";
import { RiSendPlaneFill } from "react-icons/ri";

const SendNotePopup = ({ onClose, onConfirm }) => {
  const [show, setShow] = useState(false);
  const [note, setNote] = useState("");
  const textareaRef = useRef();
  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 10);
    setTimeout(() => {
      textareaRef.current.focus();
    }, 120);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => onClose(), 300);
  };

  const stopPropagation = (e) => e.stopPropagation();

  const handleConfirm = () => {
    if (note.trim() !== "") {
      onConfirm(note);
      handleClose();
    }
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
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold flex items-center">
                <div className="mr-2 bg-white/30 rounded-full p-2">
                  <RiSendPlaneFill size={17} />
                </div>
                Send Note to Buyer
              </h3>
              <button
                onClick={handleClose}
                className="p-1 cursor-pointer rounded-full hover:bg-white/20 transition-colors duration-200"
              >
                <FiX size={22} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            <textarea
              ref={textareaRef}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write a message for the buyer..."
              className="w-full h-31 border border-blue-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none transition-all duration-300"
            />

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={handleClose}
                className="cursor-pointer bg-white border border-blue-300 text-blue-700 py-3 rounded-lg font-medium flex items-center justify-center hover:bg-blue-50 transition-colors duration-300"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirm}
                className={`cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center hover:from-blue-700 hover:to-cyan-600 transition-colors duration-300 ${
                  note.trim() === "" ? "opacity-60 cursor-not-allowed" : ""
                }`}
                disabled={note.trim() === ""}
              >
                <RiSendPlaneFill className="mr-2" />
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default SendNotePopup;
