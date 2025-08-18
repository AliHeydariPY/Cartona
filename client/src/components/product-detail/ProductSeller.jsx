const ProductSeller = ({seller}) => {
  return (
    <div className="mb-6 md:mb-12">
      {/* Seller Card */}
      <div className="p-4 sm:p-6 bg-blue-100 rounded-lg sm:rounded-2xl border border-blue-300 shadow-md">
        <h3 className="text-xl font-bold text-blue-900 mb-4 border-b border-blue-300 pb-2">
          Seller Information
        </h3>

        <div className="flex items-center gap-3 sm:gap-4 mb-3">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden ring-2 ring-blue-500 shadow">
            <img
              src={seller.image}
              alt={seller.store_name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-lg font-semibold text-blue-900">
              {seller.store_name}
            </p>
            <p className="text-sm text-blue-700">
              Member since:{" "}
              {new Date(seller.created_time).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
            </p>
          </div>
        </div>

        {seller.description && (
          <p className="text-blue-800 text-sm mb-2 italic">
            "{seller.description}"
          </p>
        )}
        {seller.address && (
          <div className="flex items-center gap-1 text-blue-900 text-sm mb-2">
            <span className="font-semibold">📍 Address:</span>
            <span>{seller.address}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-blue-900">⭐ Rating:</span>
          <span className="text-blue-800">{seller.average_rating} / 5</span>
        </div>
      </div>
    </div>
  );
};

export default ProductSeller;
