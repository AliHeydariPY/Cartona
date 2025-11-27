import { FiZap, FiClock } from "react-icons/fi";
import { Field, ErrorMessage } from "formik";

const AmazingOfferSection = ({
  isAmazingOffer,
  setIsAmazingOffer,
  setFieldValue,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center text-blue-800 font-medium">
          <FiZap className="mr-2 text-amber-500  mb-0.5" /> Amazing Offer
        </label>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer text-blue-800"
            checked={isAmazingOffer}
            onChange={() => {
              if (isAmazingOffer) {
                setFieldValue("amazing_offer", "");
                setFieldValue("amazing_offer_period", "");
              }
              setIsAmazingOffer(!isAmazingOffer);
            }}
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
        </label>
      </div>
      {isAmazingOffer && (
        <div className="space-y-2 sm:space-y-0 grid grid-cols-1 md:grid-cols-2 sm:gap-6">
          <div>
            <Field
              name="amazing_offer"
              type="text"
              className="w-full px-4 py-3 text-blue-800 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              placeholder="Offer title"
            />
            <ErrorMessage
              name="amazing_offer"
              component="div"
              className="text-red-500 text-sm ml-0.5 mt-2"
            />
          </div>
          <div>
            <div className="relative">
              <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
              <Field
                name="amazing_offer_period"
                type="text"
                className="w-full pl-10 pr-4 py-3 text-blue-800 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                placeholder="Offer period"
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => (e.target.type = "text")}
              />
            </div>
            <ErrorMessage
              name="amazing_offer_period"
              component="div"
              className="text-red-500 text-sm ml-0.5 mt-2"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AmazingOfferSection;
