import { FiPercent, FiClock, FiDollarSign } from "react-icons/fi";
import { Field, ErrorMessage } from "formik";

const DiscountSection = ({ hasDiscount, setHasDiscount, setFieldValue }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center text-blue-800 font-medium">
          <FiPercent className="mr-2  mb-0.5" /> Discount
        </label>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={hasDiscount}
            onChange={() => {
              if (hasDiscount) {
                setFieldValue("discounted_price", "");
                setFieldValue("discount_percentage", "");
                setFieldValue("discount_period", "");
              }
              setHasDiscount(!hasDiscount);
            }}
          />
          <div className="relative w-11 h-6 text-blue-800 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
      {hasDiscount && (
        <>
          <div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-blue-500">
                $
              </span>
              <Field
                name="discounted_price"
                type="number"
                step="0.01"
                min="0"
                className="w-full pl-8.5 text-blue-800 pr-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                placeholder="Discounted price"
              />
            </div>
            <ErrorMessage
              name="discounted_price"
              component="div"
              className="text-red-500 text-sm ml-0.5 mt-2"
            />
          </div>
          <div className="space-y-2 sm:flex sm:space-x-6">
            <div className="sm:flex-1">
              <Field
                name="discount_percentage"
                type="number"
                step="1"
                min="0"
                max="100"
                className="w-full pl-4 text-blue-800 pr-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                placeholder="Discount %"
              />
              <ErrorMessage
                name="discount_percentage"
                component="div"
                className="text-red-500 text-sm ml-0.5 mt-2"
              />
            </div>
            <div className="sm:flex-1">
              <div className="relative">
                <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                <Field
                  name="discount_period"
                  type="text"
                  className="w-full pl-9 text-blue-800 pr-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="Period"
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => (e.target.type = "text")}
                />
              </div>
              <ErrorMessage
                name="discount_period"
                component="div"
                className="text-red-500 text-sm ml-0.5 mt-2"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DiscountSection;
