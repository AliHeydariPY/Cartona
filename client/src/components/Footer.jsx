import { FiSend } from "react-icons/fi";
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FiChevronLeft } from "react-icons/fi";
import { FiShield } from "react-icons/fi";
import { FiHeart } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-blue-900 to-cyan-800 pt-20 pb-12 px-4 relative overflow-hidden">

      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              animation: `pulse ${Math.random() * 5 + 3}s infinite alternate`,
            }}
          />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAwIDEyMCI+PHBhdGggZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4xIiBkPSJNMCA2MGMwLTE2IDI3LTQ4IDcyLTQ4czcyIDMyIDcyIDQ4LTI3IDQ4LTcyIDQ4UzAgNzYgMCA2MHoiLz48L3N2Zz4=')] bg-repeat-x opacity-60 animate-wave"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-cyan-200 bg-clip-text text-transparent">
                Cartona
              </h3>
              <span className="ml-2 px-2 py-1 mt-1 bg-cyan-500/20 text-cyan-200 text-xs rounded-full">
                Premium
              </span>
            </div>
            <p className="text-blue-100/80 text-lg">
              Your ultimate shopping destination
            </p>
            <div className="flex space-x-5">
              {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube].map(
                (Icon, i) => (
                  <button
                    key={i}
                    className="relative p-2 group cursor-pointer"
                    aria-label={`Follow us on ${
                      [
                        "Facebook",
                        "Twitter",
                        "Instagram",
                        "LinkedIn",
                        "YouTube",
                      ][i]
                    }`}
                  >
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-full scale-75 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <Icon className="relative text-xl text-white group-hover:text-cyan-300 transition-colors duration-300" />
                  </button>
                )
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-white flex items-center">
              <span className="w-3 h-3 bg-cyan-400 rounded-full mr-2"></span>
              Shop
            </h4>
            <ul className="space-y-4">
              {["New Arrivals", "Best Sellers", "Deals", "Gift Cards"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-blue-100 hover:text-white flex items-center group transition-all duration-300"
                    >
                      <FiChevronLeft className="mr-2 mb-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-white flex items-center">
              <span className="w-3 h-3 bg-cyan-400 rounded-full mr-2"></span>
              Support
            </h4>
            <ul className="space-y-4">
              {["Contact Us", "FAQs", "Shipping", "Returns"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-blue-100 hover:text-white flex items-center group transition-all duration-300"
                  >
                    <FiChevronLeft className="mr-2 mb-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-white">Stay Updated</h4>
            <p className="text-blue-100/80">Subscribe for exclusive offers</p>
            <div className="relative group">
              <input
                type="email"
                placeholder="Your email"
                className="w-full py-3 px-5 pr-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-blue-200"
              />
              <button className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-400 to-blue-500 p-2 rounded-full hover:shadow-lg hover:shadow-cyan-400/30 transition-all duration-300">
                <FiSend className="text-lg text-white" />
              </button>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <FiShield className="text-cyan-300 mb-0.25" />
              <span className="text-xs text-blue-100/60">
                We never share your data
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-100/60 text-sm flex items-center">
            <FiHeart className="mr-2 text-rose-400 mb-0.5" />©{" "}
            {new Date().getFullYear()} Cartona. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-gray-200 hover:text-white text-sm transition-colors duration-300 flex items-center"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
