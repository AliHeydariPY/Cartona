import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiShoppingBag,
  FiHeart,
  FiSettings,
  FiCreditCard,
  FiLogOut,
  FiStar,
  FiHome,
  FiShield,
} from "react-icons/fi";
import { IoCartOutline } from "react-icons/io5";

const UserDashboard = () => {
  const navigate = useNavigate()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700/30 via-cyan-600/20 to-blue-400/20 p-4 sm:p-7 lg:p-5 xl:p-9 relative overflow-hidden">
      {/* Background circles */}
      <div className="absolute -top-24 -right-24 w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 bg-cyan-500/40 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-8 left-4 w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-blue-700/30 rounded-full blur-3xl animate-pulse delay-1500"></div>

      {/* Header */}
      <div className="relative bg-white/90 backdrop-blur-3xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 2xl:p-8 mb-6 sm:mb-7 lg:mb-5 xl:mb-9 border border-blue-400 transition-transform duration-300 hover:scale-[1.004] hover:shadow-blue-500/60">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          <div className="flex items-center">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-700 via-cyan-600 to-teal-500 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl md:text-4xl shadow-lg ring-2 sm:ring-3 md:ring-4 ring-blue-300/60">
                <FiUser />
              </div>
              <div className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full border-2 border-white shadow-lg animate-bounce"></div>
            </div>
            <div className="ml-3 sm:ml-4 md:ml-5">
              <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-blue-900 drop-shadow-md">
                Mohammad Rezaei
              </h1>
              <p className="text-sm sm:text-base text-blue-800 font-semibold mt-1">
                Member since: 2023/08/03
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-full sm:w-auto">
            <button className="bg-gradient-to-r cursor-pointer from-blue-700 via-cyan-600 to-teal-500 text-white px-5 py-2 sm:px-6 sm:py-3 rounded-full hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center font-semibold hover:scale-103 text-sm sm:text-base">
              Settings
              <FiSettings className="ml-2 sm:ml-3" size={18} />
            </button>
            <button className="bg-white ring cursor-pointer ring-blue-700 text-blue-700 px-5 py-1.75 sm:px-6 sm:py-3 rounded-full hover:bg-blue-100 hover:shadow-md transition-all duration-300 flex items-center justify-center font-semibold hover:scale-103 text-sm sm:text-base">
              Logout
              <FiLogOut className="ml-2 sm:ml-3" size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-7 lg:gap-5 xl:gap-9">
        {/* Sidebar Menu */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl p-5 sm:p-6 2xl:p-8 h-fit border border-blue-400 hover:shadow-lg hover:shadow-blue-400/50 transition-all duration-300">
          <nav className="space-y-3 sm:space-y-4">
            {[
              {
                icon: <FiUser className="ml-3 text-blue-700" size={18} />,
                label: "My Profile",
                active: true,
              },
              {
                icon: (
                  <FiShoppingBag className="ml-3 text-blue-700" size={18} />
                ),
                label: "My Orders",
              },
              {
                icon: <FiHeart className="ml-3 text-rose-500" size={18} />,
                label: "Favorites",
              },
              {
                icon: (
                  <FiCreditCard className="ml-3 text-green-600" size={18} />
                ),
                label: "Payments",
              },
              {
                icon: <FiHome className="ml-3 text-amber-500" size={18} />,
                label: "Home",
              },
            ].map((item, idx) => (
              <button
                key={idx}
                className={`w-full flex cursor-pointer items-center p-3 sm:p-4 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 ${
                  item.active
                    ? "bg-gradient-to-r from-blue-200 to-cyan-200 text-blue-900 shadow-md"
                    : "hover:bg-gradient-to-r hover:from-blue-100 hover:to-cyan-100 text-blue-800 hover:shadow-sm"
                }`}
                onClick={() => {
                  if (item.label == "Home") {
                    navigate("/");
                  }
                }}
              >
                <span>{item.icon}</span>
                <span className="ml-2 mt-0.25">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Upgrade to Seller */}
          <div className="mt-6 sm:mt-8 md:mt-10 bg-gradient-to-br from-blue-700/20 via-cyan-600/20 to-teal-500/20 p-4 sm:p-5 md:p-6 rounded-2xl border border-blue-300/70 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
            <div className="flex items-center mb-3 sm:mb-4">
              <span>
                <FiShield className="text-blue-700 mr-2" size={20} />
              </span>
              <h3 className="font-bold text-blue-900 text-base sm:text-lg">
                Seller Account
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-blue-800 mb-4 sm:mb-5">
              Upgrade to a seller account to sell your products on Cartona.
            </p>
            <button className="w-full cursor-pointer bg-gradient-to-r from-blue-700 via-cyan-600 to-teal-500 text-white py-2 sm:py-3 rounded-xl hover:shadow-xl hover:scale-103 transition-all duration-300 font-semibold text-sm sm:text-base">
              Upgrade
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6 sm:space-y-7 lg:space-y-5 xl:space-y-9">
          {/* Activity Summary */}
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-6 2xl:p-8 border border-blue-300 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300">
            <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-6 sm:mb-8 flex items-center">
              <FiStar
                className="ml-2 sm:ml-3 text-amber-400 animate-spin-slow"
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
                    {[
                      "Order Number",
                      "Date",
                      "Amount",
                      "Status",
                      "Actions",
                    ].map((head, i) => (
                      <th
                        key={i}
                        className="pb-3 sm:pb-4 px-4 sm:px-6 text-blue-900 font-semibold"
                      >
                        {head}
                      </th>
                    ))}
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
                        {order === 1
                          ? "$1,249"
                          : order === 2
                          ? "$789"
                          : "$2,540"}
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
                        <button className="text-blue-700 hover:text-cyan-600 transition-colors duration-300 underline font-semibold">
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
      </div>
    </div>
  );
};

export default UserDashboard;
