import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Category from "../components/Category";
import BottomNav from "../components/BottomNav";

import {
  FiChevronRight,
  FiSmartphone,
  FiShoppingBag,
  FiHome,
  FiFeather,
  FiArrowRight,
  FiChevronLeft,
  FiHeart,
  FiStar,
  FiSearch,
} from "react-icons/fi";
import { TfiQuoteRight } from "react-icons/tfi";
import { IoCartOutline } from "react-icons/io5";

const Home = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const inputRef = useRef();

  return (
    <>
      <div className="bg-gradient-to-r from-[#1d4ed8] to-[#3730a3] md:bg-gradient-to-r md:from-blue-50 md:to-blue-50">
        <Navbar />

        <section className="hero-section">
          <div className="hero-bg-effect">
            <div className="hero-bubble-1"></div>
            <div className="hero-bubble-2"></div>
          </div>

          <div className="hero-container">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="hero-title">
                Welcome to <span className="hero-gradient-text">Cartona</span>
              </h2>
              <p className="hero-subtitle">
                Discover your perfect products.{" "}
                <br className="hidden md:block" />
                <strong>Just start typing...</strong>
              </p>

              <div className="hero-search-container">
                <input
                  ref={inputRef}
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
                  placeholder="Search for anything..."
                  className="hero-search-input"
                />
                <button
                  onClick={() => {
                    if (search.trim()) {
                      navigate(`/search/${search}`);
                    }
                  }}
                  className="hero-search-button cursor-pointer"
                >
                  <FiSearch className="text-xl text-white" />
                </button>
              </div>

              <button
                onClick={() => inputRef.current.focus()}
                className="flex items-center gap-2 mx-auto mt-8 px-6 py-3 
             text-white font-medium rounded-full 
             shadow-md hover:shadow-lg hover:shadow-blue-400/30
             transition-colors cursor-pointer duration-300 ease-[cubic-bezier(0.4,0,0.6,1)] 
             bg-gradient-to-r from-cyan-500 to-blue-500 
             hover:from-cyan-600 hover:to-blue-600 
             animate-pulse-slow"
              >
                Explore Top Products
              </button>
            </div>
          </div>
        </section>

        <section className="relative bg-gradient-to-b from-blue-50 to-white py-16 overflow-hidden">
          <div className="absolute top-20 left-10 w-80 h-80 bg-blue-600/10 rounded-full filter blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl animate-float-delay"></div>

          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <Category />

            <div className="mb-20 relative rounded-3xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-10 md:p-16 text-white">
                <div className="max-w-2xl">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Summer Sale!
                  </h2>
                  <p className="text-lg md:text-xl mb-6 opacity-90">
                    Up to 50% off on selected items. Limited time offer.
                  </p>
                  <button className="bg-white cursor-pointer text-blue-600 hover:bg-blue-100 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-colors duration-300">
                    Shop Now
                  </button>
                </div>
              </div>
              <div className="absolute right-10 bottom-0 w-40 h-40 bg-white/10 rounded-full filter blur-xl"></div>
            </div>

            <div className="mb-20">
              <div className="flex justify-between items-end mb-10">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Featured Products
                </h2>
                <div className="flex space-x-4">
                  <button className="p-2 rounded-full bg-white shadow hover:bg-blue-50 transition-colors">
                    <FiChevronLeft className="text-blue-600" />
                  </button>
                  <button className="p-2 rounded-full bg-white shadow hover:bg-blue-50 transition-colors">
                    <FiChevronRight className="text-blue-600" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    id: 1,
                    img: "https://dkstatics-public.digikala.com/digikala-products/9c7ef6413a251ce440b1086d1c12c08a9e5b37c6_1700306862.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/format,webp/quality,q_80",
                  },
                  {
                    id: 2,
                    img: "https://dkstatics-public.digikala.com/digikala-products/fbb88bb17b99181c61beb9a725467a9ca1ecb3a7_1657267311.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/format,webp/quality,q_80",
                  },
                  {
                    id: 3,
                    img: "https://dkstatics-public.digikala.com/digikala-products/440588a89e2641001b4257aad70e8361edb72cef_1752426612.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/format,webp/quality,q_80",
                  },
                  {
                    id: 4,
                    img: "https://dkstatics-public.digikala.com/digikala-products/135df93e0c68205dc94b23d4a8c3db10534ef351_1690386197.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/format,webp/quality,q_80",
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl overflow-hidden transition-all duration-500"
                  >
                    <div className="relative h-60 bg-blue-50 flex items-center justify-center">
                      <div className="w-40 h-40 bg-gradient-to-br from-blue-100 to-white rounded-full"></div>
                      {/* <img src={`${item.img}`} alt="" /> */}
                      <div className="absolute top-4 right-4">
                        <button className="p-2 cursor-pointer bg-white rounded-full shadow-md hover:bg-rose-100 transition-colors">
                          <FiHeart className="text-rose-400" />
                        </button>
                      </div>
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                        <button className="bg-white/90 cursor-pointer backdrop-blur-sm px-6 py-2 rounded-full shadow-md hover:bg-cyan-500 hover:text-white transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
                          Quick View
                        </button>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-blue-800">
                          Premium Product {item.id}
                        </h3>
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                          New
                        </span>
                      </div>
                      <div className="flex items-center mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FiStar
                            key={star}
                            className="text-yellow-400 fill-current"
                          />
                        ))}
                        <span className="text-sm text-blue-500 ml-2">(24)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-blue-900">
                          ${(199 + item.id * 50).toFixed(2)}
                        </span>
                        <button className="p-2 cursor-pointer bg-blue-600 hover:bg-cyan-500 rounded-full text-white transition-colors">
                          <IoCartOutline className="text-lg m-0.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-10 md:p-16 mb-20 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/10 rounded-full filter blur-3xl"></div>
              <div className="text-center max-w-4xl mx-auto">
                <TfiQuoteRight className="text-5xl text-blue-600/20 mx-auto mb-8" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-8">
                  What Our Customers Say
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="bg-blue-50/50 rounded-xl p-6 backdrop-blur-sm"
                    >
                      <div className="flex mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FiStar
                            key={star}
                            className="text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                      <p className="text-blue-800 mb-4">
                        "This is the best shopping experience I've ever had!"
                      </p>
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-full mr-3"></div>
                        <div>
                          <h4 className="font-medium text-blue-900">
                            Customer {item}
                          </h4>
                          <span className="text-sm text-blue-500">
                            Verified Buyer
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-6">
                Ready to Transform Your Shopping Experience?
              </h2>
              <p className="text-xl text-blue-700 mb-8 max-w-3xl mx-auto">
                Join thousands of satisfied customers who already trust Cartona
                for their shopping needs.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <button className="bg-gradient-to-r cursor-pointer from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-colors duration-300">
                  Start Shopping Now
                </button>
                <button className="bg-white cursor-pointer border-2 border-blue-600 text-blue-600 hover:bg-blue-100 px-8 py-4 rounded-full font-semibold shadow hover:shadow-md transition-all duration-300">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>

        <Footer />
        <BottomNav />
      </div>
    </>
  );
};

export default Home;
