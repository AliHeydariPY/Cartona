import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  getSubCategories,
  getSubCategoryItems,
} from "../services/productAPIServices";

import { BiCategory } from "react-icons/bi";
import { FiArrowLeft, FiChevronRight, FiList } from "react-icons/fi";
import BottomNav from "../components/BottomNav";

const SubCategories = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [subCategories, setSubCategories] = useState([]);
  const [subCategoryItmes, setSubCategoryItems] = useState([]);
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    const fetchSubCategories = async () => {
      const response = await getSubCategories(categoryId);
      setSubCategories(response.data);
      //   const mainCatResponse = await getMainCategoryInfo(categoryId);
      //   setSelectedCategory(mainCatResponse.data)

      response.data.map((sub) => {
        getSubCategoryItems(sub.id).then((res) => {
          setSubCategoryItems((prev) => [
            ...prev,
            { id: sub.id, num: res.data.length },
          ]);
        });
      });
    };

    fetchSubCategories();
  }, [categoryId]);

  useEffect(() => {
    console.log(subCategoryItmes);
  }, [subCategoryItmes]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br pb-21 md:pb-7 from-blue-50 to-cyan-100 py-7 px-4 sm:px-6"
      >
        <div className="max-w-6xl mx-auto mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex cursor-pointer items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-300"
          >
            <FiArrowLeft className="mr-2" size={20} />
            Back to Categories
          </button>

          <div className="flex justify-between items-center mb-6">
            <p className="text-blue-700">
              {subCategories.length} sub-categories available
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors duration-300 ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-600 border border-blue-200"
                }`}
              >
                <BiCategory size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors duration-300 ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-600 border border-blue-200"
                }`}
              >
                <FiList size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {subCategories.map((subCategory, index) => (
                <motion.div
                  key={subCategory.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group cursor-pointer bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl border border-blue-200 hover:border-cyan-400 transition-all duration-300 overflow-hidden"
                  onClick={() => navigate(`/search/category=${subCategory.id}`)}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                        <BiCategory className="text-blue-600" size={20} />
                      </div>
                      <FiChevronRight className="text-blue-400 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all duration-300" />
                    </div>

                    <h3 className="font-semibold text-lg text-blue-900 mb-2">
                      {subCategory.name}
                    </h3>

                    <p className="text-blue-600 text-sm">
                      {subCategoryItmes.map((sub) => {
                        return sub.id == subCategory.id ? sub.num : null;
                      })}{" "}
                      products
                    </p>
                  </div>

                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-cyan-400 rounded-2xl transition-all duration-300 pointer-events-none"></div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-blue-200 overflow-hidden">
              {subCategories.map((subCategory, index) => (
                <motion.div
                  key={subCategory.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group cursor-pointer border-b border-blue-100 last:border-b-0 hover:bg-blue-50 transition-colors duration-300"
                  onClick={() => navigate(`/search/category=${subCategory.id}`)}
                >
                  <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center mr-4">
                        <BiCategory className="text-blue-600" size={16} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-900">
                          {subCategory.name}
                        </h3>
                        <p className="text-blue-600 text-sm">
                          {subCategoryItmes.map((sub) => {
                            return sub.id == subCategory.id ? sub.num : null;
                          })}{" "}
                          products available
                        </p>
                      </div>
                    </div>

                    <FiChevronRight className="text-blue-400 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {subCategories.length === 0 && (
            <div className="text-center py-16 bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-blue-200">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BiCategory className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-2">
                No sub-categories found
              </h3>
              <p className="text-blue-600">
                There are no sub-categories available for this category yet.
              </p>
            </div>
          )}
        </div>
      </motion.div>
      <BottomNav />
    </>
  );
};

export default SubCategories;
