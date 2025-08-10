import { useNavigate, useLocation, Outlet } from "react-router-dom";

import {
  FiUser,
  FiShoppingBag,
  FiHeart,
  FiSettings,
  FiCreditCard,
  FiLogOut,
  FiHome,
  FiShield,
} from "react-icons/fi";

const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);
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
                id: "profile",
                icon: <FiUser className="ml-3 text-blue-700" size={18} />,
                label: "My Profile",
              },
              {
                id: "orders",
                icon: (
                  <FiShoppingBag className="ml-3 text-blue-700" size={18} />
                ),
                label: "My Orders",
              },
              {
                id: "favorites",
                icon: <FiHeart className="ml-3 text-rose-500" size={18} />,
                label: "Favorites",
              },
              {
                id: "payments",
                icon: (
                  <FiCreditCard className="ml-3 text-green-600" size={18} />
                ),
                label: "Payments",
              },
              {
                id: "home",
                icon: <FiHome className="ml-3 text-amber-500" size={18} />,
                label: "Home",
              },
            ].map((item, idx) => (
              <button
                key={idx}
                className={`w-full flex cursor-pointer items-center p-3 sm:p-4 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 ${
                  location.pathname == `/account/${item.id}`
                    ? "bg-gradient-to-r from-blue-200 to-cyan-200 text-blue-900 shadow-md"
                    : "hover:bg-gradient-to-r hover:from-blue-100 hover:to-cyan-100 text-blue-800 hover:shadow-sm"
                }`}
                onClick={() => {
                  if (item.id == "profile") {
                    navigate("/account/profile");
                  } else if (item.id == "orders") {
                    navigate("/account/orders");
                  } else if (item.id == "favorites") {
                    navigate("/account/favorites");
                  } else if (item.id == "payments") {
                    navigate("/account/payments");
                  } else if (item.id == "home") {
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
            <button
              onClick={() => navigate("/upgradeToSeller")}
              className="w-full cursor-pointer bg-gradient-to-r from-blue-700 via-cyan-600 to-teal-500 text-white py-2 sm:py-3 rounded-xl hover:shadow-xl hover:scale-103 transition-all duration-300 font-semibold text-sm sm:text-base"
            >
              Upgrade
            </button>
          </div>
        </div>

        {/* Main Content */}
        <Outlet/>
      </div>
    </div>
  );
};

export default UserDashboard;
