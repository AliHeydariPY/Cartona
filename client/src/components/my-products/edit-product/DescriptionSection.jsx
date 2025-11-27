import { FiAlignLeft } from "react-icons/fi";
import { Field, ErrorMessage } from "formik";

const DescriptionSection = () => {
  return (
    <div className="space-y-2">
      <label className="flex items-center text-blue-800 font-medium">
        <FiAlignLeft className="mr-2  mb-0.5" /> Description*
      </label>
      <Field
        name="description"
        as="textarea"
        rows={6}
        className="w-full px-4 py-3 text-blue-800 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
        placeholder="Detailed product description..."
      />
      <ErrorMessage
        name="description"
        component="div"
        className="text-red-500 text-sm ml-0.5"
      />
    </div>
  );
};

export default DescriptionSection;
