import { Field } from "formik";

const ReviewsFiltre = () => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-sm text-blue-700 mb-1">Min Reviews</label>
        <Field
          type="number"
          name="min_comments"
          className="w-full p-2 ring ring-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="0"
        />
      </div>
      <div>
        <label className="block text-sm text-blue-700 mb-1">Max Reviews</label>
        <Field
          type="number"
          name="max_comments"
          className="w-full p-2 ring ring-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="1000"
        />
      </div>
    </div>
  );
};

export default ReviewsFiltre;
