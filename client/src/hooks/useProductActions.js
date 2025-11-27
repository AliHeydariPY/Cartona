import {
  addFavorite,
  addToCart,
  deleteCartProduct,
  deleteFavorite,
} from "../services/cartAPIServices";
import { errorToast } from "../utils/toast";
import { useAtom } from "jotai";
import { addToCartPopupAtom, selectedProductAtom } from "../atoms/popupAtom";

export const useProductActions = (setItems) => {
  const [, setAddToCartPopup] = useAtom(addToCartPopupAtom);
  const [, setSelectedProduct] = useAtom(selectedProductAtom);

  const addToCartHandler = async (product) => {
    try {
      const response = await addToCart({
        product: product.id,
        quantity: 1,
      });

      setSelectedProduct({
        ...product,
        price: product.discounted_price || product.price,
      });

      setAddToCartPopup(true);

      setItems((prev) =>
        prev.map((item) => {
          if (item.product.id === product.id) {
            return { ...item, cartItem: response.data };
          }
          return item;
        })
      );
    } catch {
      errorToast("Failed to add product to cart");
    }
  };

  const removeFromCartHandler = async (favItem) => {
    try {
      await deleteCartProduct(favItem.cartItem.id);

      setItems((prev) =>
        prev.map((item) => {
          if (item.id === favItem.id) {
            return { ...item, cartItem: null };
          }
          return item;
        })
      );
    } catch {
      errorToast("Failed to remove product from cart");
    }
  };

  const addFavoriteHandler = async (productId) => {
    try {
      const res = await addFavorite(productId);
      setItems((prev) => [...prev, res.data]);
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

      setItems((prev) => prev.filter((item) => item.id !== favoriteId));
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
