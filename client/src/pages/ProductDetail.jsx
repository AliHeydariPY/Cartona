import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

import CartonaLoader from "../components/CartonaLoader";

import ProductDetailTabs from "../components/product-detail/ProductDetailTabs";
import ProductDisplay from "../components/product-detail/ProductDisplay";
import ProductSeller from "../components/product-detail/ProductSeller";

import { IoCartOutline } from "react-icons/io5";

import ProductNotFound from "../components/ProductNotFound";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";
import { useProductDetails } from "../hooks/useProductDetails";

const ProductDetails = () => {
  const { id } = useParams();
  const {
    product,
    productComments,
    productQuestions,
    seller,
    user,
    isLoading,
    notFound,
    setProductComments,
    setProductQuestions,
  } = useProductDetails(id);

  if (notFound)
    return (
      <>
        <Navbar />
        <ProductNotFound />
      </>
    );

  return (
    <div className="bg-white/95 sm:bg-blue-100">
      <CartonaLoader isLoading={isLoading} />
      <Navbar />

      {product && productComments && seller && productQuestions && (
        <div className="min-h-screen flex justify-center p-0 sm:p-4 sm:pb-20 md:p-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-6xl"
          >
            <div className="bg-white/95 backdrop-blur-xl \ sm:border border-blue-400 transition-all duration-300 pb-20 p-4 sm:p-6 md:p-8 sm:rounded-xl md:rounded-2xl lg:rounded-3xl">
              <div className="flex flex-row items-start justify-between mb-6 sm:mb-8">
                <div className="flex items-start mb-0">
                  <span>
                    <IoCartOutline
                      className="text-blue-600 mr-2 mt-1 md:mt-2"
                      size={22}
                    />
                  </span>
                  <h1 className="text-base md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mt-1">
                    {product.name}
                  </h1>
                </div>
                <span
                  className={`ml-auto mt-1.5 sm:mt-1 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${
                    product.stock_quantity > 0 ? "bg-blue-600" : "bg-red-600"
                  }`}
                >
                  {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              <ProductDisplay product={product} />

              <ProductSeller seller={seller} />

              <ProductDetailTabs
                productQuestions={productQuestions}
                id={id}
                product={product}
                setProductComments={setProductComments}
                productComments={productComments}
                seller={seller}
                user={user}
                setProductQuestions={setProductQuestions}
              />
            </div>
          </motion.div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default ProductDetails;
