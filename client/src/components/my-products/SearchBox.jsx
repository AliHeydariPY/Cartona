import { FiSearch, FiX } from "react-icons/fi";

export default function SearchBox({
  searchQuery,
  setSearchQuery,
  isSearchFocused,
  setIsSearchFocused,
}) {

  const clearSearch = () => setSearchQuery("");

  return (
    <div
      className={`relative w-full lg:w-80 transition-all duration-300 ${
        isSearchFocused ? "scale-101" : ""
      }`}
    >
      <div className="flex items-center group p-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl shadow-lg">
        <div className="w-full bg-white h-12 rounded-l-xl">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="Search your products..."
            className="rounded-l-xl text-blue-900 px-4 py-3.5 h-full w-full focus:outline-none border-r-0 placeholder-blue-400/70"
          />
        </div>
        <div className="relative h-full flex items-center rounded-r-xl overflow-hidden bg-white">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 m-1 w-11 h-10 rounded-xl flex items-center justify-center">
            {searchQuery ? (
              <FiX
                className="text-xl text-white relative z-10 cursor-pointer"
                onClick={clearSearch}
              />
            ) : (
              <FiSearch className="text-xl text-white relative z-10" />
            )}
          </div>
          <div
            className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 rounded-xl 
            group-hover:opacity-100 group-hover:scale-150 
            group-focus-within:opacity-100 group-focus-within:scale-150 
            transition-all duration-500 z-0 origin-center"
          />
        </div>
      </div>
    </div>
  );
}
