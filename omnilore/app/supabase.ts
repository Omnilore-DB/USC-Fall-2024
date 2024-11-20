import {createClient} from '@supabase/supabase-js'

export const supabase = createClient('https://chhlncecdckfxxdcdzvz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoaGxuY2VjZGNrZnh4ZGNkenZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY0NDg0MDIsImV4cCI6MjA0MjAyNDQwMn0.T2xvdaxJjyrtOX9_d2i3TqT4NnIMAvPWekwcyfQo7gI')

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
    await supabase.auth.signOut();
}

