"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDateRangePicker } from "@/components/date-range-picker"
import { FileText, Download, Printer, DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import { addDays, format } from "date-fns"
import { es } from "date-fns/locale"

// Mock Data for Reports
const MOCK_SALES_DATA = [
    { id: "PED-9812", date: "2024-02-12", client: "Constructora Sambil", plant: "Planta San Sebastian", product: "CEMENTO GRIS", quantity: "30 Ton", total: 3600, status: "Completado" },
    { id: "PED-9815", date: "2024-02-11", client: "Ferretería EPA", plant: "Planta Pertigalete", product: "CEMENTO BLANCO", quantity: "600 Sacos", total: 4200, status: "En Ruta" },
    { id: "PED-9818", date: "2024-02-10", client: "Inversiones Los Andes", plant: "Planta San Sebastian", product: "YESO", quantity: "15 Ton", total: 1800, status: "Completado" },
]

const MOCK_COSTS_DATA = [
    { id: "OP-201", date: "2024-02-12", type: "Flete", description: "Pago Chofer PED-9812", amount: 450, status: "Pagado" },
    { id: "OP-202", date: "2024-02-12", type: "Planta", description: "Pago Planta PED-9812", amount: 2800, status: "Pendiente" },
    { id: "OP-203", date: "2024-02-11", type: "Comisión", description: "Comisión Vendedor PED-9815", amount: 120, status: "Pagado" },
]

export default function ReportsPage() {
    const [dateRange, setDateRange] = useState({
        from: addDays(new Date(), -30),
        to: new Date(),
    })

    // Tab State
    const [activeTab, setActiveTab] = useState("sales")

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reportes y Análisis</h1>
                    <p className="text-muted-foreground">Generación de informes de gestión, ventas y costos operativos.</p>
                </div>
                <div className="flex items-center gap-2">
                    <CalendarDateRangePicker date={dateRange} setDate={setDateRange} />
                    <Button variant="outline" size="icon">
                        <Printer className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$9,600.00</div>
                        <p className="text-xs text-muted-foreground">+20.1% vs mes anterior</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Costos Operativos</CardTitle>
                        <TrendingDown className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$6,450.00</div>
                        <p className="text-xs text-muted-foreground">+10.5% vs mes anterior</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Margen Neto</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">$3,150.00</div>
                        <p className="text-xs text-muted-foreground">32.8% de Rentabilidad</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Viajes Completados</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">124</div>
                        <p className="text-xs text-muted-foreground">+12 vs mes anterior</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="sales" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="sales">Reporte de Ventas</TabsTrigger>
                    <TabsTrigger value="costs">Reporte de Costos</TabsTrigger>
                    <TabsTrigger value="kpi">Indicadores (KPIs)</TabsTrigger>
                </TabsList>

                <TabsContent value="sales" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalle de Ventas</CardTitle>
                            <CardDescription>
                                Transacciones de venta realizadas entre {dateRange.from ? format(dateRange.from, "PP", { locale: es }) : "Inicio"} y {dateRange.to ? format(dateRange.to, "PP", { locale: es }) : "Fin"}.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted text-muted-foreground font-medium">
                                        <tr>
                                            <th className="p-3">Pedido</th>
                                            <th className="p-3">Fecha</th>
                                            <th className="p-3">Cliente</th>
                                            <th className="p-3">Producto</th>
                                            <th className="p-3">Cantidad</th>
                                            <th className="p-3 text-right">Total ($)</th>
                                            <th className="p-3">Estatus</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {MOCK_SALES_DATA.map((row) => (
                                            <tr key={row.id} className="border-t hover:bg-muted/50">
                                                <td className="p-3 font-medium">{row.id}</td>
                                                <td className="p-3 text-muted-foreground">{row.date}</td>
                                                <td className="p-3">{row.client}</td>
                                                <td className="p-3">{row.product}</td>
                                                <td className="p-3">{row.quantity}</td>
                                                <td className="p-3 text-right font-bold">${row.total.toFixed(2)}</td>
                                                <td className="p-3">
                                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${row.status === 'Completado' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                                        }`}>
                                                        {row.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="costs" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalle de Costos y Gastos</CardTitle>
                            <CardDescription>
                                Egresos operativos registrados en el periodo seleccionado.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted text-muted-foreground font-medium">
                                        <tr>
                                            <th className="p-3">ID Operación</th>
                                            <th className="p-3">Fecha</th>
                                            <th className="p-3">Tipo</th>
                                            <th className="p-3">Descripción</th>
                                            <th className="p-3 text-right">Monto ($)</th>
                                            <th className="p-3">Estatus Pago</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {MOCK_COSTS_DATA.map((row) => (
                                            <tr key={row.id} className="border-t hover:bg-muted/50">
                                                <td className="p-3 font-medium">{row.id}</td>
                                                <td className="p-3 text-muted-foreground">{row.date}</td>
                                                <td className="p-3">{row.type}</td>
                                                <td className="p-3">{row.description}</td>
                                                <td className="p-3 text-right font-bold text-red-600">-${row.amount.toFixed(2)}</td>
                                                <td className="p-3">
                                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${row.status === 'Pagado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {row.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
