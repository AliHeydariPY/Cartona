import { toast } from "react-hot-toast";
import { FiCheckCircle, FiX } from "react-icons/fi";

export const successToast = (message) => {
  toast.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } transform transition-all duration-300`}
    >
      <div className="bg-gradient-to-r from-green-500 to-cyan-400 text-white px-6 py-3 rounded-xl shadow-lg border border-white/30 backdrop-blur-md flex items-center space-x-3">
        <div className="bg-blue-500/20 p-2 rounded-full">
          <FiCheckCircle className="text-xl text-white" />
        </div>
        {message.title ? (
          <div>
            <p className="font-medium">{message.title}</p>
            <p className="text-sm opacity-90">{message.text}</p>
          </div>
        ) : (
          <div>
            <p className="font-medium">{message}</p>
          </div>
        )}
      </div>
    </div>
  ));
};

export const errorToast = (text) => {
  toast.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-4 rounded-xl shadow-lg border border-white/20 backdrop-blur-md flex items-center space-x-3 rtl:space-x-reverse`}
    >
      <FiX className="text-xl shrink-0" />
      <span className="font-medium">{text || "There is a problem"}</span>
    </div>
  ));
};