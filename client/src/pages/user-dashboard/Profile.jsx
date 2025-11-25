import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { userActivitySummary } from "../../services/userAPIServices";
import { getCartProducts } from "../../services/cartAPIServices";
import { getProduct } from "../../services/productAPIServices";

import RecentOrders from "../../components/profile-sections/RecentOrders";
import RecentFavorites from "../../components/profile-sections/RecentFavorites";
import RecentCartItems from "../../components/profile-sections/RecentCartItems";

const Profile = () => {
  const [userActivity, setUserActivity] = useState({});
  const [recentFavorites, setRecentFavorites] = useState(
    userActivity.recent_favorites || []
  );

  const [recentCartItems, setRecentCartItems] = useState(
    userActivity.recent_cart_items || []
  );
  const { recent_successful_payments = [] } = userActivity || {};

  useEffect(() => {
    const fetchData = async () => {
      const activities = await userActivitySummary();
      const cartProductsRes = await getCartProducts();

      setUserActivity(activities.data);

      const favoriteProducts = await Promise.all(
        activities.data.recent_favorites.map(async (favorite) => {
          const productRes = await getProduct(favorite.product);

          const hasCart = cartProductsRes.data.find((cartProduct) => {
            return cartProduct.product == productRes.data.id;
          });

          return { ...favorite, product: productRes.data, cartItem: hasCart };
        })
      );

      setRecentFavorites(favoriteProducts);

      const cartItems = await Promise.all(
        activities.data.recent_cart_items.map(async (item) => {
          const productRes = await getProduct(item.product);
          return { ...item, product: productRes.data };
        })
      );
      setRecentCartItems(cartItems);
    };

    fetchData();
  }, []);

  const activeOrders = recent_successful_payments.filter(
    (order) => !order.is_delivered
  ).length;
  const totalSpent = recent_successful_payments.reduce(
    (sum, order) => sum + order.total_price,
    0
  );
  const deliveredOrders = recent_successful_payments.filter(
    (order) => order.is_delivered
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="lg:col-span-3"
    >
      <div className="space-y-6 sm:space-y-7 lg:space-y-5 xl:space-y-9">
        {/* Activity Summary */}
        {/* <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-6 2xl:p-8 border border-blue-400 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-6 sm:mb-8 flex items-center">
            <FiStar
              className="mr-2 sm:mr-3 text-amber-400"
              size={22}
            />
            Activity Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-gradient-to-br from-blue-200 to-blue-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-700 font-semibold text-sm sm:text-base">
                    Active Orders
                  </p>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-blue-900">
                    {activeOrders}
                  </h3>
                </div>
                <div className="bg-blue-500 text-white p-3 rounded-full">
                  <FiPackage size={20} />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-200 to-cyan-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-cyan-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-700 font-semibold text-sm sm:text-base">
                    Total Spent
                  </p>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-cyan-900">
                    ${totalSpent.toFixed(2)}
                  </h3>
                </div>
                <div className="bg-cyan-500 text-white p-3 rounded-full">
                  <FiDollarSign size={20} />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-rose-200 to-rose-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-rose-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-rose-700 font-semibold text-sm sm:text-base">
                    Favorites
                  </p>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-rose-900">
                    {recent_favorites.length}
                  </h3>
                </div>
                <div className="bg-rose-500 text-white p-3 rounded-full">
                  <FiHeart size={20} />
                </div>
              </div>
            </div>
          </div>
        </div> */}

        <RecentOrders recentSuccessfulPayments={recent_successful_payments} />

        <RecentFavorites
          setRecentFavorites={setRecentFavorites}
          recentFavorites={recentFavorites}
        />

        <RecentCartItems recentCartItems={recentCartItems} />
      </div>
    </motion.div>
  );
};

export default Profile;
