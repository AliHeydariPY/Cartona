import { FiDollarSign, FiLayers } from "react-icons/fi";
import { Field, ErrorMessage } from "formik";

const PricingSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="flex items-center text-blue-800 font-medium">
          <FiDollarSign className="mr-2 mb-0.5" /> Price*
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-blue-500">
            $
          </span>
          <Field
            name="price"
            type="number"
            step="0.01"
            min="0"
            className="w-full pl-8.5 text-blue-800 pr-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            placeholder="0.00"
          />
        </div>
        <ErrorMessage
          name="price"
          component="div"
          className="text-red-500 text-sm ml-0.5"
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center text-blue-800 font-medium">
          <FiLayers className="mr-2" /> Stock Quantity*
        </label>
        <Field
          name="stock_quantity"
          type="number"
          min="0"
          className="w-full px-4 py-3 text-blue-800 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
          placeholder="100"
        />
        <ErrorMessage
          name="stock_quantity"
          component="div"
          className="text-red-500 text-sm ml-0.5"
        />
      </div>
    </div>
  );
};

export default PricingSection;
