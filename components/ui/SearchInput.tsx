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
        className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 transform"
      />
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-md border border-gray-300 py-4 pl-12 pr-2 text-gray-700 focus:border-gray-400 focus:outline-hidden focus:ring-1 focus:ring-gray-100"
      />
    </div>
  );
};

export default SearchInput;
