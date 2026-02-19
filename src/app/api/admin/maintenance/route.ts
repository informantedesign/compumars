import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
    try {
        const { action, criteria } = await request.json();

        if (action === 'reset_orders') {
            // Fix: Clear the JSON store instead of unused TBL_PEDIDOS
            await sql`DELETE FROM app_data WHERE key = 'active_orders';`;
            return NextResponse.json({ success: true, message: 'All orders reset.' });
        }

        if (action === 'batch_delete') {
            if (criteria === 'status_cancelled') {
                // We need to fetch, filter, and save back because it's a JSON blob
                const { rows } = await sql`SELECT value FROM app_data WHERE key = 'active_orders'`;
                if (rows.length > 0) {
                    const currentOrders = rows[0].value || [];
                    const computedOrders = currentOrders.filter((o: any) => o.status !== 'Cancelado');
                    await sql`
                        INSERT INTO app_data (key, value)
                        VALUES ('active_orders', ${JSON.stringify(computedOrders)})
                        ON CONFLICT (key) DO UPDATE SET value = ${JSON.stringify(computedOrders)};
                    `;
                }
                return NextResponse.json({ success: true, message: 'Cancelled orders deleted.' });
            }
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error("Maintenance error:", error);
        return NextResponse.json({ error: 'Maintenance action failed' }, { status: 500 });
    }
}
