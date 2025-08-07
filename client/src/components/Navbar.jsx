import { FiSearch } from "react-icons/fi";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { IoCart, IoCartOutline } from "react-icons/io5";
import { BiCategory } from "react-icons/bi";
import { BiSolidCategory } from "react-icons/bi";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon as UserCircleSolid } from "@heroicons/react/24/solid";

const Navbar = () => {
    return(
        <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-6xl mx-auto grid grid-cols-6">
          <div className="flex items-center col-span-1">
            <h1 className="text-3xl font-bold px-4 py-2 mb-0.25 text-blue-600">
              	Cartona
            </h1>
          </div>

          <div className="flex items-center col-span-3 my-3 group border border-blue-600 rounded-full">
            <input
              type="text"
              placeholder="Search products..."
              className="rounded-l-full text-md px-5 py-1 h-full w-full focus:outline-none border-y-2 border-blue-600"
            />

            <div className="relative h-full flex items-center rounded-r-3xl p-1.5 border-y-2 border-blue-600 overflow-hidden cursor-pointer">
              <div className="bg-blue-600 p-2 w-11 h-10 rounded-full relative z-10 flex items-center justify-center">
                <FiSearch className="text-xl text-white" />
              </div>

              <div
                className="absolute inset-0 bg-blue-600 opacity-0 rounded-full 
          group-hover:opacity-100 group-hover:scale-150 
          group-focus-within:opacity-100 group-focus-within:scale-150 
          transition-all duration-400 z-0 origin-center"
              />
            </div>
          </div>

          <div className="flex items-center justify-between col-span-2 mx-9">
            <div className="relative group flex flex-col items-center cursor-pointer w-8 h-8 mt-2">
              <FaRegHeart className="absolute inset-0 text-2xl text-blue-600 opacity-100 group-hover:opacity-0 scale-100 group-hover:scale-0 transition-all duration-300" />

              <FaHeart className="absolute inset-0 text-2xl text-blue-600 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300" />

              <div
                className="absolute top-full mt-1 bg-black text-white text-xs px-2 py-1 rounded 
    opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              >
                Favorite
              </div>
            </div>

            <div className="relative group flex flex-col items-center cursor-pointer w-8 h-8 mt-1">
              <IoCartOutline className="absolute inset-0 text-3xl text-blue-600 opacity-100 group-hover:opacity-0 scale-100 group-hover:scale-0 transition-all duration-300" />

              <IoCart className="absolute inset-0 text-3xl text-blue-600 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300" />

              <div
                className="absolute top-full mt-1 bg-black text-white text-xs px-2 py-1 rounded 
    opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              >
                Cart
              </div>
            </div>

            <div className="relative group flex flex-col items-center cursor-pointer w-8 h-8 mt-0.5">
              <UserCircleIcon className="absolute inset-0 text-3xl text-blue-600 opacity-100 group-hover:opacity-0 scale-100 group-hover:scale-0 transition-all duration-300" />

              <UserCircleSolid className="absolute inset-0 text-3xl text-blue-600 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300" />

              <div className="absolute top-full mt-1 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                Your Account
              </div>
            </div>

            <div className="relative group flex flex-col items-center cursor-pointer w-8 h-8 mt-1">
              <BiCategory className="absolute inset-0 text-3xl text-blue-600 opacity-100 group-hover:opacity-0 scale-100 group-hover:scale-0 transition-all duration-300" />

              <BiSolidCategory className="absolute inset-0 text-3xl text-blue-600 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300" />

              <div className="absolute top-full mt-1 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                Categories
              </div>
            </div>
          </div>
        </div>
      </header>
    )
}

export default Navbar