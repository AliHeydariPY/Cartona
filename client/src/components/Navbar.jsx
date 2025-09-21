import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";

import { getCartProducts } from "../services/cartAPIServices";
import { getNotifications } from "../services/commentAPIServices.js";

import { FiSearch, FiBell } from "react-icons/fi";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { IoCart, IoCartOutline } from "react-icons/io5";
import { BiCategory } from "react-icons/bi";
import { BiSolidCategory } from "react-icons/bi";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon as UserCircleSolid } from "@heroicons/react/24/solid";
import { GoBellFill } from "react-icons/go";
import { useAtom } from "jotai";
import { authAtom } from "../atoms/authAtom.js";

const Navbar = ({isFocus = false, setIsFocus}) => {
  const navigate = useNavigate();
  const { query } = useParams();
  const [search, setSearch] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isAuth] = useAtom(authAtom);
  const inputRef = useRef()

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
    if(isFocus) {
      inputRef.current.focus()
      setIsFocus()
    }
  }, [isFocus])

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
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 rounded-b-2xl md:rounded-none">
      <div className="max-w-7xl mx-auto py-2 px-4">
        <div className="grid grid-cols-6 items-center justify-between h-16">
          <div className=" hidden md:grid col-span-2 md:col-span-1">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Cartona
              </h1>
            </div>
          </div>

          <div className="flex items-center col-span-6 md:col-span-3 my-2  group p-0.25 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-4xl">
            <div className="w-full bg-white h-12 rounded-l-full ml-0.25">
              <input
                type="text"
                ref={inputRef}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.code === "Enter") {
                    if (search.trim()) {
                      navigate(`/search/search=${search}`);
                    }
                  }
                }}
                placeholder="Search products..."
                className="rounded-l-full text-md text-blue-900 px-5 py-3.5 h-full w-full focus:outline-none border-r-0"
              />
            </div>
            <div
              onClick={() => {
                if (search.trim()) {
                  navigate(`/search/search=${search}`);
                }
              }}
              className="relative h-full flex items-center rounded-r-full my-0.25 mr-0.25 overflow-hidden cursor-pointer bg-white"
            >
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 m-1 w-11 h-10 rounded-full flex items-center justify-center">
                <FiSearch className="text-xl text-white relative z-10 " />
              </div>

              <div
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 rounded-full 
      group-hover:opacity-100 group-hover:scale-150 
      group-focus-within:opacity-100 group-focus-within:scale-150 
      transition-all duration-400 z-0 origin-center"
              />
            </div>
          </div>

          <div className="hidden md:block col-span-2">
            <div className="flex items-center justify-center space-x-4 md:space-x-8 lg:space-x-10 xl:space-x-15">
              {/* have to fix */}

              <Link
                to="/account/favorites"
                className="relative group flex flex-col items-center cursor-pointer w-8 h-8 mt-3 lg:mt-2"
              >
                <FaRegHeart className="absolute inset-0 text-xl lg:text-2xl text-blue-600 opacity-100 group-hover:opacity-0 scale-100 group-hover:scale-0 transition-all duration-300" />

                <FaHeart className="absolute inset-0 text-xl lg:text-2xl text-blue-600 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300" />

                <div className="absolute -bottom-4 lg:-bottom-5.5 left-2/6 lg:left-2/5 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  Favorite
                </div>
              </Link>

              <Link
                to={`${isAuth ? "/account/cart" : "/create-account"}`}
                className="relative group flex flex-col items-center cursor-pointer w-8 h-8 mt-2.25 lg:mt-1"
              >
                <IoCartOutline className="absolute inset-0 text-2xl lg:text-3xl text-blue-600 opacity-100 group-hover:opacity-0 scale-100 group-hover:scale-0 transition-all duration-300" />

                <IoCart className="absolute inset-0 text-2xl lg:text-3xl text-blue-600 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300" />

                <div className="absolute -bottom-4.25 left-2/5 lg:-bottom-6 lg:left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  Cart
                </div>

                <span className="absolute -top-0.75 right-1 lg:-top-1 lg:-right-1 bg-blue-500 text-white text-xs rounded-full w-3.5 h-3.5 lg:w-5 lg:h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              </Link>

              <Link
                to={`${isAuth ? "/account/profile" : "/create-account"}`}
                className="relative group flex flex-col items-center cursor-pointer w-6.5 h-6.5 lg:w-8 lg:h-8 mt-0.5"
              >
                <UserCircleIcon className="absolute inset-0 text-blue-600 opacity-100 group-hover:opacity-0 scale-100 group-hover:scale-0 transition-all duration-300" />

                <UserCircleSolid className="absolute inset-0 text-blue-600 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300" />

                <div className="absolute -bottom-6 left-1/2 lg:-bottom-6.5 lg:left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  Your Account
                </div>
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
                className="relative group flex flex-col items-center cursor-pointer w-8 h-8 mt-2.75 lg:mt-1.5"
              >
                <FiBell className="absolute inset-0 text-2xl lg:text-3xl text-blue-600 opacity-100 group-hover:opacity-0 scale-100 group-hover:scale-0 transition-all duration-300" />

                <GoBellFill
                  className="absolute inset-0 text-2xl lg:text-3xl text-blue-600
                   opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300"
                />

                <div className="absolute -bottom-4 left-2/5 lg:-bottom-6 lg:left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  Notifications
                </div>

                <span className="absolute -top-0.75 right-1.25 lg:-top-1 lg:-right-1 bg-blue-500 text-white text-xs rounded-full w-3.5 h-3.5 lg:w-5 lg:h-5 flex items-center justify-center">
                  {notifications.filter((n) => !n.is_read).length}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
