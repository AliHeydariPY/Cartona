import {
  addFavorite,
  deleteFavorite,
} from "../services/cartAPIServices";
import { errorToast } from "./toast";

export const handleRemoveFavorite = (favoriteId, onUpdate) => {
  try {
    deleteFavorite(favoriteId).then(() => {
      // successToast("Removed from favorites");
      onUpdate();
    });
  } catch {
    errorToast("Failed to remove from favorites");
  }
};

export const handleAddFavorite = async (productId, onUpdate) => {
  try {
    const response = await addFavorite(productId);
    onUpdate(response.data);
  } catch {
    errorToast("Failed to add to favorites");
  }
};
