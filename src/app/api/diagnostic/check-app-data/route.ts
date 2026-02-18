import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { rows } = await sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'app_data';
        `;

        return NextResponse.json({
            message: 'Check app_data schema',
            columns: rows
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to check schema', details: String(error) }, { status: 500 });
    }
}
