import { useEffect, useState } from "react";
import { Field } from "formik";
import { Range, getTrackBackground } from "react-range";

const PriceFilter = ({ minMaxPrice, values, setFieldValue }) => {
  const rawMin = Number(minMaxPrice[0]);
  const rawMax = Number(minMaxPrice[1]);

  const minPrice = Math.floor(rawMin);
  const maxPrice = Math.ceil(rawMin === rawMax ? rawMax + 1 : rawMax);

  const [safeMin, setSafeMin] = useState(minPrice);
  const [safeMax, setSafeMax] = useState(maxPrice);

  useEffect(() => {
    setFieldValue(
      "min_price",
      values.min_price > minPrice ? values.min_price || minPrice : minPrice
    );

    setFieldValue(
      "max_price",
      values.max_price < maxPrice ? values.max_price || maxPrice : maxPrice
    );
    if (rawMin === rawMax) {
      setSafeMin(rawMin);
      setSafeMax(rawMin + 1);

      setFieldValue("min_price", rawMin);
      setFieldValue("max_price", rawMin);
    } else {
      setSafeMin(
        values.min_price > minPrice ? values.min_price || minPrice : minPrice
      );
      setSafeMax(
        values.max_price < maxPrice ? values.max_price || maxPrice : maxPrice
      );
    }
  }, [minMaxPrice]);

  const maxWidth = `${String(safeMax).length + 1}ch`;

  return (
    <div className="py-1">
      <Range
        step={1}
        min={minPrice}
        max={maxPrice}
        values={[safeMin, safeMax]}
        onChange={(rangeVals) => {
          setSafeMin(rangeVals[0]);
          setSafeMax(rangeVals[1]);
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
                  values: [safeMin, safeMax],
                  colors: ["#c6dbfa", "#3b82f6", "#c6dbfa"],
                  min: minPrice,
                  max: maxPrice,
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

      <div className="flex justify-between text-sm text-blue-800 mt-3">
        <div>
          $
          <Field
            type="number"
            name="min_price"
            min={minPrice}
            max={safeMax}
            className="w-16 p-0.5 rounded-lg focus:outline-none
                       [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none
                       [&::-webkit-outer-spin-button]:appearance-none"
            placeholder={minPrice}
            onChange={(e) => {
              let val = Number(e.target.value);

              if (val < minPrice) val = minPrice;
              if (val > safeMax) val = safeMax;

              setSafeMin(val);
              setFieldValue("min_price", val);
            }}
          />
        </div>

        <div>
          $
          <Field
            type="number"
            name="max_price"
            min={safeMin}
            max={maxPrice}
            className="p-0.5 rounded-lg focus:outline-none
             [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none
             [&::-webkit-outer-spin-button]:appearance-none"
            style={{ width: maxWidth }}
            placeholder={maxPrice}
            onChange={(e) => {
              let val = Number(e.target.value);

              if (val > maxPrice) val = maxPrice;
              if (val < safeMin) val = safeMin;

              setSafeMax(val);
              setFieldValue("max_price", val);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;
