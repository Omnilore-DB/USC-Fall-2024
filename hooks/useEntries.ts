import { useEffect, useState } from "react";

export const useEntries = (selectedTable: string | null) => {
  const [entries, setEntries] = useState<Record<string, any>[]>([]);

  useEffect(() => {
    if (!selectedTable) return;

    const fetchEntries = async () => {
      try {
        const response = await fetch(`/api/data?table=${selectedTable}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setEntries(data || []);
      } catch (error) {
        console.error(
          `Failed to fetch data for table ${selectedTable}:`,
          error,
        );
      }
    };

    fetchEntries();
  }, [selectedTable]);

  return entries;
};
