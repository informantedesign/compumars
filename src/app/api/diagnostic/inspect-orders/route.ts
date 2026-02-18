import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { rows } = await sql`
            SELECT value 
            FROM app_data 
            WHERE key = 'active_orders';
        `;

        if (rows.length === 0) return NextResponse.json({ message: 'No active_orders found' });

        return NextResponse.json({
            message: 'Inspect Orders',
            sample: rows[0].value
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed', details: String(error) }, { status: 500 });
    }
}
