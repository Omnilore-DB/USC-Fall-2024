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
        className="absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2 transform"
      />
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-md border border-gray-300 py-4 pr-2 pl-12 text-gray-700 focus:border-gray-400 focus:ring-1 focus:ring-gray-100 focus:outline-hidden"
      />
    </div>
  );
};

export default SearchInput;
