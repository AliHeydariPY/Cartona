import { Field } from "formik";
import { useEffect, useState } from "react";

const ReviewsFiltre = ({ minMaxComments, values, setFieldValue }) => {
  const minComments = minMaxComments[0];
  const maxComments = minMaxComments[1];

  const [safeMin, setSafeMin] = useState(minComments);
  const [safeMax, setSafeMax] = useState(maxComments);

  useEffect(() => {
    const currentMin = values.min_comments ?? minComments;
    const currentMax = values.max_comments ?? maxComments;

    if (values.min_comments) {
      setFieldValue(
        "min_comments",
        values.min_comments > minComments
          ? values.min_comments || minComments
          : minComments
      );
    }
    if (values.max_comments) {
      setFieldValue(
        "max_comments",
        values.max_comments < maxComments
          ? values.max_comments || maxComments
          : maxComments
      );
    }

    setSafeMin(currentMin < minComments ? minComments : currentMin);
    setSafeMax(currentMax > maxComments ? maxComments : currentMax);
  }, [minMaxComments]);

  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-sm text-blue-700 mb-1">Min Reviews</label>
        <Field
          type="number"
          name="min_comments"
          min={minComments-1}
          max={safeMax }
          placeholder={minComments}
          onChange={(e) => {
            let val = Number(e.target.value);

            if (val < minComments) val = minComments-1;
            if (val > safeMax) val = safeMax;

            setSafeMin(val);
            setFieldValue("min_comments", val);

            if (val > safeMax) {
              setSafeMax(val);
              setFieldValue("max_comments", val);
            }
          }}
          className="w-full p-2 ring ring-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm text-blue-700 mb-1">Max Reviews</label>
        <Field
          type="number"
          name="max_comments"
          min={safeMin-1}
          max={maxComments }
          placeholder={maxComments}
          onChange={(e) => {
            let val = Number(e.target.value);

            if (val > maxComments) val = maxComments;
            if (val < safeMin) val = safeMin-1;

            setSafeMax(val);
            setFieldValue("max_comments", val);

            if (val < safeMin) {
              setSafeMin(val);
              setFieldValue("min_comments", val);
            }
          }}
          className="w-full p-2 ring ring-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
    </div>
  );
};

export default ReviewsFiltre;
