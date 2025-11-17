import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/home/Footer";
import Category from "../components/home/Category";
import BottomNav from "../components/BottomNav";

import {
  FiChevronRight,
  FiChevronLeft,
  FiHeart,
  FiStar,
  FiSearch,
} from "react-icons/fi";
import { TfiQuoteRight } from "react-icons/tfi";
import { IoCartOutline } from "react-icons/io5";
import FeaturedProducts from "../components/home/FeaturedProducts";

const Home = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const inputRef = useRef();

  return (
    <>
      <div className="bg-gradient-to-r from-[#1d4ed8] to-[#3730a3] md:from-blue-50 md:to-blue-50">
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
                        navigate(`/search/search=${search}`);
                      }
                    }
                  }}
                  placeholder="Search for anything..."
                  className="hero-search-input"
                />
                <button
                  onClick={() => {
                    if (search.trim()) {
                      navigate(`/search/search=${search}`);
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
                  <button
                    onClick={() => {
                      inputRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                      setTimeout(() => inputRef.current?.focus(), 300);
                    }}
                    className="bg-white cursor-pointer text-blue-600 hover:bg-blue-100 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-colors duration-300"
                  >
                    Shop Now
                  </button>
                </div>
              </div>
              <div className="absolute right-10 bottom-0 w-40 h-40 bg-white/10 rounded-full filter blur-xl"></div>
            </div>

            
              <FeaturedProducts />

            <div className="bg-white/60 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 md:p-12 lg:p-16 mb-12 sm:mb-16 lg:mb-20 relative overflow-hidden border border-white/30">
              <div className="absolute -top-10 sm:-top-16 -right-10 sm:-right-16 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-r from-blue-600/10 to-cyan-500/10 rounded-full filter blur-2xl sm:blur-3xl"></div>
              <div className="absolute -bottom-16 sm:-bottom-24 -left-10 sm:-left-16 w-28 h-28 sm:w-40 sm:h-40 lg:w-56 lg:h-56 bg-cyan-500/5 rounded-full filter blur-2xl sm:blur-3xl"></div>

              <div className="text-center max-w-4xl mx-auto relative z-10">
                <TfiQuoteRight className="text-4xl sm:text-5xl lg:text-6xl text-blue-600/15 mx-auto mb-4 sm:mb-6 lg:mb-8 transform hover:scale-110 transition-transform duration-300" />

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-4 sm:mb-6 lg:mb-8 px-2">
                  Voices of Trust & Satisfaction
                </h2>

                <p className="text-blue-700/80 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 lg:mb-12 max-w-2xl mx-auto px-4">
                  Discover why thousands of customers choose Cartona for their
                  shopping journey
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {[
                    {
                      name: "Sarah Johnson",
                      role: "Frequent Shopper",
                      text: "The seamless experience and fast delivery keep me coming back. Cartona understands what modern shoppers need!",
                      rating: 5,
                    },
                    {
                      name: "Michael Chen",
                      role: "Tech Enthusiast",
                      text: "Finally, an app that makes online shopping feel personal and secure. The interface is absolutely stunning!",
                      rating: 5,
                    },
                    {
                      name: "Emma Rodriguez",
                      role: "Home Decor Lover",
                      text: "From discovery to delivery, every step feels carefully crafted. My go-to for all home essentials!",
                      rating: 5,
                    },
                  ].map((testimonial, index) => (
                    <div
                      key={index}
                      className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/40 shadow-md hover:shadow-lg sm:hover:shadow-xl hover:scale-[1.02] sm:hover:scale-101 transition-all duration-300 group flex flex-col h-full"
                    >
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-center mb-3 sm:mb-4 gap-1">
                          {[...Array(testimonial.rating)].map(
                            (_, starIndex) => (
                              <FiStar
                                key={starIndex}
                                size={14}
                                className="sm:size-4 text-yellow-400 fill-current transform group-hover:scale-110 transition-transform duration-200"
                                style={{
                                  transitionDelay: `${starIndex * 50}ms`,
                                }}
                              />
                            )
                          )}
                        </div>

                        <div className="flex-1 mb-4 sm:mb-6">
                          <p className="text-blue-800/90 text-xs sm:text-sm leading-relaxed italic line-clamp-4 h-full">
                            "{testimonial.text}"
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-center mt-auto pt-3 sm:pt-4 border-t border-white/50">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full mr-3 sm:mr-4 flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg flex-shrink-0">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div className="text-left min-w-0 flex-1">
                          <h4 className="font-semibold text-blue-900 text-sm sm:text-base group-hover:text-blue-700 transition-colors duration-300 truncate">
                            {testimonial.name}
                          </h4>
                          <span className="text-xs sm:text-sm text-blue-900/80 font-medium block truncate">
                            {testimonial.role}
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
                <button
                  onClick={() => {
                    inputRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                    setTimeout(() => inputRef.current?.focus(), 600);
                  }}
                  className="bg-gradient-to-r cursor-pointer from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-colors duration-300"
                >
                  Start Shopping Now
                </button>
                <Link
                  to="/about"
                  className="bg-white cursor-pointer border-2 border-blue-600 text-blue-600 hover:bg-blue-100 px-8 py-4 rounded-full font-semibold shadow hover:shadow-md transition-all duration-300"
                >
                  Learn More
                </Link>
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
