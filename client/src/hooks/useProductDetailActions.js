import { errorToast } from "../utils/toast";
import { useAtom } from "jotai";
import { addToCartPopupAtom, selectedProductAtom } from "../atoms/popupAtom";
import {
  addFavorite,
  addToCart,
  deleteCartProduct,
  deleteFavorite,
} from "../services/cartAPIServices";

export const useProductDetailActions = (
  product,
  isInCart,
  setIsInCart,
  setFavoriteEntry
) => {
  const [, setSelectedProduct] = useAtom(selectedProductAtom);
  const [, setAddToCartPopup] = useAtom(addToCartPopupAtom);
  const addToCartHandler = async () => {
    console.log(product);
    try {
      const response = await addToCart({ product: product.id, quantity: 1 });

      setSelectedProduct({
        ...product,
        price: product.discounted_price || product.price,
      });

      setIsInCart(response.data);
      setAddToCartPopup(true);
    } catch {
      errorToast("Failed to add product to cart");
    }
  };

  const removeFromCartHandler = async () => {
    try {
      await deleteCartProduct(isInCart.id);
      setIsInCart(null);
    } catch {
      errorToast("Failed to remove product from cart");
    }
  };

  const addFavoriteHandler = async () => {
    try {
      const response = await addFavorite(product.id);
      setFavoriteEntry(response.data);
    } catch (error) {
      if (error.response.data.detail.includes("token")) {
        errorToast("You need to log in first");
      } else {
        errorToast("Failed to add to favorites");
      }
    }
  };

  const removeFavoriteHandler = async (favoriteId) => {
    try {
      await deleteFavorite(favoriteId);
      setFavoriteEntry(null);
    } catch {
      errorToast("Failed to remove from favorites");
    }
  };

  return {
    addToCartHandler,
    removeFromCartHandler,
    addFavoriteHandler,
    removeFavoriteHandler,
  };
};
