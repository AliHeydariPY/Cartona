import { FiStar } from "react-icons/fi";
import { IoCartOutline } from "react-icons/io5";

const Profile = () => {
  return (
    <div className="lg:col-span-3 space-y-6 sm:space-y-7 lg:space-y-5 xl:space-y-9">
      {/* Activity Summary */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-6 2xl:p-8 border border-blue-300 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300">
        <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-6 sm:mb-8 flex items-center">
          <FiStar
            className="mr-2 sm:mr-3 text-amber-400 animate-spin-slow"
            size={20}
          />{" "}
          Activity Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {[
            { title: "Active Orders", value: "3", color: "blue" },
            { title: "Your Rating", value: "4.8 out of 5", color: "blue" },
            { title: "Favorites Count", value: "12", color: "blue" },
          ].map((card, idx) => (
            <div
              key={idx}
              className={`bg-linear-to-br from-${card.color}-200 to-${card.color}-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-${card.color}-300 hover:shadow-lg transition-all duration-300`}
            >
              <p
                className={`text-${card.color}-700 font-semibold text-sm sm:text-base`}
              >
                {card.title}
              </p>
              <h3
                className={`text-xl sm:text-2xl md:text-3xl font-extrabold text-${card.color}-900`}
              >
                {card.value}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* Latest Orders */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-6 2xl:p-8 border border-blue-300 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300">
        <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-6 sm:mb-8">
          Latest Orders
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm sm:text-base">
            <thead>
              <tr className="text-left border-b border-blue-300">
                {["Order Number", "Date", "Amount", "Status", "Actions"].map(
                  (head, i) => (
                    <th
                      key={i}
                      className="pb-3 sm:pb-4 px-4 sm:px-6 text-blue-900 font-semibold"
                    >
                      {head}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((order) => (
                <tr
                  key={order}
                  className="border-b border-blue-100 hover:bg-gradient-to-r hover:from-blue-100 hover:to-cyan-100 transition-all duration-200 cursor-pointer"
                >
                  <td className="py-3 sm:py-5 px-4 sm:px-6 font-semibold text-blue-800">
                    #CART{1245 + order}
                  </td>
                  <td className="py-3 sm:py-5 px-4 sm:px-6 text-blue-700">
                    2023/08/{10 + order}
                  </td>
                  <td className="py-3 sm:py-5 px-4 sm:px-6 font-semibold text-blue-800">
                    {order === 1 ? "$1,249" : order === 2 ? "$789" : "$2,540"}
                  </td>
                  <td className="py-3 sm:py-5 px-4 sm:px-6">
                    <span
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm shadow-sm font-semibold ${
                        order === 1
                          ? "bg-green-200 text-green-900"
                          : order === 2
                          ? "bg-amber-200 text-amber-900"
                          : "bg-blue-200 text-blue-900"
                      }`}
                    >
                      {order === 1
                        ? "Completed"
                        : order === 2
                        ? "Shipping"
                        : "Processing"}
                    </span>
                  </td>
                  <td className="py-3 sm:py-5 px-4 sm:px-6">
                    <button className="text-blue-700 cursor-pointer hover:text-cyan-600 transition-colors duration-300 underline font-semibold">
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recently Viewed */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-6 2xl:p-8 border border-blue-300 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300">
        <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-6 sm:mb-8">
          Recently Viewed
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((product) => (
            <div
              key={product}
              className="group relative bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            >
              <div className="h-28 sm:h-32 md:h-36 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-300 via-cyan-200 to-white rounded-full shadow-inner"></div>
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="text-sm sm:text-base font-semibold text-blue-900 truncate">
                  Sample Product {product}
                </h3>
                <div className="flex justify-between items-center mt-2 sm:mt-3">
                  <span className="text-sm sm:text-base font-bold text-blue-700">
                    ${product * 249}
                  </span>
                  <button className="p-1.5 sm:p-2 cursor-pointer bg-blue-600 hover:bg-cyan-500 rounded-full text-white transition-colors">
                    <IoCartOutline className="text-base sm:text-lg m-0.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
