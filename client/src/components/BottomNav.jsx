import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getCartProducts } from "../services/cartAPIServices";
import { getNotifications } from "../services/commentAPIServices.js";

import { IoCart, IoCartOutline } from "react-icons/io5";
import { FiBell } from "react-icons/fi";
import { GoBellFill, GoHome, GoHomeFill } from "react-icons/go";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon as UserCircleSolid } from "@heroicons/react/24/solid";

import { useAtom } from "jotai";
import { authAtom } from "../atoms/authAtom.js";

const BottomNav = () => {
  const [cartItems, setCartItems] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isAuth] = useAtom(authAtom);

  useEffect(() => {
    const fetchCartItems = async () => {
      const cartProductsRes = await getCartProducts();
      setCartItems(cartProductsRes.data);

      const notifRes = await getNotifications();
      setNotifications(notifRes.data);
    };

    fetchCartItems();
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 md:hidden">
      <div className="max-w-3xl mx-auto sm:px-[29px]">
        <div className="flex justify-around items-center h-16 bg-white/80 backdrop-blur-md border-x border-t border-blue-400 rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
          <Link
            to="/"
            className="relative group flex flex-col items-center cursor-pointer w-8 h-8 mt-0.5"
          >
            <GoHome className="absolute inset-0 text-3xl text-blue-600 opacity-100 group-hover:opacity-0 scale-100 group-hover:scale-0 transition-all duration-300" />

            <GoHomeFill className="absolute inset-0 text-3xl text-blue-600 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300" />
          </Link>

          <Link
            to={`${isAuth ? "/account/cart" : "/create-account"}`}
            className="relative group flex flex-col items-center cursor-pointer w-8 h-8 mt-2.25"
          >
            <IoCartOutline className="absolute inset-0 text-3xl text-blue-600 opacity-100 group-hover:opacity-0 scale-100 group-hover:scale-0 transition-all duration-300" />

            <IoCart className="absolute inset-0 text-3xl text-blue-600 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300" />

            <span className="absolute -top-1 -right-1.5 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartItems.length}
            </span>
          </Link>

          <Link
            to={`${isAuth ? "/account/profile" : "/create-account"}`}
            className="relative group flex flex-col items-center cursor-pointer w-8 h-8 mt-0.5"
          >
            <UserCircleIcon className="absolute inset-0 text-blue-600 opacity-100 group-hover:opacity-0 scale-100 group-hover:scale-0 transition-all duration-300" />

            <UserCircleSolid className="absolute inset-0 text-blue-600 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300" />
          </Link>

          <Link
            to={`${isAuth ? "/account/notifications" : "/create-account"}`}
            className="relative group flex flex-col items-center cursor-pointer w-8 h-8 mt-2"
          >
            <FiBell className="absolute inset-0 text-3xl text-blue-600 opacity-100 group-hover:opacity-0 scale-100 group-hover:scale-0 transition-all duration-300" />

            <GoBellFill
              className="absolute inset-0 text-3xl text-blue-600
                           opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300"
            />

            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notifications.filter((n) => !n.is_read).length}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
