import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";

import { getCartProducts } from "../services/cartAPIServices";
import { getNotifications } from "../services/commentAPIServices.js";

import { motion } from "framer-motion";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { IoCart, IoCartOutline } from "react-icons/io5";
import { FiBell } from "react-icons/fi";
import { GoBellFill } from "react-icons/go";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon as UserCircleSolid } from "@heroicons/react/24/solid";
import { useAtom } from "jotai";
import { authAtom } from "../atoms/authAtom.js";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { query } = useParams();
  const [search, setSearch] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isAuth] = useAtom(authAtom);

  const userID = localStorage.getItem("userID");

  useEffect(() => {
    const fetchCartItems = async () => {
      const cartProductsRes = await getCartProducts(userID);
      setCartItems(cartProductsRes.data);

      const notifRes = await getNotifications(userID);
      setNotifications(notifRes.data);
    };

    fetchCartItems();
  }, []);

  useEffect(() => {
    setSearch(() => {
      const params = new URLSearchParams(query);
      if (params.has("search")) {
        return params.get("search");
      } else {
        return "";
      }
    });
  }, [query]);

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 md:hidden">
      <div className="max-w-3xl mx-auto sm:px-[30px]">
        <div className="flex justify-around items-center h-16 bg-white/80 backdrop-blur-md border-t border-blue-100 rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
          {/* have to fix */}
          <Link
            to="/account/favorites"
            className="relative group flex flex-col items-center cursor-pointer w-8 h-8 mt-3 lg:mt-2"
          >
            <FaRegHeart className="absolute inset-0 text-2xl text-blue-600 opacity-100 group-hover:opacity-0 scale-100 group-hover:scale-0 transition-all duration-300" />

            <FaHeart className="absolute inset-0 text-2xl text-blue-600 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300" />
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

          {/* <div className="relative group flex flex-col items-center cursor-pointer w-8 h-8 mt-2 lg:mt-1">
                        <BiCategory className="absolute inset-0 text-2xl lg:text-3xl text-blue-600 opacity-100 group-hover:opacity-0 scale-100 group-hover:scale-0 transition-all duration-300" />
        
                        <BiSolidCategory
                          className="absolute inset-0 text-2xl lg:text-3xl text-blue-600
                           opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300"
                        />
        
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                          Categories
                        </div>
                      </div> */}

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
              {notifications.length}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
