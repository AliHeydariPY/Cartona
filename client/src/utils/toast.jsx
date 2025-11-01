import { toast } from "react-hot-toast";
import { FiCheckCircle } from "react-icons/fi";

export const successToast = (text) => {
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
        <div>
          <p className="font-medium">{text}</p>
        </div>
      </div>
    </div>
  ));
};
