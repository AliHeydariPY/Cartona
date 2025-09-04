import { useEffect, useState } from "react";
import { FiBell, FiBellOff } from "react-icons/fi";

import {
  getSubscriptions,
  enableNotifications,
  disableNotifications,
} from "../../services/commentAPIServices";
import { useNavigate } from "react-router-dom";

const ProductSeller = ({ seller }) => {
  const navigate = useNavigate();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    getSubscriptions(localStorage.getItem("userID"))
      .then((res) => {
        const hasSubscription = res.data.find((subscription) => {
          return subscription.storekeeper == seller.id;
        });

        if (hasSubscription) {
          setNotificationsEnabled(true);
        } else {
          setNotificationsEnabled(false);
        }
      })
      .catch(() => {
        setNotificationsEnabled(false);
      });
  }, [notificationsEnabled]);

  const toggleNotifications = () => {
    if (notificationsEnabled) {
      getSubscriptions(localStorage.getItem("userID")).then((res) => {
        const selectedSubscription = res.data.find((subscription) => {
          return subscription.storekeeper == seller.id;
        });
        disableNotifications(selectedSubscription.id).then(() => {
          setNotificationsEnabled(false);
        });
      });
    } else {
      enableNotifications({
        user: localStorage.getItem("userID"),
        storekeeper: seller.id,
      }).then((res) => {
        console.log(res);
        setNotificationsEnabled(true);
      });
    }
  };

  return (
    <div className="mb-6 md:mb-12">
      <div className="p-4 sm:p-6 bg-blue-100 rounded-lg sm:rounded-2xl border border-blue-300 shadow-md">
        <h3 className="text-xl font-bold text-blue-900 mb-4 border-b border-blue-300 pb-2 flex items-center justify-between">
          <span>Seller Information</span>

          <button
            onClick={toggleNotifications}
            className={`flex items-center cursor-pointer gap-1 px-3 py-1.5 rounded-full text-sm font-medium shadow transition 
              ${
                notificationsEnabled
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-white text-blue-700 border border-blue-300 hover:bg-blue-50"
              }`}
          >
            {notificationsEnabled ? (
              <>
                <span className="my-0.5">
                  <FiBell className="w-4 h-4 mb-0.5" />
                </span>
                Notifications On
              </>
            ) : (
              <>
                <span>
                  <FiBellOff className="w-4 h-4" />
                </span>
                Enable Notifications
              </>
            )}
          </button>
        </h3>

        <div className="flex items-center gap-3 sm:gap-4 mb-3">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden ring-2 ring-blue-500 shadow">
            <img
              src={seller.image}
              alt={seller.store_name}
              onClick={() => navigate(`/search/storekeeper=${seller.id}`)}
              className="h-full w-full object-cover cursor-pointer"
            />
          </div>
          <div>
            <p className="text-lg font-semibold text-blue-900">
              {seller.store_name}
            </p>
            <p className="text-sm text-blue-700">
              Member since:{" "}
              {new Date(seller.created_time).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
            </p>
          </div>
        </div>

        {seller.description && (
          <p className="text-blue-800 text-sm mb-2 italic">
            "{seller.description}"
          </p>
        )}
        {seller.address && (
          <div className="flex items-center gap-1 text-blue-900 text-sm mb-2">
            <span className="font-semibold">📍 Address:</span>
            <span>{seller.address}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-blue-900">⭐ Rating:</span>
          <span className="text-blue-800">{seller.average_rating} / 5</span>
        </div>
      </div>
    </div>
  );
};

export default ProductSeller;
