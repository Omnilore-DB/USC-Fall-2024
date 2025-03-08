import { supabase } from '@/app/supabase';

export const queryTableWithPrimaryKey = async (
    table: string
): Promise<{ data: any[]; primaryKeys: string[] }> => {
    console.log(`Querying table: ${table}`);

    // Fetch the table content
    const { data, error } = await supabase
        .from(table)
        .select('*');

    if (error) {
        console.error(`Error fetching data from table ${table}:`, error);
        throw error;
    }

    console.log(`Fetched ${data?.length ?? 0} records from table ${table}`);

    // Fetch the primary key information
    const { data: primaryKeyData, error: primaryKeyError } = await supabase
        .rpc('get_primary_key', { table_name: table });

    if (primaryKeyError) {
        console.error(`Error fetching primary keys for table ${table}:`, primaryKeyError);
        throw primaryKeyError;
    }

    // Ensure primary keys are returned as an array
    const primaryKeys = primaryKeyData?.map((row: any) => row.primary_key) ?? [];

    console.log("primary keys ", primaryKeys)

    return { data: data ?? [], primaryKeys };
};

export const queryTableWithFields = async (
    table: string,
    schema: Record<string, any>
): Promise<{ data: Record<string, any>[]; primaryKey: string | null }> => {
    try {
        console.log(`Querying table: ${table} with selected fields...`);

        // Extract field names from schema and ensure "public" is included
        const selectedFields = [...Object.keys(schema), "public"]
            .filter((value, index, self) => self.indexOf(value) === index) // Ensure uniqueness
            .join(", ");

        // Fetch only the required fields from the table
        const { data, error } = await supabase
            .from(table)
            .select(selectedFields)
            .order("pid", { ascending: true });

        if (error || !data) {
            console.error(`Error fetching data from table ${table}:`, error);
            throw error;
        }

        console.log(`Fetched ${data.length} records from table ${table}`);

        // Fetch primary key information
        const { data: primaryKeyData, error: primaryKeyError } = await supabase
            .rpc('get_primary_key', { table_name: table });

        if (primaryKeyError || !primaryKeyData) {
            console.error(`Error fetching primary key for table ${table}:`, primaryKeyError);
            throw primaryKeyError;
        }

        const primaryKey = primaryKeyData?.[0]?.primary_key ?? null;

        // Remove rows where `public` is false
        const filteredData = data.filter((record: Record<string, any>) => record.public !== false)
            .map((record: Record<string, any>) => {
                const filteredRecord = { ...record };
                delete filteredRecord.public; // Remove `public` field from returned data
                return filteredRecord;
            });

        return { data: filteredData, primaryKey };
    } catch (error) {
        console.error(`Error in queryTableWithFields for table ${table}:`, error);
        return { data: [], primaryKey: null };
    }
};
