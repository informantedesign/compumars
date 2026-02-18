import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, TrendingUp, CreditCard } from "lucide-react";

export interface DashboardStats {
    totalSales: number;
    totalVolume: number;
    netProfit: number;
    orderCount: number;
}

export function StatsCards({ stats }: { stats: DashboardStats }) {
    return (
        <div className="grid gap-4 md:grid-cols-3 mb-8">
            {/* Sales Card */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Ventas</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${stats.totalSales.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                        Ingresos totales reportados
                    </p>
                </CardContent>
            </Card>

            {/* Volume Card */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Volumen Total</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalVolume.toLocaleString()} Tons</div>
                    <p className="text-xs text-muted-foreground">
                        Cantidad total despachada
                    </p>
                </CardContent>
            </Card>

            {/* Profit Card */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Ganancia Neta</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${stats.netProfit.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                        {stats.orderCount} Órdenes procesadas
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
