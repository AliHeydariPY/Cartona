import { useState } from "react";

import Informations from "./product-tabs/Informations";
import Reviews from "./product-tabs/Reviews";
import Questions from "./product-tabs/Questions";

import { FiMessageSquare, FiHelpCircle,FiInfo  } from "react-icons/fi";

const ProductDetailTabs = ({
  setShowAnswerPopup,
  setQuestion,
  setReloadComponent,
  productQuestions,
  reloadComponent,
  product,
  productComments,
  seller,
  user
}) => {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <>
      <div className="flex gap-4 sm:gap-6 border-b border-blue-300 mt-4 sm:mt-6">
        <button
          className={`pb-2 cursor-pointer flex items-center gap-1 sm:gap-2 font-semibold transition-colors duration-300 ${
            activeTab === "description"
              ? "text-blue-700 border-b-2 border-blue-600"
              : "text-blue-400 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("description")}
        >
          <FiInfo size={18} className="mb-0.5"/>
          Information
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`pb-2 cursor-pointer flex items-center gap-1 sm:gap-2 font-semibold transition-colors duration-300 ${
            activeTab === "reviews"
              ? "text-blue-700 border-b-2 border-blue-600"
              : "text-blue-400 hover:text-blue-600"
          }`}
        >
          <FiMessageSquare size={18}/> Reviews ({product.comment_count})
        </button>
        <button
          onClick={() => setActiveTab("questions")}
          className={`pb-2 cursor-pointer flex items-center gap-1 sm:gap-2 font-semibold transition-colors duration-300 ${
            activeTab === "questions"
              ? "text-blue-700 border-b-2 border-blue-600"
              : "text-blue-400 hover:text-blue-600"
          }`}
        >
          <FiHelpCircle size={19} className="mb-0.5"/> Questions ({productQuestions.length})
        </button>
      </div>

      {activeTab === "description" && <Informations product={product} />}

      {activeTab === "reviews" && (
        <Reviews
          productComments={productComments}
          setReloadComponent={setReloadComponent}
          reloadComponent={reloadComponent}
          seller={seller}
          user={user}
        />
      )}

      {activeTab === "questions" && (
        <Questions
          productQuestions={productQuestions}
          setShowAnswerPopup={setShowAnswerPopup}
          setQuestion={setQuestion}
          seller={seller}
          setReloadComponent={setReloadComponent}
          reloadComponent={reloadComponent}
          user={user}
        />
      )}
    </>
  );
};

export default ProductDetailTabs;
