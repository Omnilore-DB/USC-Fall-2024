import { NextResponse } from 'next/server';
import { getPermissions } from '@/app/supabase';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    if (!role) {
        return NextResponse.json({ error: 'Role is required' }, { status: 400 });
    }

    try {
        const permissions = await getPermissions(role);
        return NextResponse.json(permissions ?? []);
    } catch (error) {
        console.error(`Failed to fetch permissions for role ${role}:`, error);
        return NextResponse.json({ error: 'Failed to fetch permissions' }, { status: 500 });
    }
}
