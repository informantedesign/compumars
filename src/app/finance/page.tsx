"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DollarSign, TrendingUp, TrendingDown, Wallet, Activity, CreditCard, FileText, CheckCircle, Clock } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

import { api } from "@/lib/api"
import { Payment } from "@/lib/trip-types"

type OrderFinance = {
    id: string
    client: string
    route: string
    date: string
    income: number // Precio Flete
    expense: number // Costo Planta + Chofer + Otros

    profit: number
    status: string
    // Payment Details
    paymentMethod?: string
    paymentReference?: string
    paymentStatus?: string
    paymentComment?: string
    paymentDate?: string
    paymentAmount?: string
    paymentCurrency?: string
    paymentExchangeRate?: number
    payments?: Payment[]
}


export default function FinancePage() {
    const [financials, setFinancials] = useState<OrderFinance[]>([])
    const [loading, setLoading] = useState(true)
    const [exchangeRate, setExchangeRate] = useState<number>(0)

    // Payment Modal State
    const [selectedOrder, setSelectedOrder] = useState<OrderFinance | null>(null);
    const [paymentForm, setPaymentForm] = useState({
        method: '',
        reference: '',
        status: 'Pendiente',
        comment: '',
        date: new Date().toISOString().split('T')[0],
        amount: '',
        currency: 'USD'
    });

    const handleRowClick = (order: OrderFinance) => {
        setSelectedOrder(order);
        setPaymentForm({
            method: order.paymentMethod || '',
            reference: order.paymentReference || '',
            status: order.paymentStatus || 'Pendiente',
            comment: order.paymentComment || '',
            date: order.paymentDate || new Date().toISOString().split('T')[0],
            amount: order.paymentAmount || (order.income ? order.income.toString() : ''),
            currency: order.paymentCurrency || 'USD'
        });
    };

    const handleSavePayment = async () => {
        if (!selectedOrder) return;

        try {
            const savedOrders = await api.get("active_orders");
            if (savedOrders && Array.isArray(savedOrders)) {
                const updatedOrders = savedOrders.map((o: any) => {
                    if (o.id === selectedOrder.id) {
                        return {
                            ...o,
                            paymentMethod: paymentForm.method,
                            paymentReference: paymentForm.reference,
                            paymentStatus: paymentForm.status,
                            paymentComment: paymentForm.comment,
                            paymentDate: paymentForm.date
                        };
                    }
                    return o;
                });

                await api.save("active_orders", updatedOrders);

                // Update local state to reflect changes immediately
                setFinancials(prev => prev.map(f => {
                    if (f.id === selectedOrder.id) {
                        return {
                            ...f,
                            paymentMethod: paymentForm.method,
                            paymentReference: paymentForm.reference,
                            paymentStatus: paymentForm.status,
                            paymentComment: paymentForm.comment,
                            paymentDate: paymentForm.date
                        };
                    }
                    return f;
                }));

                setSelectedOrder(null);
            }
        } catch (e) {
            console.error("Failed to save payment", e);
        }
    };

    const loadFinancials = async () => {
        try {
            const [savedOrders, savedSettings] = await Promise.all([
                api.get("active_orders"),
                api.get("settings_data")
            ]);

            if (savedSettings?.current_exchange_rate) {
                setExchangeRate(savedSettings.current_exchange_rate);
            }

            if (savedOrders) {
                const financeData = savedOrders.map((o: any) => {
                    const income = Number(o.freightPrice) || 0;
                    const expense = (Number(o.plantCost) || 0) + (Number(o.driverPayment) || 0) + (Number(o.otherExpenses) || 0);
                    const isCompleted = o.status === 'Completado';

                    return {
                        id: o.id,
                        client: o.client,
                        route: o.route,
                        date: o.deliveryDate || "Pendiente",
                        income,
                        expense, // Commit expenses continuously
                        profit: income - expense,
                        status: o.status,
                        isCompleted,
                        paymentMethod: o.paymentMethod,
                        paymentReference: o.paymentReference,
                        paymentStatus: o.paymentStatus || 'Pendiente', // Default to Pending
                        paymentComment: o.paymentComment,
                        paymentDate: o.paymentDate,
                        payments: o.payments || []
                    }
                })
                setFinancials(financeData)
            }
        } catch (e) {
            console.error("Error loading finance data", e)
        }
        setLoading(false)
    }

    useEffect(() => {
        // Initial load
        loadFinancials();

        // Poll for updates every 5 seconds (temporary solution for cross-device sync)
        const interval = setInterval(loadFinancials, 5000);
        return () => clearInterval(interval);
    }, [])

    const totalIncome = financials.reduce((acc, curr) => acc + curr.income, 0)
    const totalExpense = financials.reduce((acc, curr) => acc + curr.expense, 0)
    const netProfit = totalIncome - totalExpense
    const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0

    // Helper to format Bs
    const formatBs = (usd: number) => {
        if (!exchangeRate) return null;
        return `Bs. ${(usd * exchangeRate).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    if (loading) return <div>Cargando datos financieros...</div>

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <h1 className="text-3xl font-bold tracking-tight">Finanzas y Rentabilidad</h1>

            {/* KPI CARDS */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-200 dark:border-green-900">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ingresos Totales (Ventas)</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                            ${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        {exchangeRate > 0 && (
                            <div className="text-sm font-medium text-green-600/80 dark:text-green-400/80 mt-0.5">
                                {formatBs(totalIncome)}
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">Facturación proyectada de cargas activas</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-200 dark:border-red-900">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Costos Operativos</CardTitle>
                        <TrendingDown className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-700 dark:text-red-400">
                            ${totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        {exchangeRate > 0 && (
                            <div className="text-sm font-medium text-red-600/80 dark:text-red-400/80 mt-0.5">
                                {formatBs(totalExpense)}
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">Planta + Transporte + Viáticos</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-200 dark:border-blue-900">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Utilidad Neta</CardTitle>
                        <Wallet className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                            ${netProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        {exchangeRate > 0 && (
                            <div className="text-sm font-medium text-blue-600/80 dark:text-blue-400/80 mt-0.5">
                                {formatBs(netProfit)}
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">Ganancia real después de costos</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Margen de Ganancia</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {profitMargin.toFixed(1)}%
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Rentabilidad promedio por viaje</p>
                    </CardContent>
                </Card>
            </div>

            {/* DETAILED TABLE */}
            <Card>
                <CardHeader>
                    <CardTitle>Desglose por Viaje</CardTitle>
                    <CardDescription>Análisis detallado de rentabilidad por cada carga gestionada.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border hidden md:block">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground font-medium">
                                <tr>
                                    <th className="p-4">Pedido</th>
                                    <th className="p-4">Cliente</th>
                                    <th className="p-4 hidden md:table-cell">Ruta</th>
                                    <th className="p-4 text-right">Venta (Ingreso)</th>
                                    <th className="p-4 text-right">Costo Total</th>
                                    <th className="p-4 text-right font-bold">Utilidad</th>
                                    <th className="p-4 text-center">Pago</th>
                                    <th className="p-4 text-center">Margen</th>
                                </tr>
                            </thead>
                            <tbody>
                                {financials.map(item => {
                                    const margin = item.income > 0 ? (item.profit / item.income) * 100 : 0
                                    return (
                                        <tr
                                            key={item.id}
                                            className="border-t hover:bg-muted/50 transition-colors cursor-pointer group"
                                            onClick={() => handleRowClick(item)}
                                        >
                                            <td className="p-4 font-mono font-medium group-hover:text-primary transition-colors underline decoration-dotted underline-offset-4">{item.id}</td>
                                            <td className="p-4">{item.client}</td>
                                            <td className="p-4 hidden md:table-cell text-muted-foreground">{item.route}</td>

                                            <td className="p-4 text-right text-green-600 font-medium">
                                                ${item.income.toLocaleString()}
                                            </td>
                                            <td className="p-4 text-right text-red-500 font-medium">
                                                ${item.expense.toLocaleString()}
                                            </td>

                                            <td className={`p-4 text-right font-bold ${item.profit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                                ${item.profit.toLocaleString()}
                                            </td>

                                            <td className="p-4 text-center">
                                                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border ${item.paymentStatus === 'Pagado' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    item.paymentStatus === 'Parcial' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                        'bg-gray-50 text-gray-600 border-gray-200'
                                                    }`}>
                                                    {item.paymentStatus === 'Pagado' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                    {item.paymentStatus || 'Pendiente'}
                                                </span>
                                            </td>

                                            <td className="p-4 text-center">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${margin > 20 ? 'bg-green-100 text-green-800' :
                                                    margin > 10 ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    {margin.toFixed(1)}%
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                                {financials.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-muted-foreground">
                                            No hay datos financieros disponibles. Registre pedidos con precios y costos.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="grid gap-4 md:hidden">
                        {financials.map(item => {
                            const margin = item.income > 0 ? (item.profit / item.income) * 100 : 0
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => handleRowClick(item)}
                                    className="border rounded-lg p-4 shadow-sm bg-card active:scale-[0.98] transition-transform"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="font-bold font-mono text-lg">{item.id}</span>
                                            <p className="text-xs text-muted-foreground">{item.client}</p>
                                        </div>
                                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border ${item.paymentStatus === 'Pagado' ? 'bg-green-50 text-green-700 border-green-200' :
                                            item.paymentStatus === 'Parcial' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                'bg-gray-50 text-gray-600 border-gray-200'
                                            }`}>
                                            {item.paymentStatus === 'Pagado' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                            {item.paymentStatus || 'Pendiente'}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-y-2 text-sm mt-3 border-t pt-3">
                                        <div>
                                            <span className="text-xs text-muted-foreground block">Venta</span>
                                            <span className="font-medium text-green-600">${item.income.toLocaleString()}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs text-muted-foreground block">Utilidad</span>
                                            <span className={`font-bold ${item.profit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                                ${item.profit.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="col-span-2 mt-1 flex justify-between items-center bg-muted/30 p-2 rounded">
                                            <span className="text-xs text-muted-foreground">Margen:</span>
                                            <span className={`text-xs font-bold ${margin > 20 ? 'text-green-700' : margin > 10 ? 'text-yellow-700' : 'text-red-700'}`}>
                                                {margin.toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        {financials.length === 0 && (
                            <div className="p-8 text-center text-muted-foreground border rounded-md border-dashed">
                                No hay datos financieros.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* PAYMENT DETAILS MODAL */}
            <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Wallet className="h-5 w-5 text-primary" />
                            Registro de Pago: {selectedOrder?.id}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedOrder?.client} - {selectedOrder?.route}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                        {/* PAYMENT HISTORY */}
                        <div className="space-y-2">
                            <h3 className="font-semibold text-sm">Historial de Pagos</h3>
                            {selectedOrder?.payments && selectedOrder.payments.length > 0 ? (
                                <div className="border rounded-md overflow-hidden text-sm">
                                    <table className="w-full text-left">
                                        <thead className="bg-muted">
                                            <tr>
                                                <th className="p-2">Fecha</th>
                                                <th className="p-2">Método</th>
                                                <th className="p-2 text-right">Monto</th>
                                                <th className="p-2 text-right">USD Equiv.</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedOrder.payments.map((p, i) => {
                                                const rate = p.exchangeRate || 0;
                                                const equivUSD = p.currency === 'USD' ? p.amount : (rate > 0 ? p.amount / rate : 0);
                                                return (
                                                    <tr key={i} className="border-t">
                                                        <td className="p-2">{p.date}</td>
                                                        <td className="p-2">
                                                            <div>{p.method}</div>
                                                            <div className="text-xs text-muted-foreground">{p.reference}</div>
                                                        </td>
                                                        <td className="p-2 text-right font-medium">
                                                            {p.currency === 'USD' ? '$' : 'Bs.'} {p.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                        </td>
                                                        <td className="p-2 text-right text-muted-foreground">
                                                            ${equivUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                            <tr className="bg-muted/30 font-bold border-t">
                                                <td className="p-2" colSpan={3}>Total Pagado</td>
                                                <td className="p-2 text-right text-green-600">
                                                    ${selectedOrder.payments.reduce((acc, p) => {
                                                        const rate = p.exchangeRate || 0;
                                                        return acc + (p.currency === 'USD' ? p.amount : (rate > 0 ? p.amount / rate : 0));
                                                    }, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="p-2" colSpan={3}>Saldo Restante</td>
                                                <td className="p-2 text-right text-red-600">
                                                    ${(selectedOrder.income - selectedOrder.payments.reduce((acc, p) => {
                                                        const rate = p.exchangeRate || 0;
                                                        return acc + (p.currency === 'USD' ? p.amount : (rate > 0 ? p.amount / rate : 0));
                                                    }, 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-sm text-muted-foreground italic border p-2 rounded text-center">No hay pagos registrados.</div>
                            )}
                        </div>

                        <div className="border-t my-2"></div>

                        {/* NEW PAYMENT FORM */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-sm">Registrar Nuevo Pago</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Monto del Pago</Label>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={paymentForm.amount}
                                        onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                                    />
                                    {paymentForm.amount && exchangeRate > 0 && (
                                        <div className="text-xs text-muted-foreground font-medium">
                                            {paymentForm.currency === 'USD'
                                                ? `≈ Bs. ${(Number(paymentForm.amount) * exchangeRate).toLocaleString('es-VE', { maximumFractionDigits: 2 })}`
                                                : `≈ $ ${(Number(paymentForm.amount) / exchangeRate).toLocaleString('en-US', { maximumFractionDigits: 2 })}`
                                            }
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label>Moneda</Label>
                                    <Select
                                        value={paymentForm.currency}
                                        onValueChange={(val) => setPaymentForm({ ...paymentForm, currency: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="USD">USD ($)</SelectItem>
                                            <SelectItem value="Bs">Bolívares (Bs)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Fecha de Pago</Label>
                                    <Input
                                        type="date"
                                        value={paymentForm.date}
                                        onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Método de Pago</Label>
                                    <Select
                                        value={paymentForm.method}
                                        onValueChange={(val) => setPaymentForm({ ...paymentForm, method: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar método" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Transferencia">Transferencia Bancaria</SelectItem>
                                            <SelectItem value="Pago Móvil">Pago Móvil</SelectItem>
                                            <SelectItem value="Zelle">Zelle / Divisas Digitales</SelectItem>
                                            <SelectItem value="Efectivo">Efectivo / Divisas</SelectItem>
                                            <SelectItem value="Cheque">Cheque</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Referencia / Comprobante</Label>
                                <Input
                                    placeholder="Ej: 12345678"
                                    value={paymentForm.reference}
                                    onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Comentarios / Detalles</Label>
                                <Textarea
                                    placeholder="Notas adicionales sobre el pago..."
                                    value={paymentForm.comment}
                                    onChange={(e) => setPaymentForm({ ...paymentForm, comment: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="bg-muted/50 p-3 rounded-md text-sm grid grid-cols-2 gap-2 mt-2">
                            <div>
                                <span className="text-muted-foreground">Monto Facturado:</span>
                                <div className="font-bold text-green-600">${selectedOrder?.income.toLocaleString()}</div>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Utilidad Estimada:</span>
                                <div className={`font-bold ${selectedOrder && selectedOrder.profit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                    ${selectedOrder?.profit.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedOrder(null)}>Cancelar</Button>
                        <Button onClick={handleSavePayment}>Guardar Registro</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
