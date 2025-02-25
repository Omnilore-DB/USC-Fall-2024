import { supabase } from '@/app/supabase';

export const queryTableWithPrimaryKey = async (table: string): Promise<{ data: any[]; primaryKey: string | null }> => {
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
        console.error(`Error fetching primary key for table ${table}:`, primaryKeyError);
        throw primaryKeyError;
    }

    const primaryKey = primaryKeyData?.[0]?.primary_key ?? null;

    return { data: data ?? [], primaryKey };
};
