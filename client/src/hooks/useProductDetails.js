import { useEffect, useState } from "react";

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

export const useProductDetails = (id) => {
  const [product, setProduct] = useState(null);
  const [productComments, setProductComments] = useState(null);
  const [productQuestions, setProductQuestions] = useState(null);
  const [seller, setSeller] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          selectedProduct,
          productImgsRes,
          productsFeaturesRes,
          commentsRes,
          questionsRes,
        ] = await Promise.all([
          getProduct(id),
          getProducImages(id).catch(() => ({ data: [] })),
          getProductFeatures(id).catch(() => ({ data: [] })),
          getComments(id).catch(() => ({ data: [] })),
          getProductQuestions().catch(() => ({ data: [] })),
        ]);

        const productData = { ...selectedProduct.data };

        productData.images_set = productImgsRes.data || [];

        productData.features_set = productsFeaturesRes.data || [];

        setProduct(productData);

        getStorekeeperById(selectedProduct.data.storekeeper).then((res) => {
          setSeller(res.data);
        });

        const commentsWithReplies = await Promise.all(
          commentsRes.data.map(async (comment) => {
            try {
              const repliesRes = await getCommentReplies(comment.id);
              return { ...comment, replies: repliesRes.data };
            } catch {
              return { ...comment };
            }
          })
        );

        setProductComments(commentsWithReplies);

        const filteredQuestions = questionsRes.data.filter(
          (q) => q.product == id
        );

        setProductQuestions(filteredQuestions);

        setIsLoading(false);
      } catch {
        setNotFound(true);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    getUser().then((res) => {
      setUser(res.data[0] || null);
    });
  }, []);

  return {
    product,
    productComments,
    productQuestions,
    seller,
    user,
    setUser,
    isLoading,
    notFound,
    setProductComments,
    setProductQuestions,
  };
};
