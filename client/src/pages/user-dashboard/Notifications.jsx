import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

import { MdOutlineStorefront } from "react-icons/md";
import { FiBell, FiCheck, FiTrash2 } from "react-icons/fi";

import {
  deleteNotification,
  getNotifications,
  notificationMarkAsRead,
} from "../../services/commentAPIServices";

const Notifications = () => {
  const [filter, setFilter] = useState("All");
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  // {
  //   id: 1,
  //   user: 1,
  //   notification: 1,
  //   message: "🛍️ New product 'Wireless Headphones' added by TechStore.",
  //   storekeeper_id: 1,
  //   product_id: 2,
  //   timestamp: "2024-01-20T14:30:00Z",
  //   is_read: false,
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
  //   is_read: true,
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
  //   is_read: false,
  //   type: "product_review",
  // },

  useEffect(() => {
    getNotifications().then((res) => {
      console.log(res.data);
      setNotifications(res.data);
    });
  }, []);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    notificationMarkAsRead(id);
  };

  const deleteNotif = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id != id));
    deleteNotification(id);
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => {
        return !notif.is_read ? { ...notif, is_read: true } : { ...notif };
      })
    );

    notifications.map((notif) => {
      if (!notif.is_read) {
        notificationMarkAsRead(notif.id);
      }
    });
  };

  const openInNewTab = (url) => {
    window.open(url, "_blank", "noreferrer");
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "All") return true;
    if (filter === "Unread") return !notif.is_read;
    if (filter === "Read") return notif.is_read;
    return true;
  });

  const ITEM_HEIGHT = window.innerWidth >= 640 ? 120 : 95;

  const Row = ({ index, style }) => {
    const notification = filteredNotifications[index];

    return (
      <div style={{ ...style, width: "98%" }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className={`p-2 sm:p-4 rounded-xl border transition-all duration-300 mb-3 sm:mb-4 ${
            notification.is_read
              ? "bg-white border-blue-100"
              : "bg-blue-100 border-blue-200 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center  gap-2 sm:gap-4">
              <div
                onClick={() =>
                  navigate(`/search/storekeeper=${notification.storekeeper_id}`)
                }
                className={`p-1.5 sm:p-2 rounded-lg ${
                  notification.is_read ? "bg-blue-100" : "bg-white"
                }`}
              >
                <MdOutlineStorefront className="text-blue-500" size={16} />
              </div>

              <p
                className={`text-xs sm:text-sm ${
                  notification.is_read
                    ? "text-blue-700"
                    : "text-blue-900 font-medium"
                }`}
              >
                {(() => {
                  const regex = /'(.*?)'/;
                  const match = notification.message.match(regex);

                  if (match) {
                    const productName = match[1];
                    const words = productName.split(" ");
                    let shortName = productName;

                    if (words.length > 2) {
                      shortName = words.slice(0, 2).join(" ") + "...";
                    }

                    return notification.message.replace(productName, shortName);
                  }

                  return notification.message;
                })()}
              </p>
            </div>

            {window.innerWidth >= 640 && (
              <div className="flex items-center gap-1.5 sm:gap-2">
                {!notification.is_read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="p-1.5 sm:p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-300"
                    title="Mark as read"
                  >
                    <FiCheck size={16} className="sm:w-4 sm:h-4" />
                  </button>
                )}
                <button
                  onClick={() => deleteNotif(notification.id)}
                  className="p-1.5 sm:p-2 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors duration-300"
                  title="Delete notification"
                >
                  <FiTrash2 size={14} className="sm:w-4 sm:h-4" />
                </button>
              </div>
            )}
          </div>

          {notification.product_id && (
            <div className=" pt-2 sm:pt-3 flex flex-wrap justify-between gap-1.5">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() =>
                    openInNewTab(`/product/${notification.product_id}`)
                  }
                  className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 text-[10px] sm:text-xs rounded-lg hover:bg-blue-200 transition-colors duration-300"
                >
                  View Product
                </button>
                {window.innerWidth > 640 && notification.storekeeper_id && (
                  <button
                    onClick={() =>
                      navigate(
                        `/search/storekeeper=${notification.storekeeper_id}`
                      )
                    }
                    className="px-2 sm:px-3 py-1 bg-cyan-100 text-cyan-700 text-[10px] sm:text-xs rounded-lg hover:bg-cyan-200 transition-colors duration-300"
                  >
                    Visit Store
                  </button>
                )}
              </div>

              {window.innerWidth < 640 && (
                <div className="flex items-center gap-0.5 sm:gap-2">
                  {!notification.is_read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-1.5 sm:p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-300"
                      title="Mark as read"
                    >
                      <FiCheck size={14} className="sm:w-4 sm:h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotif(notification.id)}
                    className="p-1.5 sm:p-2 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors duration-300"
                    title="Delete notification"
                  >
                    <FiTrash2 size={14} className="sm:w-4 sm:h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="lg:col-span-3"
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 2xl:p-8 border border-blue-400 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300">
        <div className="sm:flex sm:items-center justify-between mb-4">
          <div className="mb-3 sm:mb-0">
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

          <div className="flex items-center justify-between space-x-3">
            <span className=" bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {notifications.filter((n) => !n.is_read).length} unread
            </span>
            <button
              onClick={markAllAsRead}
              className="bg-blue-600 cursor-pointer text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-800 transition-colors duration-300"
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

        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 bg-blue-50/50 rounded-2xl border border-blue-200">
            <FiBell className="text-blue-400 mx-auto mb-4" size={48} />
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              No notifications yet
            </h3>
            <p className="text-blue-600">Your notifications will appear here</p>
          </div>
        ) : (
          <div className="max-h-[600px] w-full">
            <AutoSizer disableHeight>
              {({ width }) => (
                <List
                  height={Math.min(
                    filteredNotifications.length * ITEM_HEIGHT,
                    window.innerWidth < 640 ? 375 : 593
                  )}
                  width={width}
                  itemCount={filteredNotifications.length}
                  itemSize={ITEM_HEIGHT}
                  itemData={filteredNotifications}
                  className="custom-scrollbar"
                >
                  {Row}
                </List>
              )}
            </AutoSizer>
          </div>
        )}

        {/* <div className="flex justify-center items-center mt-6 2xl:pt-6 border-t border-blue-200">
          <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors duration-300">
            Load More
          </button>
        </div> */}
      </div>
    </motion.div>
  );
};

export default Notifications;
