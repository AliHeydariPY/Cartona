import { FiStar } from "react-icons/fi";

const RatingFilter = ({ values, setFieldValue }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-blue-700 mb-2">
          Maximum Rating
        </label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => {
                const minRating =
                  values.min_rating != "null" ? values.min_rating : 0;
                if (star >= minRating) {
                  setFieldValue("max_rating", star);
                  if (minRating < 1) {
                    setFieldValue("min_rating", null);
                  }
                }
              }}
              className="transition-transform duration-200 hover:scale-110"
            >
              <FiStar
                size={24}
                className={`text-xl ${
                  values.max_rating >= star
                    ? "text-amber-400 fill-amber-400"
                    : "text-gray-300 fill-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm text-blue-700 mb-2">
          Minimum Rating
        </label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => {
                if (star <= values.max_rating) {
                  if (star > 0) {
                    setFieldValue("min_rating", star);
                  }
                }
              }}
              className="transition-transform duration-200 hover:scale-110"
            >
              <FiStar
                size={24}
                className={`text-xl ${
                  values.min_rating >= star
                    ? "text-amber-400 fill-amber-400"
                    : "text-gray-300 fill-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {(values.min_rating || values.max_rating) && (
        <button
          type="button"
          onClick={() => {
            setFieldValue("min_rating", "");
            setFieldValue("max_rating", "");
          }}
          className="text-xs cursor-pointer text-blue-600 hover:text-cyan-500 transition-colors duration-200"
        >
          Clear rating filters
        </button>
      )}
    </div>
  );
};

export default RatingFilter;
