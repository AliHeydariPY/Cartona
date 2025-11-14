import { convertOffsetToTimes, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import CartonaLoader from "../components/CartonaLoader";

import ProductDetailTabs from "../components/product-detail/ProductDetailTabs";
import ProductDisplay from "../components/product-detail/ProductDisplay";
import ProductSeller from "../components/product-detail/ProductSeller";

import { IoCartOutline } from "react-icons/io5";

import {
  getProduct,
  getProducImages,
  getProductFeatures,
} from "../services/productAPIServices";
import {
  getComments,
  getProductQuestions,
  getCommentReplies,
} from "../services/commentAPIServices";
import { getStorekeeperById, getUser } from "../services/userAPIServices";
import ProductNotFound from "../components/ProductNotFound";

const ProductDetails = ({
  setShowAnswerPopup,
  setQuestion,
  reloadComponent,
  setReloadComponent,
  setAddToCartPopup,
  setSelectedProduct,
}) => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [productComments, setProductComments] = useState(null);
  const [productQuestions, setProductQuestions] = useState(null);
  const [seller, setSeller] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const selectedProduct = await getProduct(id);
        let prodcutData = { ...selectedProduct.data };

        try {
          const productImgs = await getProducImages(id);

          prodcutData.images_set = productImgs.data;
        } catch {
          prodcutData.images_set = [];
        }

        try {
          const productsFeatures = await getProductFeatures(id);

          prodcutData.features_set = productsFeatures.data;
        } catch {
          prodcutData.features_set = [];
        }

        setProduct(prodcutData);

        const seller = getStorekeeperById(selectedProduct.data.storekeeper);
        seller.then((res) => {
          setSeller(res.data);
        });

        try {
          const comments = await getComments(id);
          const commentsWithReplies = await Promise.all(
            comments.data.map(async (comment) => {
              try {
                const repliesResponse = await getCommentReplies(comment.id);
                const replies = repliesResponse.data;
                return { ...comment, replies };
              } catch {
                return { ...comment };
              }
            })
          );
          setProductComments(commentsWithReplies);
        } catch {
          setProductComments([]);
        }

        try {
          const allQuestions = await getProductQuestions();
          const questions = allQuestions.data.map((qus) => {
            return qus.product == id ? qus : null;
          });

          setProductQuestions(questions.filter(Boolean));
        } catch {
          setProductQuestions([]);
        }
        setIsLoading(false);
      } catch {
        setNotFound(true);
      }
    };
    fetchData();
  }, [id, reloadComponent]);

  useEffect(() => {
    getUser().then((res) => {
      setUser([res.data[0] ? res.data[0] : "not found"]);
    });
  }, []);

  if (notFound) return <ProductNotFound />;

  return (
    <>
      <CartonaLoader isLoading={isLoading} />
      {product && productComments && seller && productQuestions && user[0] && (
        <div className="min-h-screen bg-blue-100 flex justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-6xl"
          >
            <div className="bg-white/95 backdrop-blur-xl shadow-lg border border-blue-400 transition-all duration-300 p-4 sm:p-6 md:p-8 sm:rounded-xl md:rounded-2xl lg:rounded-3xl">
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

              <ProductDisplay
                product={product}
                setAddToCartPopup={setAddToCartPopup}
                setSelectedProduct={setSelectedProduct}
              />

              <ProductSeller seller={seller} />

              <ProductDetailTabs
                setShowAnswerPopup={setShowAnswerPopup}
                setQuestion={setQuestion}
                setReloadComponent={setReloadComponent}
                productQuestions={productQuestions}
                id={id}
                reloadComponent={reloadComponent}
                product={product}
                productComments={productComments}
                seller={seller}
                user={user}
              />
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default ProductDetails;
