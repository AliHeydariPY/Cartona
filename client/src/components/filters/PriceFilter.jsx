import { Field } from "formik";
import { Range, getTrackBackground } from "react-range";

const PriceFilter = ({ values, setFieldValue }) => {
  return (
    <div className=" py-1">
      <Range
        step={5}
        min={0}
        max={1000}
        values={[
          Number(values.min_price) || 0,
          Number(values.max_price) || 1000,
        ]}
        onChange={(rangeVals) => {
          setFieldValue("min_price", rangeVals[0]);
          setFieldValue("max_price", rangeVals[1]);
        }}
        renderTrack={({ props, children }) => {
          const { key, ...rest } = props;
          return (
            <div
              key={key}
              {...rest}
              className="h-2 mx-3 bg-blue-200 rounded-full cursor-pointer"
              style={{
                background: getTrackBackground({
                  values: [values.min_price || 0, values.max_price || 1000],
                  colors: ["#c6dbfa", "#3b82f6", "#c6dbfa"],
                  min: 0,
                  max: 1000,
                }),
              }}
            >
              {children}
            </div>
          );
        }}
        renderThumb={({ props }) => {
          const { key, ...rest } = props;
          return (
            <div
              key={key}
              {...rest}
              className="w-5 h-5 bg-blue-500 rounded-full shadow-md cursor-grab focus:outline-none"
            />
          );
        }}
      />
      <div className="flex justify-between text-sm text-blue-800 mt-3 ">
        <div>
          $
          <Field
            type="number"
            name="min_price"
            className="w-15 p-0.5 placeholder:text-blue-800 rounded-lg focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="0"
          />
        </div>
        <div>
          $
          <Field
            type="number"
            name="max_price"
            className="w-10 p-0.5 placeholder:text-blue-800 rounded-lg focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="1000"
          />
        </div>
        {/* <span>${values.min_price || 0}</span> */}
        {/* <span>${values.max_price || 1000}</span> */}
      </div>
    </div>
  );
};

export default PriceFilter;
