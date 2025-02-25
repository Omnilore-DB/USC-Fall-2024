import { NextResponse } from 'next/server';
import { getDataForTable } from '@/app/supabase';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const table = searchParams.get('table');

    console.log("Getting values from table", table)

    if (!table) {
        return NextResponse.json({ error: 'Table is required' }, { status: 400 });
    }

    try {
        const data = await getDataForTable(table);
        return NextResponse.json(data ?? []);
    } catch (error) {
        console.error(`Failed to fetch data for table ${table}:`, error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
