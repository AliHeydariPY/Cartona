import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiBell,
  FiCheck,
  FiTrash2,
} from "react-icons/fi";
import { MdOutlineStorefront } from "react-icons/md";

import { getNotifications } from "../../services/commentAPIServices";

const Notifications = () => {
  const [filter, setFilter] = useState("All");

  const [notifications, setNotifications] = useState ([])
// {
//   id: 1,
//   user: 1,
//   notification: 1,
//   message: "🛍️ New product 'Wireless Headphones' added by TechStore.",
//   storekeeper_id: 1,
//   product_id: 2,
//   timestamp: "2024-01-20T14:30:00Z",
//   isRead: false,
//   type: "new_product",
// },
// {
//   id: 2,
//   user: 1,
//   notification: 2,
//   message: "🚚 Your order #12345 has been shipped!",
//   storekeeper_id: null,
//   product_id: 5,
//   timestamp: "2024-01-20T12:15:00Z",
//   isRead: true,
//   type: "order_update",
// },
// {
//   id: 3,
//   user: 1,
//   notification: 3,
//   message: "⭐ Your product 'Sports Shoes' received a new 5-star review!",
//   storekeeper_id: 2,
//   product_id: 8,
//   timestamp: "2024-01-20T10:45:00Z",
//   isRead: false,
//   type: "product_review",
// },

  useEffect(() => {
    getNotifications(localStorage.getItem("userID")).then(res => {
        setNotifications(res.data)
    })
  }, [])

  const markAsRead = (id) => {
    console.log("Mark as read:", id);
  };

  const deleteNotification = (id) => {
    console.log("Delete notification:", id);
  };

  const markAllAsRead = () => {
    console.log("Mark all as read");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="lg:col-span-3"
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-6 2xl:p-8 border border-blue-400 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300">
        <div className="flex items-center justify-between mb-8">
          
          <div className="mb-2">
            <div className="flex items-center mb-1 sm:mb-0">
              <FiBell className="text-amber-500 mr-3" size={23} />
              <h1 className="text-base sm:text-lg md:text-2xl font-bold text-blue-800">
                Notifications
              </h1>
            </div>
            <p className="text-blue-700 text-xs sm:text-sm ml-8 sm:ml-[34px]">
              Stay updated with your activities
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span className="ml-auto bg-blue-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              {notifications.filter((n) => !n.isRead).length} unread
            </span>
            <button
              onClick={markAllAsRead}
              className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-800 transition-colors duration-300"
            >
              Mark all read
            </button>
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 mb-4">
          {["All", "Unread", "Read"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 cursor-pointer rounded-lg text-xs sm:text-sm font-semibold border transition-colors duration-300 ${
                filter === status
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-blue-700 border-blue-300 hover:bg-blue-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-12 bg-blue-50/50 rounded-2xl border border-blue-200">
              <FiBell className="text-blue-400 mx-auto mb-4" size={48} />
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                No notifications yet
              </h3>
              <p className="text-blue-600">
                Your notifications will appear here
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  notification.isRead
                    ? "bg-white border-blue-100"
                    : `bg-blue-100 border-blue-200 shadow-sm`
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`p-2 rounded-lg ${
                      notification.isRead ? "bg-blue-100" : "bg-white"
                    }`}
                  >
                    <MdOutlineStorefront className="text-blue-500" size={18} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm ${
                        notification.isRead
                          ? "text-blue-700"
                          : "text-blue-900 font-medium"
                      }`}
                    >
                      {notification.message}
                    </p>
                    <p className="text-xs text-blue-500 mt-1">
                      {new Date(notification.timestamp).toLocaleDateString()} •
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-300"
                        title="Mark as read"
                      >
                        <FiCheck size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors duration-300"
                      title="Delete notification"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>

                {notification.product_id && (
                  <div className="mt-3 pt-3 border-t border-blue-100 flex space-x-2">
                    <button className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg hover:bg-blue-200 transition-colors duration-300">
                      View Product
                    </button>
                    {notification.storekeeper_id && (
                      <button className="px-3 py-1 bg-cyan-100 text-cyan-700 text-xs rounded-lg hover:bg-cyan-200 transition-colors duration-300">
                        Visit Store
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>

        <div className="flex justify-center items-center mt-8 pt-6 border-t border-blue-200">
          <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors duration-300">
            Load More
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Notifications;
