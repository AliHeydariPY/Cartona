import { FiImage, FiPlusCircle, FiTrash2 } from "react-icons/fi";
import { ErrorMessage } from "formik";

const ImageUploadSection = ({
  image,
  firstImage,
  onImageUpload,
  onRemoveImage,
  setFieldValue,
}) => {
  return (
    <div className="space-y-2">
      <label className="flex items-center text-blue-800 font-medium">
        <FiImage className="mr-2 mb-0.5" /> Product Image
      </label>

      <div className="relative group w-24 h-24 xl:w-28 xl:h-28">
        <label
          className={`block w-full h-full ${
            !image
              ? "border-2 border-dashed border-blue-400 cursor-pointer"
              : "border border-blue-200"
          } rounded-lg flex items-center justify-center overflow-hidden hover:bg-blue-50 transition-colors duration-300`}
        >
          {image ? (
            <>
              <img
                src={firstImage ? image : URL.createObjectURL(image)}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveImage(0);
                }}
              >
                <FiTrash2 size={12} />
              </button>
            </>
          ) : (
            <>
              <FiPlusCircle
                className="text-blue-500 group-hover:text-blue-700 transition-colors duration-300"
                size={28}
              />
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  onImageUpload(event, 0);
                  setFieldValue("image", event.currentTarget.files[0]);
                }}
                className="hidden"
              />
            </>
          )}
        </label>
      </div>
      <ErrorMessage
        name="image"
        component="div"
        className="text-red-500 text-sm ml-0.5 mt-2"
      />
    </div>
  );
};

export default ImageUploadSection;
