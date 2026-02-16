"use client";

import { Suspense, useEffect, useState } from "react";
import { FilterBar } from "@/components/analytics/FilterBar";
import { StatsCards, DashboardStats } from "@/components/analytics/StatsCards";
import { DataGrid, OrderRow } from "@/components/analytics/DataGrid";
import { useSearchParams } from "next/navigation";
import { Download, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

function AnalyticsContent() {
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats>({
        totalSales: 0,
        totalVolume: 0,
        netProfit: 0,
        orderCount: 0,
    });
    const [orders, setOrders] = useState<OrderRow[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Construct query string from current params
                const queryString = searchParams.toString();
                const res = await fetch(`/api/analytics?${queryString}`);
                const data = await res.json();

                if (data.stats) setStats(data.stats);
                if (data.orders) setOrders(data.orders);

            } catch (error) {
                console.error("Failed to fetch analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchParams]);

    const handleExport = () => {
        // Simple CSV export logic based on current data
        const headers = ["ID", "DATE", "CLIENT", "SELLER", "PRODUCT", "QUANTITY", "TOTAL", "STATUS"];
        const rows = orders.map(o => [
            o.id,
            o.date,
            `"${o.client}"`,
            `"${o.seller || ''}"`,
            o.product,
            o.quantity,
            o.total,
            o.status
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `analytics_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background">

            {/* Header Area with FilterBar */}
            <div className="flex flex-col border-b">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 pb-2 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <LayoutDashboard className="h-6 w-6 text-primary" />
                            Explorador de Analítica
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Análisis de operaciones y rendimiento de ventas.
                        </p>
                    </div>
                    <Button variant="outline" onClick={handleExport} disabled={loading || orders.length === 0} className="w-full md:w-auto">
                        <Download className="mr-2 h-4 w-4" />
                        Exportar CSV
                    </Button>
                </div>

                {/* Horizontal Filters */}
                <FilterBar className="px-6 pb-6 pt-2 border-none" />
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6 bg-muted/5">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Stats */}
                    <StatsCards stats={stats} />

                    {/* Data Grid */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold tracking-tight">
                                Detalle de Órdenes <span className="text-muted-foreground font-normal ml-2">({orders.length})</span>
                            </h2>
                        </div>
                        <DataGrid data={orders} loading={loading} />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function AnalyticsPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Cargando módulo de analítica...</div>}>
            <AnalyticsContent />
        </Suspense>
    );
}
