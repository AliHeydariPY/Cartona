import { motion } from "framer-motion";
import {
  FiShoppingBag,
  FiZap,
  FiHeart,
  FiArrowLeft,
  FiAward,
  FiShield,
  FiGlobe,
  FiUsers,
} from "react-icons/fi";

import ScrollToTop from "../components/ScrollToTop";
import { Link } from "react-router-dom";

const About = () => {
  const features = [
    {
      icon: FiShoppingBag,
      title: "Wide Selection",
      description:
        "Discover thousands of curated products from trusted brands — all in one place, organized to make shopping effortless.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: FiZap,
      title: "Fast & Reliable",
      description:
        "Our system ensures quick product discovery, smooth checkout, and reliable delivery, every single time.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: FiHeart,
      title: "Customer-Focused",
      description:
        "With personalized recommendations and a user-friendly experience, Cartona is built entirely around your needs.",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: FiShield,
      title: "Secure Shopping",
      description:
        "Your security is our priority. We use advanced encryption and secure payment systems to protect your data.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: FiGlobe,
      title: "Global Reach",
      description:
        "Connecting buyers and sellers worldwide with seamless international shipping and multi-currency support.",
      color: "from-indigo-500 to-blue-500",
    },
    {
      icon: FiAward,
      title: "Quality Assured",
      description:
        "Every product is carefully vetted to ensure the highest quality standards and customer satisfaction.",
      color: "from-rose-500 to-red-500",
    },
  ];

  const stats = [
    { number: "10K+", label: "Happy Customers" },
    { number: "50K+", label: "Products Available" },
    { number: "500+", label: "Trusted Sellers" },
    { number: "24/7", label: "Customer Support" },
  ];

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.h1
              className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-6"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              About Cartona
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-blue-700 max-w-3xl mx-auto leading-relaxed mb-8"
            >
              At <span className="font-semibold text-blue-600">Cartona</span>,
              we believe shopping should be simple, fast, and enjoyable. We've
              created a modern platform that connects customers with top-quality
              products using smart design, intuitive navigation, and secure
              payment systems.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="text-2xl md:text-3xl font-bold text-blue-900 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-blue-600 text-sm md:text-base">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                className="group cursor-pointer"
              >
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-full">
                  <div
                    className={`inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="text-white text-xl" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-blue-700 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden mb-12"
          >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10 text-center">
              <FiUsers className="text-4xl mx-auto mb-6 text-white opacity-90" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Our Mission
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                We aim to redefine online shopping by combining beautiful
                design, lightning-fast performance, and unwavering trust. Our
                goal is to help users find what they love — faster, safer, and
                with the joy of discovery in every click.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 border border-white/30 shadow-lg mb-12"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-blue-900 mb-6">
                Our Vision
              </h2>
              <div className="grid md:grid-cols-2 gap-8 text-left">
                <div>
                  <h3 className="text-xl font-semibold text-blue-800 mb-4">
                    For Shoppers
                  </h3>
                  <p className="text-blue-700 leading-relaxed">
                    To create the most intuitive and enjoyable shopping
                    experience where every interaction feels personal, every
                    search delivers results, and every purchase brings
                    satisfaction.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-800 mb-4">
                    For Sellers
                  </h3>
                  <p className="text-blue-700 leading-relaxed">
                    To build a platform that empowers businesses of all sizes to
                    reach customers globally with powerful tools, analytics, and
                    support to grow their brand.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            className="text-center bg-white/80 backdrop-blur-lg rounded-3xl p-8 border border-white/30 shadow-lg mb-12"
          >
            <h2 className="text-3xl font-bold text-blue-900 mb-6">
              Built with Modern Technology
            </h2>
            <p className="text-blue-700 text-lg max-w-3xl mx-auto leading-relaxed mb-6">
              Cartona is powered by the latest web technologies including React,
              Django, and modern cloud infrastructure to ensure fast loading
              times, seamless interactions, and robust security for all users.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                "React.js",
                "Django REST",
                "Tailwind CSS",
                "PostgreSQL",
                "Cloud Deployment",
              ].map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-sm font-medium shadow-lg"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 0.6 }}
            className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 border border-white/30 shadow-lg mb-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-blue-900 mb-4">
                Our Team
              </h2>
              <p className="text-blue-700 text-lg max-w-3xl mx-auto leading-relaxed">
                Behind Cartona stands a passionate team of creators and
                developers dedicated to building a better online shopping
                experience.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  name: "Adel Nouri",
                  role: "Frontend Developer",
                  description:
                    "Adel is the creative force behind Cartona’s frontend — focusing on smooth interactions, responsive design, and a delightful user experience.",
                  image:
                    "https://avatars.githubusercontent.com/u/176317348?v=4",
                  link: "/team/adel",
                },
                {
                  name: "Ali Heydari",
                  role: "Backend Developer",
                  description:
                    "Specializing in Python and Django, he ensures Cartona’s backend is fast, secure, and ready for scale.",
                  image: "/images/ali.jpg",
                  link: "/team/friend",
                },
              ].map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.8 + index * 0.1, duration: 0.5 }}
                  className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-28 h-28 rounded-full object-cover mb-4 border-4 border-blue-500/30"
                  />
                  <h3 className="text-xl font-semibold text-blue-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-blue-700 text-sm mb-4 leading-relaxed">
                    {member.description}
                  </p>
                  <Link
                    to="/team"
                    className="px-5 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    View Profile
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.6 }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.history.back()}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 mx-auto"
            >
              <FiArrowLeft />
              <span>Back to Home</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default About;
