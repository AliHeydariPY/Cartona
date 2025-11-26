import { motion, AnimatePresence } from "framer-motion";
import { Portal } from "react-portal";
import { useEffect, useRef, useState } from "react";
import { FiX, FiLogOut, FiAlertTriangle } from "react-icons/fi";
import { useAtom } from "jotai";
import { userAtom } from "../../atoms/userAtom";
import { logout } from "../../services/userAPIServices";
import { errorToast } from "../../utils/toast";

const LogoutPopup = ({ onClose }) => {
  const [show, setShow] = useState(false);
  const popupRef = useRef();
  const [user] = useAtom(userAtom);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => onClose(), 300);
  };

  const stopPropagation = (e) => e.stopPropagation();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirm = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      await logout();
      handleClose();
    } catch (err) {
      errorToast(err?.response?.data?.detail || "Something went wrong");
    } finally {
      setIsLoggingOut(false);
    }
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
            className="fixed inset-0 z-50 flex items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          >
            <motion.div
              ref={popupRef}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden "
              onClick={stopPropagation}
            >
              <div className="bg-gradient-to-r from-red-600 to-rose-600 p-5 sm:p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative z-10 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="mr-3 bg-white/20 rounded-full p-2">
                      <FiAlertTriangle className="mb-0.5" size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Sign Out</h3>
                      <div className="flex items-center">
                        <p className="text-red-100 text-sm">@</p>
                        <p className="text-red-100 text-sm mt-1">
                          {user.username}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-1 cursor-pointer rounded-full hover:bg-white/20 transition-colors duration-300"
                  >
                    <FiX size={22} />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:6">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-red-100 p-3 rounded-full">
                    <FiLogOut className="text-red-600" size={24} />
                  </div>
                </div>

                <div className="text-center mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    Are you sure you want to sign out?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    You'll be logged out of your account and will need to sign
                    in again.
                  </p>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
                  <button
                    onClick={handleClose}
                    className="cursor-pointer w-full bg-white border border-blue-300 text-blue-700 py-3 rounded-lg font-medium flex items-center justify-center hover:bg-blue-50 transition-colors duration-300"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleConfirm}
                    disabled={isLoggingOut}
                    className={`cursor-pointer w-full bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center hover:from-red-700 hover:to-rose-700 transition-colors duration-300 ${
                      isLoggingOut ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <FiLogOut className="mr-2 mb-0.5" />
                    {isLoggingOut ? "Signing Out..." : "Sign Out"}
                  </button>
                </div>
              </div>

              <div className="bg-red-50/30 p-4 text-center border-t border-red-100">
                <p className="text-xs text-red-600">
                  <FiAlertTriangle className="inline mr-1 mb-0.5" size={12} />
                  You will need to sign in again to access your account.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
};

export default LogoutPopup;
