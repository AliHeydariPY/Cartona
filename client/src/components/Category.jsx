import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  getMainCategories,
  getSubCategories,
} from "../services/productAPIServices";
import { FiChevronLeft, FiChevronRight, FiArrowRight } from "react-icons/fi";

import { FiSmartphone, FiHome, FiGlobe } from "react-icons/fi";
import { TbBook } from "react-icons/tb";
import { RiTShirt2Line } from "react-icons/ri";
import { LuLeaf } from "react-icons/lu";
import { FaMotorcycle } from "react-icons/fa6";
import { TbHorseToy } from "react-icons/tb";
import { PiBowlFoodBold } from "react-icons/pi";
import { GoTools } from "react-icons/go";

import { TbBackpack } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const CategoriesCarousel = ({ mainCategories }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const containerRef = useRef(null);

  const next = () => {
    setCurrentIndex((prev) =>
      Math.min(
        Number((prev + 0.4).toFixed(1)),
        mainCategories.length - visibleCount
      )
    );
  };

  const prev = () => {
    setCurrentIndex((prev) => Math.max(Number((prev - 0.4).toFixed(1)), 0));
  };

  const canGoNext = currentIndex < 2.4;
  const canGoPrev = currentIndex > 0;

  const itemWidth = 100 / visibleCount;

  return (
    <div className="relative">
      <div ref={containerRef} className="relative overflow-hidden rounded-2xl">
        <motion.div
          className="flex gap-2 xl:gap-5"
          animate={{ x: -currentIndex * itemWidth + "%" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          style={{ width: `${mainCategories.length * itemWidth}%` }}
        >
          {mainCategories.map((category, index) => (
            <div
              key={category.name + index}
              className="group cursor-pointer relative overflow-hidden rounded-2xl bg-white/95 backdrop-blur-sm transition-all duration-300"
              style={{
                width: `${itemWidth - 15}%`,
                minWidth: `${itemWidth - 30}%`,
              }}
              onClick={() => navigate(`/category/${category.id}`)}
            >
              <div
                className={`${category.color} h-32 flex items-center justify-center relative overflow-hidden`}
              >
                <category.icon className="text-4xl text-blue-600 group-hover:text-cyan-500 transition-colors duration-400 relative z-10" />
              </div>

              <div className="p-5 bg-white flex justify-between items-center">
                <h3 className="font-semibold text-base text-blue-800">
                  {category.name}
                </h3>
                <span>
                  <FiArrowRight
                    size={16}
                    className="text-blue-600 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all duration-300"
                  />
                </span>
              </div>

              <div className="absolute inset-0 border-2 border-transparent group-hover:border-cyan-400 rounded-2xl transition-all duration-300 pointer-events-none"></div>

              <div className="absolute inset-0 rounded-2xl shadow-lg group-hover:shadow-cyan-400/20 transition-all duration-500"></div>
            </div>
          ))}
        </motion.div>
      </div>

      {mainCategories.length > visibleCount && (
        <>
          <button
            onClick={prev}
            disabled={!canGoPrev}
            className="absolute cursor-pointer -left-3 top-1/2 transform -translate-y-1/2 p-3 bg-white/60 backdrop-blur-md rounded-full shadow-lg hover:bg-white border border-blue-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 z-10"
          >
            <FiChevronLeft className="text-blue-600" size={20} />
          </button>

          <button
            onClick={next}
            disabled={!canGoNext}
            className="absolute cursor-pointer -right-3 top-1/2 transform -translate-y-1/2 p-3 bg-white/60 backdrop-blur-md rounded-full shadow-lg hover:bg-white border border-blue-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 z-10"
          >
            <FiChevronRight className="text-blue-600" size={20} />
          </button>
        </>
      )}
    </div>
  );
};

const Category = () => {
  const [mainCategories, setMainCategories] = useState([]);

  const icons = [
    { icon: PiBowlFoodBold, color: "bg-cyan-100" },
    { icon: GoTools, color: "bg-blue-100" },
    { icon: TbHorseToy, color: "bg-cyan-100" },
    { icon: TbBackpack, color: "bg-blue-100" },
    { icon: FaMotorcycle, color: "bg-cyan-100" },
    { icon: TbBook, color: "bg-blue-100" },
    { icon: LuLeaf, color: "bg-cyan-100" },
    { icon: RiTShirt2Line, color: "bg-blue-100" },
    { icon: FiHome, color: "bg-cyan-100" },
    {
      icon: FiGlobe,
      color: "bg-blue-100",
    },
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
      setMainCategories(() => {
        return mainCategoriesWithIcons.reverse();
      });
    };

    fetchCategories();
  }, []);

  return (
    <div className="mb-20">
      <div className="flex mb-10">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          Shop by Category
        </h2>
      </div>
      {window.innerWidth > 768 && (
        <CategoriesCarousel mainCategories={mainCategories} />
      )}
    </div>
  );
};

export default Category;
