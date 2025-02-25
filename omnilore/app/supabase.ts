import {createClient} from '@supabase/supabase-js'

export const supabase = createClient('https://chhlncecdckfxxdcdzvz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoaGxuY2VjZGNrZnh4ZGNkenZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY0NDg0MDIsImV4cCI6MjA0MjAyNDQwMn0.T2xvdaxJjyrtOX9_d2i3TqT4NnIMAvPWekwcyfQo7gI')


export interface Permission {
    table_name: string;
    can_create: boolean;
    can_read: boolean;
    can_write: boolean;
    can_delete: boolean;
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