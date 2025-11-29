import { useEffect, useState, useCallback } from "react";
import {
  getCategory,
  getMinMaxComments,
  getMinMaxPrice,
} from "../services/productAPIServices";
import { getStorekeeperById } from "../services/userAPIServices";

const useSearchFilterData = (query) => {
  const params = new URLSearchParams(query ?? "");

  const filtersConst = {
    min_rating: "",
    max_rating: "",
    min_comments: "",
    max_comments: "",
    min_price: "",
    max_price: "",
    category: null,
    storekeeper: "",
  };

  const [initialFilters, setInitialFilters] = useState({
    min_rating: "",
    max_rating: "",
    min_comments: "",
    max_comments: "",
    min_price: "",
    max_price: "",
    storekeeper: "",
    category: null,
  });

  const [isReady, setIsReady] = useState(false);
  const [storekeeperInfo, setStorekeeperInfo] = useState();
  const [minMaxPrice, setMinMaxPrice] = useState([]);
  const [minMaxComments, setMinMaxComments] = useState([]);

  const setPriceRange = useCallback(async () => {
    let priceRange = [];
    let filteredQuery = "";

    if (query) {
      filteredQuery = query
        .replace(/(&)?min_price=\d+/g, "")
        .replace(/(&)?max_price=\d+/g, "");
    }

    try {
      const min = await getMinMaxPrice("min", filteredQuery);
      priceRange.push(min.data.discounted_price ?? min.data.price);
    } catch {
      priceRange.push(null);
    }

    try {
      const max = await getMinMaxPrice("max", filteredQuery);
      priceRange.push(max.data.price);
    } catch {
      priceRange.push(null);
    }

    setMinMaxPrice(priceRange);
  }, [query]);

  const setCommentRange = useCallback(async () => {
    let commentsRange = [];
    let filteredQuery = "";

    if (query) {
      filteredQuery = query
        .replace(/(&)?min_comments=\d+/g, "")
        .replace(/(&)?max_comments=\d+/g, "");
    }

    try {
      const min = await getMinMaxComments("min", filteredQuery);
      commentsRange.push(min.data.comment_count);
    } catch {
      commentsRange.push(null);
    }

    try {
      const max = await getMinMaxComments("max", filteredQuery);
      commentsRange.push(max.data.comment_count);
    } catch {
      commentsRange.push(null);
    }

    setMinMaxComments(commentsRange);
  }, [query]);

  useEffect(() => {
    const loadFilters = async () => {
      const newFilters = { ...initialFilters };

      const keys = Object.keys(newFilters);

      await Promise.all(
        keys.map(async (filter) => {
          if (params.has(filter)) {
            const value = params.get(filter);

            if (filter === "category") {
              try {
                const res = await getCategory(value);
                newFilters[filter] = res.data;
              } catch {
                newFilters[filter] = "";
              }
            } else {
              newFilters[filter] = isNaN(value) ? value : Number(value);
            }
          } else {
            newFilters[filter] = "";
          }
        })
      );

      if (newFilters.storekeeper) {
        try {
          const res = await getStorekeeperById(newFilters.storekeeper);
          setStorekeeperInfo(res.data);
        } catch {
          setStorekeeperInfo(null);
        }
      } else {
        setStorekeeperInfo(true);
      }

      await Promise.all([setPriceRange(), setCommentRange()]);

      setInitialFilters(newFilters);
      setIsReady(true);
    };

    loadFilters();
  }, [query]);

  return {
    filtersConst,
    params,
    initialFilters,
    setInitialFilters,
    isReady,
    storekeeperInfo,
    minMaxPrice,
    minMaxComments,
    setPriceRange,
    setCommentRange,
  };
};

export default useSearchFilterData;
