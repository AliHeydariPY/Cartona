import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { FiSearch } from "react-icons/fi";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { IoCart, IoCartOutline } from "react-icons/io5";
import { BiCategory } from "react-icons/bi";
import { BiSolidCategory } from "react-icons/bi";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon as UserCircleSolid } from "@heroicons/react/24/solid";

const Navbar = () => {
  const navigate = useNavigate();
  const { query } = useParams();
  const [search, setSearch] = useState(() => {
    if (query) {
      return query;
    } else {
      return "";
    }
  });

  useEffect(() => {
    setSearch(() => {
    if (query) {
      return query;
    } else {
      return "";
    }
  })
  }, [query])

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-blue-100">
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
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.code === "Enter") {
                    if (search.trim()) {
                      navigate(`/search/${search}`);
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
                  navigate(`/search/${search}`);
                  setSearch("");
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
            <div className="flex items-center justify-end md:justify-center space-x-4 md:space-x-6 lg:space-x-10 xl:space-x-15">
              <div
                onClick={() => navigate("/account/favorites")}
                className="relative group flex flex-col items-center cursor-pointer w-8 h-8 mt-2"
              >
                <FaRegHeart className="absolute inset-0 text-2xl text-blue-600 opacity-100 group-hover:opacity-0 scale-100 group-hover:scale-0 transition-all duration-300" />

                <FaHeart className="absolute inset-0 text-2xl text-blue-600 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300" />

                <div className="absolute -bottom-5.5 left-2/5 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  Favorite
                </div>
              </div>

              <div
                onClick={() => navigate("/account/cart")}
                className="relative group flex flex-col items-center cursor-pointer w-8 h-8 mt-1"
              >
                <IoCartOutline className="absolute inset-0 text-3xl text-blue-600 opacity-100 group-hover:opacity-0 scale-100 group-hover:scale-0 transition-all duration-300" />

                <IoCart className="absolute inset-0 text-3xl text-blue-600 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300" />

                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  Cart
                </div>

                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </div>

              <div
                onClick={() => navigate("/account/profile")}
                className="relative group flex flex-col items-center cursor-pointer w-8 h-8 mt-0.5"
              >
                <UserCircleIcon className="absolute inset-0 text-3xl text-blue-600 opacity-100 group-hover:opacity-0 scale-100 group-hover:scale-0 transition-all duration-300" />

                <UserCircleSolid className="absolute inset-0 text-3xl text-blue-600 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300" />

                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  Your Account
                </div>
              </div>

              <div className="relative group flex flex-col items-center cursor-pointer w-8 h-8 mt-1">
                <BiCategory className="absolute inset-0 text-3xl text-blue-600 opacity-100 group-hover:opacity-0 scale-100 group-hover:scale-0 transition-all duration-300" />

                <BiSolidCategory
                  className="absolute inset-0 text-3xl text-blue-600
                   opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300"
                />

                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  Categories
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
