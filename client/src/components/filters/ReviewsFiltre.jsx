import { Field } from "formik";

const ReviewsFiltre = ({ minMaxComments, values, setFieldValue }) => {
  const minComments = minMaxComments[0];
  const maxComments = minMaxComments[1];

  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-sm text-blue-700 mb-1">Min Reviews</label>
        <Field
          type="number"
          name="min_comments"
          min={0}
          max={Math.max((values.max_comments ?? maxComments) - 1, 0)}
          placeholder={minComments}
          onChange={(e) => {
            let v = Number(e.target.value);

            if (v < 0) v = 0;

            const currentMax = values.max_comments ?? maxComments;

            if (!(v === 0 && currentMax === 0) && v >= currentMax) {
              v = currentMax - 1;
            }

            setFieldValue("min_comments", v);
          }}
          className="w-full p-2 ring ring-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm text-blue-700 mb-1">Max Reviews</label>
        <Field
          type="number"
          name="max_comments"
          min={0}
          max={maxComments}
          placeholder={maxComments}
          onChange={(e) => {
            let v = Number(e.target.value);
            const currentMin = values.min_comments;

            if ((currentMin === undefined || currentMin === null || currentMin === 0) && v === 0) {
              setFieldValue("max_comments", 0);
              return;
            }

            const safeMin = currentMin ?? 0;
            if (v <= safeMin) {
              v = safeMin + 1;
            }

            if (v > maxComments) v = maxComments;

            setFieldValue("max_comments", v);
          }}
          className="w-full p-2 ring ring-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
    </div>
  );
};

export default ReviewsFiltre;
