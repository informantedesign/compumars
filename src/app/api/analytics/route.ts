import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { isWithinInterval, parse, isValid } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // Extract filters
        const vendor = searchParams.get('vendor')?.toLowerCase();
        const product = searchParams.get('product');
        const status = searchParams.get('status');
        const client = searchParams.get('client')?.toLowerCase();

        // Date Range
        const startDateStr = searchParams.get('startDate');
        const endDateStr = searchParams.get('endDate');

        // Fetch the JSON Blob
        const { rows } = await sql`
            SELECT value 
            FROM app_data 
            WHERE key = 'active_orders';
        `;

        if (rows.length === 0) {
            return NextResponse.json({ stats: { totalSales: 0, totalVolume: 0, netProfit: 0, orderCount: 0 }, orders: [] });
        }

        const rawOrders = rows[0].value || [];

        // Filter in Memory
        let filtered = rawOrders.filter((order: any) => {
            // Vendor Filter
            if (vendor) {
                const sName = order.sellerName?.toLowerCase() || '';
                if (!sName.includes(vendor)) return false;
            }

            // Product Filter
            if (product && product !== 'ALL') {
                if (!order.product?.includes(product)) return false;
            }

            // Client Filter
            if (client) {
                // Exact match logic if client is a specific ID/Name from dropdown, or partial if search
                // The dropdown filters by NAME which comes from 'c.name'.
                const cName = order.client?.toLowerCase() || '';
                // Since the dropdown sends the full name, we can use includes or equals. Includes is safer for strictness mismatches.
                if (!cName.includes(client)) return false;
            }

            // Status Filter
            if (status) {
                const statuses = status.split(',');
                if (!statuses.includes(order.status)) return false;
            }

            // Date Range Filter
            if (startDateStr && endDateStr) {
                // order.deliveryDate is often "DD/MM/YYYY" or ISO. We need to handle both.
                // Assuming "DD/MM/YYYY" based on previous code.
                const dateParts = (order.deliveryDate || "").split('/');
                let orderDate = new Date();

                if (dateParts.length === 3) {
                    // DD/MM/YYYY -> MM/DD/YYYY to parse correctly
                    const d = parse(order.deliveryDate, 'dd/MM/yyyy', new Date());
                    if (isValid(d)) orderDate = d;
                } else if (order.date) {
                    orderDate = new Date(order.date);
                }

                const start = new Date(startDateStr);
                const end = new Date(endDateStr);

                // Adjust end date to include the full day
                end.setHours(23, 59, 59, 999);

                if (isValid(orderDate) && isValid(start) && isValid(end)) {
                    if (!isWithinInterval(orderDate, { start, end })) return false;
                }
            }

            return true;
        });

        // Calculate Stats
        const stats = filtered.reduce((acc: any, order: any) => {
            const qtyStr = order.quantity || "0";
            const qty = parseFloat(qtyStr.split(' ')[0]) || 0;
            const income = Number(order.freightPrice) || 0;
            const expense = (Number(order.plantCost) || 0) + (Number(order.driverPayment) || 0) + (Number(order.otherExpenses) || 0);
            const profit = income - expense;

            return {
                totalSales: acc.totalSales + income,
                totalVolume: acc.totalVolume + qty,
                netProfit: acc.netProfit + profit,
                orderCount: acc.orderCount + 1
            };
        }, { totalSales: 0, totalVolume: 0, netProfit: 0, orderCount: 0 });

        // Map to Grid Row Format
        const orders = filtered.map((order: any) => {
            const qtyStr = order.quantity || "0";
            const qty = parseFloat(qtyStr.split(' ')[0]) || 0;
            const income = Number(order.freightPrice) || 0;

            // Normalize Date for display
            const dateParts = (order.deliveryDate || "").split('/');
            let isoDate = new Date().toISOString();
            if (dateParts.length === 3) {
                const d = parse(order.deliveryDate, 'dd/MM/yyyy', new Date());
                if (isValid(d)) isoDate = d.toISOString();
            }

            return {
                id: order.id,
                date: isoDate,
                client: order.client,
                seller: order.sellerName || "Oficina",
                product: order.product,
                quantity: qty,
                total: income,
                status: order.status
            };
        });

        return NextResponse.json({ stats, orders });

    } catch (error) {
        console.error('Analytics API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 });
    }
}
