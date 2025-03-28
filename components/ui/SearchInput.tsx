interface SearchInputProps {
  query: string;
  setQuery: (value: string) => void;
}

const SearchInput = ({ query, setQuery }: SearchInputProps) => {
  return (
    <div className="relative w-full">
      <img
        src="/search-icon.svg"
        alt="Search Icon"
        className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5"
      />
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pr-2 pl-12 py-4 border border-gray-300 rounded-md text-gray-700 focus:border-gray-400 focus:ring-1 focus:ring-gray-100 focus:outline-none"
      />
    </div>
  );
};

export default SearchInput;
