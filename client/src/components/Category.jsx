import { useState, useEffect, useRef } from "react";
import {
  getMainCategories,
  getSubCategories,
} from "../services/productAPIServices";
import { FiChevronLeft, FiChevronRight, FiArrowRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { FiSmartphone, FiHome, FiGlobe } from "react-icons/fi";
import { TbBook } from "react-icons/tb";
import { RiTShirt2Line } from "react-icons/ri";
import { LuLeaf } from "react-icons/lu";
import { FaMotorcycle } from "react-icons/fa6";
import { TbHorseToy } from "react-icons/tb";
import { PiBowlFoodBold } from "react-icons/pi";
import { GoTools } from "react-icons/go";

import { TbBackpack } from "react-icons/tb";

const CategoriesCarousel = ({ mainCategories }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) setVisibleCount(2);
      else if (width < 1024) setVisibleCount(3);
      else setVisibleCount(4);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const next = () => {
    setCurrentIndex((prev) => 
      Math.min(prev + 3, mainCategories.length - visibleCount)
    );
  };

  const prev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const canGoNext = currentIndex < mainCategories.length - visibleCount;
  const canGoPrev = currentIndex > 0;

  // محاسبه عرض هر آیتم بر اساس تعداد visible
  const itemWidth = 100 / visibleCount;

  return (
    <div className="relative">
      {/* کاروسل */}
      <div ref={containerRef} className="relative overflow-hidden rounded-2xl">
        <motion.div
          className="flex gap-5"
          animate={{ x: -currentIndex * itemWidth + '%' }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{ width: `${mainCategories.length * itemWidth}%` }}
        >
          {mainCategories.map((category, index) => (
            <div
              key={category.name + index}
              className="group cursor-pointer relative overflow-hidden rounded-2xl bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
              style={{ width: `${itemWidth - 15}%`, minWidth: `${itemWidth - 30}%` }}
            >
              <div
                className={`${category.color} h-32 flex items-center justify-center relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-400/10"></div>
                <category.icon className="text-4xl text-blue-600 group-hover:text-cyan-500 transition-colors duration-400 relative z-10" />
                
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-cyan-500/0 to-blue-600/0 group-hover:from-blue-600/10 group-hover:via-cyan-500/20 group-hover:to-blue-600/10 transition-all duration-700"></div>
              </div>
              
              <div className="p-5 bg-white flex justify-between items-center">
                <h3 className="font-semibold text-base text-blue-800">
                  {category.name}
                </h3>
                <FiArrowRight
                  size={16}
                  className="text-blue-600 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all duration-300"
                />
              </div>

              <div className="absolute inset-0 border-2 border-transparent group-hover:border-cyan-400 rounded-2xl transition-all duration-300 pointer-events-none"></div>
              
              <div className="absolute inset-0 rounded-2xl shadow-lg group-hover:shadow-cyan-400/20 transition-all duration-500"></div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* دکمه‌های ناوبری */}
      {mainCategories.length > visibleCount && (
        <>
          <button
            onClick={prev}
            disabled={!canGoPrev}
            className="absolute -left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-white border border-blue-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 z-10"
          >
            <FiChevronLeft className="text-blue-600" size={20} />
          </button>
          
          <button
            onClick={next}
            disabled={!canGoNext}
            className="absolute -right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-white border border-blue-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 z-10"
          >
            <FiChevronRight className="text-blue-600" size={20} />
          </button>
        </>
      )}

      {/* نشانگر موقعیت */}
      <div className="text-center mt-4">
        <span className="text-sm text-blue-600 font-medium">
          {currentIndex + 1} - {Math.min(currentIndex + visibleCount, mainCategories.length)} of {mainCategories.length}
        </span>
      </div>
    </div>
  );
};

const Category = () => {
  const [mainCategories, setMainCategories] = useState([]);

  const icons = [
    {
      icon: FiGlobe,
      color: "bg-blue-100",
    },
    { icon: FiHome, color: "bg-cyan-100" },
    { icon: RiTShirt2Line, color: "bg-blue-100" },
    { icon: LuLeaf, color: "bg-cyan-100" },
    { icon: TbBook, color: "bg-blue-100" },
    { icon: FaMotorcycle, color: "bg-cyan-100" },
    { icon: TbBackpack, color: "bg-blue-100" },
    { icon: TbHorseToy, color: "bg-cyan-100" },
    { icon: GoTools, color: "bg-blue-100" },
    { icon: PiBowlFoodBold, color: "bg-cyan-100" },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      const mainRes = await getMainCategories();
      const mainCategoriesWithIcons = await mainRes.data.map(
        (category, index) => {
          const trueIcon = icons.find((icon, inx) => {
            return inx == index;
          });
          return {
            ...category,
            icon: trueIcon.icon,
            color: trueIcon.color,
          };
        }
      );
      setMainCategories(mainCategoriesWithIcons);
    };

    fetchCategories();
  }, []);


  return (
    <div className="mb-20">
      <div className="flex justify-between items-end mb-10">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          Shop by Category
        </h2>
        <a
          href="#"
          className="flex items-center text-blue-600 hover:text-cyan-500 transition-colors"
        >
          View all <FiChevronRight className="ml-1" />
        </a>
      </div>

      <CategoriesCarousel mainCategories={mainCategories} />
    </div>
  );
};

export default Category;
