import {createClient} from '@supabase/supabase-js'

export const supabase = createClient('https://chhlncecdckfxxdcdzvz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoaGxuY2VjZGNrZnh4ZGNkenZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY0NDg0MDIsImV4cCI6MjA0MjAyNDQwMn0.T2xvdaxJjyrtOX9_d2i3TqT4NnIMAvPWekwcyfQo7gI')


export interface Permission {
    table_name: string;
    can_create: boolean;
    can_read: boolean;
    can_write: boolean;
    can_delete: boolean;
}

interface TableColumn {
    column_name: string;
    udt_name: string;
    is_nullable: boolean;
}

export async function getRoles(){
    const {error, data} = await supabase.rpc('get_current_user_roles');
    if (error) {
        return null;
    }
    const roles: string[] = data.map((x: any) => x.role);
    return roles
}

export async function isSignedIn(){
    const {error, data} = await supabase.auth.getUser();
    return !error && data !== null;
}

export async function signOut(){
    await supabase.auth.signOut({scope: 'local'});
}


export const getPermissions = async (role: string): Promise<Permission[]> => {
    const { data, error } = await supabase
        .from('role_permissions_test')
        .select('table_name, can_create, can_read, can_write, can_delete')
        .eq('role_name', role);

    if (error) {
        console.error('Failed to fetch permissions:', error.message);
        return [];
    }

    console.log(`Permissions for role "${role}":`, data);
    return data as Permission[];
};


export const getDataForTable = async (table: string) => {
    try {
        const { data, error } = await supabase
            .from(table)
            .select('*');

        if (error) {
            console.error(`Error fetching data for table ${table}:`, error.message);
            return [];
        }

        return data ?? [];
    } catch (error) {
        console.error(`Unexpected error fetching data for table ${table}:`, error);
        return [];
    }
};

export const getTableSchema = async (table: string) => {
    try {
        const { data, error } = await supabase.rpc('get_table_schema', { table_name: table });

        if (error) {
            console.error(`Failed to fetch schema for table ${table}:`, error.message);
            return {};
        }

        const schema: Record<string, any> = {};
        
        // Fetch all ENUM types and their values
        const { data: enumData, error: enumError } = await supabase.rpc('get_all_enum_values');

        if (enumError) {
            console.error("Failed to fetch ENUM values:", enumError.message);
        }

        // Group ENUM values by type name
        const enumMap = enumData?.reduce((acc: Record<string, string[]>, row: { enum_type: string, enum_value: string }) => {
            if (!acc[row.enum_type]) acc[row.enum_type] = [];
            acc[row.enum_type].push(row.enum_value);
            return acc;
        }, {}) || {};

        data?.forEach((column: TableColumn) => {
            const isArray = column.udt_name.startsWith('_'); // Check if it's an array type
            const type = isArray ? column.udt_name.substring(1) : column.udt_name; // Remove `_` prefix if array
            const isEnum = Object.keys(enumMap).includes(type); // Check if it's an ENUM

            schema[column.column_name] = { 
                type, 
                nullable: column.is_nullable, 
                isArray, 
                isEnum,
                enumValues: isEnum ? enumMap[type] : [] // Attach ENUM values if applicable
            };
        });

        return { columns: schema };
    } catch (error) {
        console.error(`Unexpected error fetching schema for table ${table}:`, error);
        return {};
    }
};


export const upsertTableEntry = async (table: string, data: Record<string, any>) => {
    try {
        const { error } = await supabase.from(table).upsert(data);

        if (error) {
            console.error(`Failed to upsert data in table ${table}:`, error.message);
            throw new Error(error.message);
        }

        console.log(`Successfully upserted data into table "${table}"`);
        return true;
    } catch (error) {
        console.error(`Unexpected error during upsert in table ${table}:`, error);
        throw new Error('An unexpected error occurred during upsert.');
    }
};