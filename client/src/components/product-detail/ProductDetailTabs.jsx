import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import Informations from "./product-tabs/Informations";
import Reviews from "./product-tabs/Reviews";
import Questions from "./product-tabs/Questions";

import { FiMessageSquare, FiHelpCircle, FiInfo } from "react-icons/fi";

const ProductDetailTabs = ({
  productQuestions,
  product,
  setProductComments,
  productComments,
  seller,
  user,
  setProductQuestions,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const defaultTab = searchParams.get("tab") || "description";
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setSearchParams({ tab: tabName });
  };

  return (
    <>
      <div className="flex gap-2 sm:gap-4 lg:gap-6 border-b border-blue-300 mt-3 sm:mt-4 lg:mt-6 overflow-x-auto">
        <button
          className={`pb-2 cursor-pointer flex items-center gap-1 sm:gap-2 font-semibold transition-colors duration-300 whitespace-nowrap flex-shrink-0 ${
            activeTab === "description"
              ? "text-blue-700 border-b-2 border-blue-600"
              : "text-blue-400 hover:text-blue-600"
          }`}
          onClick={() => handleTabChange("description")}
        >
          <FiInfo size={16} className="sm:size-[18px] mb-0.5 flex-shrink-0" />
          <span className="text-xs sm:text-sm lg:text-base">Information</span>
        </button>

        <button
          onClick={() => handleTabChange("reviews")}
          className={`pb-2 cursor-pointer flex items-center gap-1 sm:gap-2 font-semibold transition-colors duration-300 whitespace-nowrap flex-shrink-0 ${
            activeTab === "reviews"
              ? "text-blue-700 border-b-2 border-blue-600"
              : "text-blue-400 hover:text-blue-600"
          }`}
        >
          <FiMessageSquare size={16} className="sm:size-[18px] flex-shrink-0" />
          <span className="text-xs sm:text-sm lg:text-base">
            Reviews{" "}
            <span className="hidden xs:inline">({product.comment_count})</span>
            <span className="xs:hidden">({product.comment_count})</span>
          </span>
        </button>

        <button
          onClick={() => handleTabChange("questions")}
          className={`pb-2 cursor-pointer flex items-center gap-1 sm:gap-2 font-semibold transition-colors duration-300 whitespace-nowrap flex-shrink-0 ${
            activeTab === "questions"
              ? "text-blue-700 border-b-2 border-blue-600"
              : "text-blue-400 hover:text-blue-600"
          }`}
        >
          <FiHelpCircle size={16} className="sm:size-[20px] flex-shrink-0" />
          <span className="text-xs sm:text-sm lg:text-base">
            Q&A{" "}
            <span className="hidden xs:inline">
              ({productQuestions.length})
            </span>
            <span className="xs:hidden">({productQuestions.length})</span>
          </span>
        </button>
      </div>

      <div className="mt-3 sm:mt-4 lg:mt-6">
        {activeTab === "description" && <Informations product={product} />}

        {activeTab === "reviews" && (
          <Reviews
            productComments={productComments}
            setProductComments={setProductComments}
            user={user}
          />
        )}

        {activeTab === "questions" && (
          <Questions
            productQuestions={productQuestions}
            seller={seller}
            user={user}
            setProductQuestions={setProductQuestions}
          />
        )}
      </div>
    </>
  );
};

export default ProductDetailTabs;
