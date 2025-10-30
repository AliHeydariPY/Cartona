import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { authAtom } from "../atoms/authAtom";
import { useNavigate, useLocation, Outlet, Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  FiUser,
  FiShoppingBag,
  FiHeart,
  FiSettings,
  FiCreditCard,
  FiLogOut,
  FiHome,
  FiShield,
  FiPackage,
  FiShoppingCart,
  FiUsers,
  FiDollarSign,
  FiPlusCircle,
  FiFileText,
  FiBell,
  FiMessageSquare,
  FiX,
} from "react-icons/fi";
import { GoHome } from "react-icons/go";
import { AiOutlineStar } from "react-icons/ai";
import { MdStorefront, MdOutlineWorkspacePremium } from "react-icons/md";
import BottomNav from "../components/BottomNav";
import LogoutPopup from "../components/pop-ups/LogoutPopup";
import { getStorekeeper, logout } from "../services/userAPIServices";

const UserDashboard = () => {
  const [isAuth] = useAtom(authAtom);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSeller, setIsSeller] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [storekeeper, setStorekeeper] = useState([]);

  const navItems = [
    {
      id: "profile",
      icon: <FiUser className="ml-3 text-blue-700 mr-0.25" size={18} />,
      label: "My Profile",
    },

    {
      id: "favorites",
      icon: <FiHeart className="ml-3 text-rose-500 mr-0.25" size={18} />,
      label: "Favorites",
    },
    {
      id: "notifications",
      icon: <FiBell className="ml-3 text-amber-500 mr-0.25" size={18} />,
      label: "Notifications",
    },
    {
      id: "cart",
      icon: <FiShoppingCart className="ml-3 text-blue-700 mr-0.25" size={18} />,
      label: "Cart",
    },
    {
      id: "orders",
      icon: <FiFileText className="ml-3 text-green-600 mr-0.25" size={18} />,
      label: "Orders",
    },
    {
      id: "chats",
      icon: <FiMessageSquare className="ml-3 text-green-600 mr-0.25" size={18} />,
      label: "Chats",
    },
    ...(isSeller
      ? [
          {
            id: "my-products",
            icon: <FiPackage className="ml-3 text-amber-600 mr-0.25" size={18} />,
            label: "My Products",
          },
          {
            id: "add-product",
            icon: (
              <FiPlusCircle className="ml-3 text-green-500 mb-0.25 mr-0.25" size={18} />
            ),
            label: "Add Product",
          },
          {
            id: "payments",
            icon: (
              <FiDollarSign className="ml-3 text-green-500 mb-0.25 mr-0.25" size={18} />
            ),
            label: "Payments",
          },
        ]
      : []),
    {
      id: "home",
      icon: <GoHome className="ml-3 text-amber-500 mb-0.5" size={19} />,
      label: "Home",
    },
  ];

  useEffect(() => {
    getStorekeeper(localStorage.getItem("username"))
      .then((res) => {
        
        setStorekeeper(res.data);
        setIsSeller(true);
      })
      .catch(() => setIsSeller(false));
  }, []);

  useEffect(() => {
    if (!isAuth) {
      navigate("/");
    }
  }, [isAuth]);

  const handleLogout = () => {
    logout().catch((err) => {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-4 rounded-xl shadow-lg border border-white/20 backdrop-blur-md flex items-center space-x-3 rtl:space-x-reverse`}
        >
          <FiX className="text-xl shrink-0" />
          <span className="font-medium">{err.response.data.detail}</span>
        </div>
      ));
    });
  };

  return (
    <>
      {isAuth && isSeller != null && (
        <div className="min-h-screen bg-gradient-to-b from-blue-700/30 via-cyan-600/20 to-blue-400/20 p-4 sm:p-7 lg:p-5 xl:p-9 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 bg-cyan-500/40 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-8 left-4 w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-blue-700/30 rounded-full blur-3xl animate-pulse delay-1500"></div>
          {showPopup && (
            <LogoutPopup
              onClose={() => setShowPopup(false)}
              onConfirm={() => handleLogout()}
            />
          )}

          <div className="relative bg-white/90 backdrop-blur-3xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 2xl:p-8 mb-4 sm:mb-7 lg:mb-5 xl:mb-9 border border-blue-400 transition-transform duration-300 hover:scale-[1.004] hover:shadow-blue-500/60">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-700 to-teal-400 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl md:text-4xl shadow-lg ring-2 sm:ring-3 md:ring-4 ring-blue-300/60 overflow-hidden relative">
                    {isSeller ? (
                      <>
                        <img
                          src={storekeeper.image}
                          alt="Store"
                          className="w-full h-full object-cover rounded-full"
                        />
                        <MdStorefront
                          className="absolute -bottom-1 -right-2 text-white font-bold bg-blue-600 rounded-full p-0.5 shadow-md"
                          size={20}
                        />
                      </>
                    ) : (
                      <FiUser className="text-white" size={35} />
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full border-2 border-white shadow-lg animate-bounce"></div>
                </div>
                <div className="ml-3 sm:ml-4 md:ml-5">
                  <div className="flex items-center">
                    <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-blue-900 drop-shadow-md">
                      {storekeeper?.user || localStorage.getItem("username")}
                    </h1>
                    {isSeller && (
                      <span className="ml-2 px-2 py-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold rounded-full flex items-center">
                        <MdOutlineWorkspacePremium
                          className="mr-1 mb-0.25"
                          size={15}
                        />{" "}
                        SELLER
                      </span>
                    )}
                  </div>
                  {isSeller ? (
                    <p className="text-sm sm:text-base text-blue-800 font-semibold mt-1">
                      Member since:{" "}
                      {storekeeper.created_time
                        .split(" ")[0]
                        .replace(/-/g, "/")}
                      <span className="inline-block ml-2 text-green-600">
                        • Verified Store
                      </span>
                    </p>
                  ) : (
                    <p className="flex items-center text-sm sm:text-base text-blue-600 mt-1">
                      <AiOutlineStar
                        className="mr-1 text-yellow-500 mb-0.5"
                        size={18}
                      />
                      Happy to have you here
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-full sm:w-auto">
                <Link
                  to="setting"
                  className="bg-gradient-to-r cursor-pointer from-blue-700 to-cyan-500 text-white px-5 py-2 sm:px-6 sm:py-3 rounded-full hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center font-semibold hover:scale-103 text-sm sm:text-base"
                >
                  Setting
                  <FiSettings className="ml-2 sm:ml-3" size={18} />
                </Link>
                <button
                  onClick={() => setShowPopup(true)}
                  className="bg-white ring cursor-pointer ring-blue-700 text-blue-700 px-5 py-1.75 sm:px-6 sm:py-3 rounded-full hover:bg-blue-100 hover:shadow-md transition-all duration-300 flex items-center justify-center font-semibold hover:scale-103 text-sm sm:text-base"
                >
                  Logout
                  <FiLogOut className="ml-2 sm:ml-3" size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 pb-15 md:pb-0 sm:gap-7 lg:gap-5 xl:gap-9">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 2xl:p-8 h-fit border border-blue-400 hover:shadow-lg hover:shadow-blue-400/50 transition-all duration-300">
              <nav className="space-y-3 sm:space-y-4">
                {navItems.map((item, idx) => (
                  <button
                    key={idx}
                    className={`w-full flex cursor-pointer items-center p-3 sm:p-4 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 ${
                      location.pathname.includes(`/account/${item.id}`)
                        ? "bg-gradient-to-r from-cyan-200 to-blue-400 text-blue-900 shadow-md"
                        : "hover:bg-gradient-to-r hover:from-cyan-100 hover:to-blue-200 text-blue-800 transition-colors duration-300"
                    }`}
                    onClick={() => {
                      navigate(
                        `${item.id != "home" ? `/account/${item.id}` : "/"}`
                      );
                    }}
                  >
                    <span>{item.icon}</span>
                    <span className="ml-2 mt-0.25">{item.label}</span>
                  </button>
                ))}
              </nav>

              {!isSeller && (
                <div className="mt-4 2xl:mt-6 bg-gradient-to-br from-blue-700/20 via-cyan-600/20 to-teal-500/20 p-4 sm:p-5 md:p-6 rounded-2xl border border-blue-300/70 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <span>
                      <MdStorefront
                        className="text-blue-700 mr-2 lg:mr-1 xl:mr-2"
                        size={20}
                      />
                    </span>
                    <h3 className="font-bold text-blue-900 text-base sm:text-lg lg:text-base xl:text-lg">
                      Seller Account
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-blue-800 mb-4 sm:mb-5">
                    Upgrade to a seller account to sell your products on Cartona
                  </p>
                  <Link
                    to="/upgrade-to-seller"
                    className="block w-full text-center cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-2 sm:py-3 rounded-xl hover:shadow-xl hover:scale-103 transition-all duration-300 font-semibold text-sm sm:text-base"
                  >
                    Upgrade
                  </Link>
                </div>
              )}
            </div>

            <Outlet />
          </div>

          <BottomNav />
        </div>
      )}
    </>
  );
};

export default UserDashboard;
