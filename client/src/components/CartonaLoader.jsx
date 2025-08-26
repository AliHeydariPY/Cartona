import { motion, AnimatePresence } from "framer-motion";
import { Portal } from "react-portal";
import { useEffect, useState } from "react";

const CartonaLoader = ({ isLoading }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setShow(true);
    } else {
      setTimeout(() => {
        setShow(false);
      }, 700);
    }
  }, [isLoading]);


  return (
    <Portal>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-blue-300/50"
            >
              {/* Main spinner */}
              <motion.div
                className="relative w-20 h-20 mx-auto mb-6"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              >
                {/* Outer ring */}
                <motion.div
                  className="absolute inset-0 border-4 border-blue-200 rounded-full"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                {/* Middle ring */}
                <motion.div
                  className="absolute inset-2 border-4 border-cyan-300 rounded-full"
                  animate={{ scale: [1, 0.9, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: 0.2 }}
                />
                
                {/* Inner ring */}
                <motion.div
                  className="absolute inset-4 border-4 border-blue-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                />
                
                {/* Central point */}
                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center"
              >
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">
                  Loading Excellence
                </h3>
                <p className="text-blue-600/80 text-sm">
                  Preparing your experience...
                </p>
              </motion.div>

              {/* Dynamic points */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex justify-center mt-6 space-x-2"
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
};

export default CartonaLoader;