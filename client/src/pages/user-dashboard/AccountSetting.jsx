import { motion } from "framer-motion";

import { MdStorefront } from "react-icons/md";
import {
  FiUser,
  FiLock,
  FiLogOut,
  FiChevronRight,
  FiSettings,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { userAtom } from "../../atoms/userAtom";
import { useState } from "react";

import LogoutPopup from "../../components/pop-ups/LogoutPopup";

const AccountSettings = () => {
  const navigate = useNavigate();
  const [user] = useAtom(userAtom);
  const [showPopup, setShowPopup] = useState(false);

  const mainSettings = [
    {
      id: "change-username",
      title: "Change Username",
      description: "Update your account username",
      icon: FiUser,
      path: "change-username",
      color: "blue",
    },
    {
      id: "change-password",
      title: "Change Password",
      description: "Update your account password",
      icon: FiLock,
      path: "change-password",
      color: "blue",
    },
  ];

  const sellerSettings = [
    {
      id: "store-settings",
      title: "Store Setting",
      description: "Manage your store information and preferences",
      icon: MdStorefront,
      path: "store-setting",
      color: "orange",
    },
  ];

  const dangerSettings = [
    {
      id: "logout",
      title: "Log Out",
      description: "Sign out from your account safely",
      icon: FiLogOut,
      color: "red",
    },
  ];

  const handleSettingClick = (path) => {
    navigate(path);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="lg:col-span-3"
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 2xl:p-8 border border-blue-400 hover:shadow-lg hover:shadow-blue-400/50 transition-all duration-300">
        {showPopup && <LogoutPopup onClose={() => setShowPopup(false)} />}

        <div className="mb-6 sm:mb-8">
          <div className="flex items-center mb-2">
            <FiSettings
              className="mr-2 sm:mr-3 text-cyan-500 flex-shrink-0"
              size={20}
            />
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-800">
              Account Settings
            </h2>
          </div>
          <p className="text-blue-600 text-xs sm:text-sm md:text-base">
            Manage your account preferences and security settings
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-3 sm:mb-4">
              Account Management
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {mainSettings.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                  className="flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 cursor-pointer transition-all duration-300 group"
                  onClick={() => handleSettingClick(item.path)}
                >
                  <div className="flex items-center min-w-0 flex-1">
                    <div
                      className={`p-2 sm:p-3 rounded-lg bg-${item.color}-100 text-${item.color}-600 mr-3 sm:mr-4 group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
                    >
                      <item.icon className="text-base sm:text-lg" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-blue-800 text-sm sm:text-base truncate">
                        {item.title}
                      </h3>
                      <p className="text-blue-600 text-xs sm:text-sm truncate">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <FiChevronRight className="text-blue-400 group-hover:text-blue-600 transition-colors duration-300 flex-shrink-0 ml-2" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {user?.role == "storekeeper" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-3 sm:mb-4">
                Seller Account
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {sellerSettings.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                    className="flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl border border-orange-200 bg-orange-50 hover:bg-orange-100 cursor-pointer transition-all duration-300 group"
                    onClick={() => handleSettingClick(item.path)}
                  >
                    <div className="flex items-center min-w-0 flex-1">
                      <div
                        className={`p-2 sm:p-3 rounded-lg bg-orange-100 text-orange-600 mr-3 sm:mr-4 group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
                      >
                        <item.icon className="text-base sm:text-lg" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-orange-800 text-sm sm:text-base truncate">
                          {item.title}
                        </h3>
                        <p className="text-orange-600 text-xs sm:text-sm truncate">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <FiChevronRight className="text-orange-400 group-hover:text-orange-600 transition-colors duration-300 flex-shrink-0 ml-2" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <h3 className="text-base sm:text-lg font-semibold text-red-800 mb-3 sm:mb-4">
              Danger Zone
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {dangerSettings.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                  className="flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 cursor-pointer transition-all duration-300 group"
                  onClick={() => setShowPopup(true)}
                >
                  <div className="flex items-center min-w-0 flex-1">
                    <div
                      className={`p-2 sm:p-3 rounded-lg bg-red-100 text-red-600 mr-3 sm:mr-4 group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
                    >
                      <item.icon className="text-base sm:text-lg" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-red-800 text-sm sm:text-base truncate">
                        {item.title}
                      </h3>
                      <p className="text-red-600 text-xs sm:text-sm truncate">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <FiChevronRight className="text-red-400 group-hover:text-red-600 transition-colors duration-300 flex-shrink-0 ml-2" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default AccountSettings;
