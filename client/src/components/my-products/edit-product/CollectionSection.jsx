import { BiCollection } from "react-icons/bi";
import { FiChevronDown } from "react-icons/fi";
import { Field } from "formik";

const CollectionSection = ({
  isCollectionEnabled,
  setIsCollectionEnabled,
  selectedCollection,
  setSelectedCollection,
  collections,
  isCollectionOpen,
  setIsCollectionOpen,
  setFieldValue,
  onCreateCollection,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center text-blue-800 font-medium">
          <BiCollection className="mr-2  mb-0.5" /> Collection
        </label>

        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isCollectionEnabled}
            onChange={() => {
              if (isCollectionEnabled) {
                setSelectedCollection(null);
                setFieldValue("collection", "");
              }
              setIsCollectionEnabled(!isCollectionEnabled);
            }}
          />

          <div
            className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 transition-colors
                      peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] 
                      after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full 
                      after:h-5 after:w-5 after:transition-all"
          ></div>
        </label>
      </div>

      <Field type="hidden" name="collection" />

      {isCollectionEnabled && (
        <div className="relative group w-full">
          <button
            type="button"
            className="flex justify-between w-full items-center bg-white border border-blue-300 rounded-lg px-4 py-3 text-blue-800 hover:border-blue-400 transition-colors duration-300 text-left"
            onClick={() => setIsCollectionOpen(!isCollectionOpen)}
          >
            <span>
              {selectedCollection
                ? selectedCollection.collection_name
                : "Select a collection"}
            </span>

            <FiChevronDown
              className={`ml-2 transform ${
                isCollectionOpen ? "rotate-180" : ""
              } transition-transform duration-300`}
              size={16}
            />
          </button>

          {isCollectionOpen && (
            <div className="absolute w-full z-20 mt-1 bg-white rounded-lg shadow-xl border border-blue-200 max-h-64 overflow-y-auto">
              <button
                type="button"
                className="w-full text-left px-4 py-2 cursor-pointer bg-blue-50 hover:bg-blue-100
      text-blue-700 font-medium transition-colors duration-200 border-b border-blue-200"
                onClick={onCreateCollection}
              >
                + Create new collection
              </button>
              {collections.map((col) => (
                <button
                  key={col.id}
                  type="button"
                  className="w-full cursor-pointer text-left px-4 py-2 hover:bg-blue-50 text-blue-800 transition-colors duration-200"
                  onClick={() => {
                    setSelectedCollection(col);
                    setFieldValue("collection", col.id);
                    setIsCollectionOpen(false);
                  }}
                >
                  {col.collection_name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CollectionSection;
