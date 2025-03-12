import { NextResponse } from 'next/server';
import { getRoles } from '@/app/supabase';

export async function GET() {
    try {
        const roles = await getRoles();
        return NextResponse.json(roles ?? []);
    } catch (error) {
        console.error("Failed to fetch roles:", error);
        return NextResponse.json({ error: 'Failed to fetch roles' }, { status: 500 });
    }
}
