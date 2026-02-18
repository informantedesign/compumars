import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { rows } = await sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public';
        `;

        return NextResponse.json({
            message: 'List Tables V4',
            tables: rows.map(r => r.table_name)
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to check schema', details: String(error) }, { status: 500 });
    }
}
