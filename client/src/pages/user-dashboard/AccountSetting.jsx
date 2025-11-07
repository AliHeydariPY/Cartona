import { MdStorefront, MdOutlineWorkspacePremium } from "react-icons/md";
import { motion } from "framer-motion";
import {
  FiUser,
  FiLock,
  FiTrash2,
  FiChevronRight,
  FiSettings,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { userAtom } from "../../atoms/userAtom";

const AccountSettings = () => {
  const navigate = useNavigate();
  const [user] = useAtom(userAtom);

  const mainSettings = [
    // {
    //   id: 'change-username',
    //   title: 'Change Username',
    //   description: 'Update your account username',
    //   icon: FiUser,
    //   path: 'change-username',
    //   color: 'blue'
    // },
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
      title: "Store Settings",
      description: "Manage your store information and preferences",
      icon: MdStorefront,
      path: "/account/store-settings",
      color: "orange",
    },
  ];

  const dangerSettings = [
    {
      id: "delete-account",
      title: "Delete Account",
      description: "Permanently delete your account and all data",
      icon: FiTrash2,
      path: "/account/delete-account",
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
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl p-5 sm:p-6 2xl:p-8 border border-blue-400 hover:shadow-lg hover:shadow-blue-400/50 transition-all duration-300">
        <div className="mb-8">
          <div className="flex items-center">
            <FiSettings className="mr-3 mb-2 text-cyan-500" size={22} />
            <h2 className="text-xl sm:text-2xl font-bold text-blue-800 mb-2">
              Account Settings
            </h2>
          </div>
          <p className="text-blue-600 text-sm sm:text-base">
            Manage your account preferences and security settings
          </p>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h3 className="text-lg font-semibold text-blue-800 mb-4">
              Account Management
            </h3>
            <div className="space-y-3">
              {mainSettings.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                  className="flex items-center justify-between p-4 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 cursor-pointer transition-all duration-300 group"
                  onClick={() => handleSettingClick(item.path)}
                >
                  <div className="flex items-center">
                    <div
                      className={`p-3 rounded-lg bg-${item.color}-100 text-${item.color}-600 mr-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <item.icon className="text-lg" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-800">
                        {item.title}
                      </h3>
                      <p className="text-blue-600 text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <FiChevronRight className="text-blue-400 group-hover:text-blue-600 transition-colors duration-300" />
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
              <h3 className="text-lg font-semibold text-blue-800 mb-4">
                Seller Account
              </h3>
              <div className="space-y-3">
                {sellerSettings.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                    className="flex items-center justify-between p-4 rounded-xl border border-orange-200 bg-orange-50 hover:bg-orange-100 cursor-pointer transition-all duration-300 group"
                    onClick={() => handleSettingClick(item.path)}
                  >
                    <div className="flex items-center">
                      <div
                        className={`p-3 rounded-lg bg-orange-100 text-${item.color}-600 mr-4 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <item.icon className="text-lg" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-orange-800">
                          {item.title}
                        </h3>
                        <p className="text-orange-600 text-sm">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <FiChevronRight className="text-orange-400 group-hover:text-orange-600 transition-colors duration-300" />
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
            <h3 className="text-lg font-semibold text-red-800 mb-4">
              Danger Zone
            </h3>
            <div className="space-y-3">
              {dangerSettings.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                  className="flex items-center justify-between p-4 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 cursor-pointer transition-all duration-300 group"
                  onClick={() => handleSettingClick(item.path)}
                >
                  <div className="flex items-center">
                    <div
                      className={`p-3 rounded-lg bg-${item.color}-100 text-${item.color}-600 mr-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <item.icon className="text-lg" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-red-800">
                        {item.title}
                      </h3>
                      <p className="text-red-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                  <FiChevronRight className="text-red-400 group-hover:text-red-600 transition-colors duration-300" />
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
