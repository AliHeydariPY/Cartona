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
  const [recentFavorites, setRecentFavorites] = useState([]);

  const [recentCartItems, setRecentCartItems] = useState([]);

  const { recent_successful_payments = [] } = userActivity || {};

  useEffect(() => {
    const fetchData = async () => {
      const [activities, cartProductsRes] = await Promise.all([
        userActivitySummary(),
        getCartProducts(),
      ]);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="lg:col-span-3"
    >
      <div className="space-y-6 sm:space-y-7 lg:space-y-5 xl:space-y-9">
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
