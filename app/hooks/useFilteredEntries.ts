import { useEffect, useState } from "react";

export const useFilteredEntries = (
  entries: Record<string, any>[],
  query: string,
) => {
  const [filteredEntries, setFilteredEntries] = useState<Record<string, any>[]>(
    [],
  );

  useEffect(() => {
    const keywords = query.toLowerCase().split(" ").filter(Boolean);
    setFilteredEntries(
      entries.filter((item) =>
        keywords.every((kw) =>
          Object.values(item).some(
            (value) =>
              value !== null && value.toString().toLowerCase().includes(kw),
          ),
        ),
      ),
    );
  }, [query, entries]);

  return filteredEntries;
};
