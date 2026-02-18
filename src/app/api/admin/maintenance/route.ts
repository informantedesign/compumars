import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
    try {
        const { action, criteria } = await request.json();

        if (action === 'reset_orders') {
            await sql`TRUNCATE TABLE TBL_PEDIDOS RESTART IDENTITY CASCADE;`;
            // Also clear history tables if separate
            await sql`TRUNCATE TABLE TBL_DIRECCIONES_PEDIDO RESTART IDENTITY CASCADE;`;
            return NextResponse.json({ success: true, message: 'All orders reset.' });
        }

        if (action === 'batch_delete') {
            if (criteria === 'status_cancelled') {
                await sql`DELETE FROM TBL_PEDIDOS WHERE Status = 'Cancelado';`;
                return NextResponse.json({ success: true, message: 'Cancelled orders deleted.' });
            }
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error("Maintenance error:", error);
        return NextResponse.json({ error: 'Maintenance action failed' }, { status: 500 });
    }
}
