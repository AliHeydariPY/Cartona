export const SectionLoader = ({ chatLoader, title }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 ${!chatLoader && "bg-gradient-to-br from-blue-50/50 to-cyan-50/50 rounded-2xl border border-blue-200"}`}
    >
      <div className="relative mb-6">
        <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>

        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-600 border-r-cyan-500 rounded-full animate-spin"></div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"></div>
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-blue-800">
          Loading Your {title}
        </h3>
      </div>

      <div className="flex space-x-1.5 mt-4">
        <div
          className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"
          style={{ animationDelay: "150ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
          style={{ animationDelay: "300ms" }}
        ></div>
      </div>
    </div>
  );
};
