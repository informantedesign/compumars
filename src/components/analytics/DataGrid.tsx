import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export interface OrderRow {
    id: number;
    date: string;
    client: string;
    product: string;
    quantity: number;
    total: number;
    status: string;
    seller?: string;
}

const statusColorMap: Record<string, string> = {
    "Entregado": "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
    "En Planta": "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
    "Reguia": "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    "Cancelado": "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
    "En Ruta": "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    "Cargando": "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
};

export function DataGrid({ data, loading }: { data: OrderRow[], loading: boolean }) {
    if (loading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse">Cargando datos...</div>;
    }

    if (data.length === 0) {
        return (
            <div className="p-12 text-center border rounded-lg bg-muted/10 border-dashed">
                <p className="text-muted-foreground">No se encontraron órdenes con los filtros seleccionados.</p>
            </div>
        );
    }

    return (
        <div className="rounded-md border bg-background overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Vendedor</TableHead>
                            <TableHead>Producto</TableHead>
                            <TableHead className="text-right">Cantidad</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="text-right">Estatus</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((row) => (
                            <TableRow key={row.id} className="hover:bg-muted/50">
                                <TableCell className="font-medium">#{row.id}</TableCell>
                                <TableCell>
                                    {format(new Date(row.date), "dd/MM/yyyy")}
                                </TableCell>
                                <TableCell className="font-medium">{row.client}</TableCell>
                                <TableCell className="text-muted-foreground">{row.seller || "-"}</TableCell>
                                <TableCell>{row.product}</TableCell>
                                <TableCell className="text-right">{row.quantity} Tons</TableCell>
                                <TableCell className="text-right font-medium">
                                    ${row.total.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Badge variant="outline" className={cn("font-normal border", statusColorMap[row.status] || "bg-gray-100 text-gray-800")}>
                                        {row.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
