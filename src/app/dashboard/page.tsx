"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/context/language-context"
import { PlusCircle, Truck, AlertTriangle, MapPin, Package, User, FileText, Phone, RefreshCw, FileSignature, CheckCircle, AlertCircle, Building, Plus, History, Lock, Unlock, Printer, DollarSign, Pencil, Users, Briefcase, Wallet } from "lucide-react"
import Link from "next/link"
import {
    MOCK_DRIVERS, MOCK_CHUTOS, MOCK_BATEAS, MOCK_SELLERS, MOCK_CLIENTS
} from "@/lib/mock-data"
import { api } from "@/lib/api"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useSystemSettings } from "@/context/system-settings-context"
import { DualCurrencyInput } from "@/components/finance/DualCurrencyInput"
import { TripDetail } from "@/lib/trip-types"

// Extended type for details
type HistoryEntry = {
    date: string
    action: string
    details: string
    user: string
}



export default function Dashboard() {
    const { t } = useLanguage();
    const { settings, updateSettings } = useSystemSettings();


    // Global State for Orders (to simulate persistence)
    const [orders, setOrders] = useState<TripDetail[]>([]);

    // Load from LocalStorage
    // Load from API
    useEffect(() => {
        const loadOrders = async () => {
            try {
                const saved = await api.get('active_orders');
                if (saved && Array.isArray(saved)) {
                    setOrders(saved);
                }
            } catch (e) {
                console.error("Failed to load orders", e);
            }
        };
        loadOrders();
    }, []);

    const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
    const selectedTrip = orders.find(o => o.id === selectedTripId) || null;

    // Action States
    const [isEditing, setIsEditing] = useState(false);

    // Reguia Form State
    const [reguiaData, setReguiaData] = useState({ clientId: '', address: '', sellerId: '' });

    // Sellers State
    const [availableSellers, setAvailableSellers] = useState<any[]>([]);

    // Clients State
    const [availableClients, setAvailableClients] = useState<any[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const savedSellers = await api.get("sellers_data");
                if (savedSellers && Array.isArray(savedSellers) && savedSellers.length > 0) {
                    setAvailableSellers(savedSellers);
                } else {
                    setAvailableSellers(MOCK_SELLERS);
                }

                const savedClients = await api.get("clients_data");
                if (savedClients && Array.isArray(savedClients) && savedClients.length > 0) {
                    setAvailableClients(savedClients);
                }
            } catch (e) {
                console.error("Error loading auxiliary data", e);
                setAvailableSellers(MOCK_SELLERS);
            }
        };
        loadData();
    }, []);

    const availableStatuses = ["Cargado en sistema", "Cargando", "En Ruta", "En Sitio", "Completado", "Cancelado"];

    // Status Confirmation State
    const [pendingStatus, setPendingStatus] = useState<string>("");
    const [deliveredQuantity, setDeliveredQuantity] = useState<string>("");
    const [quantityUnit, setQuantityUnit] = useState<string>("");

    // Temp Edit State for Details
    const [tempDeliveryDate, setTempDeliveryDate] = useState("");
    const [tempLoadedQuantity, setTempLoadedQuantity] = useState("");

    const handleTripClick = (trip: TripDetail) => {
        setSelectedTripId(trip.id);
        setIsEditing(false); // Default to view only

        // Initialize Reguia data
        const currentClientId = availableClients.find(c => c.name === trip.finalClient || c.name === trip.client)?.id || '';
        const currentAddress = trip.finalAddress || trip.destination || '';
        setReguiaData({
            clientId: currentClientId,
            address: currentAddress,
            sellerId: trip.sellerId || "V-000" // Default to Oficina
        });

        // Initialize Transport Edit Data
        setTransportEditData({
            driverId: MOCK_DRIVERS.find(d => d.name === trip.driver)?.id.toString() || '',
            chutoId: MOCK_CHUTOS.find(c => c.plate === trip.plate)?.id.toString() || '',
            bateaId: '' // Default or try to match if possible
        });

        // Initialize Pending Status
        setPendingStatus(trip.status || "");

        // Initialize Delivered Quantity
        const qtyParts = (trip.quantity || "").split(' ');
        setDeliveredQuantity(qtyParts[0] || "");
        setQuantityUnit(qtyParts.slice(1).join(' ') || '');

        // Initialize Temp Edits
        // Date: Default to Today if missing
        const dateToUse = trip.deliveryDate || new Date().toLocaleDateString('es-VE', { day: '2-digit', month: '2-digit', year: 'numeric' });
        setTempDeliveryDate(dateToUse);

        // Loaded Qty: Default to Ordered Qty if missing
        const loadedVal = trip.loaded_quantity ? trip.loaded_quantity.split(' ')[0] : qtyParts[0];
        setTempLoadedQuantity(loadedVal || "");
    };

    // Sales Order Edit State
    const [isEditingSalesOrder, setIsEditingSalesOrder] = useState(false)
    const [editingSalesOrder, setEditingSalesOrder] = useState("")

    // Transport Edit State
    const [isTransportModalOpen, setIsTransportModalOpen] = useState(false);
    const [transportEditData, setTransportEditData] = useState({
        driverId: '',
        chutoId: '',
        bateaId: ''
    });

    // Client/Seller Edit State
    const [isEditingClient, setIsEditingClient] = useState(false);
    const [editingClientId, setEditingClientId] = useState("");
    const [editingAddress, setEditingAddress] = useState("");

    const [isEditingSeller, setIsEditingSeller] = useState(false);
    const [editingSellerId, setEditingSellerId] = useState("");

    const handleConfirmClientChange = () => {
        const newClient = availableClients.find(c => c.id === editingClientId);
        if (!newClient || !selectedTrip) return;

        // Find selected address object
        let addressUpdates = {};
        if (editingAddress) {
            const addrObj = newClient.addresses.find((a: any) => a.id === editingAddress);
            if (addrObj) {
                addressUpdates = {
                    destination: addrObj.detail,
                    destinationState: addrObj.state,
                    destinationMunicipality: addrObj.municipality,
                    destinationParish: addrObj.parish,
                    destinationDetail: addrObj.detail,
                    finalAddress: addrObj.detail // Also update final address default?
                };
            } else {
                // Fallback if string
                addressUpdates = { destination: editingAddress };
            }
        }

        handleUpdateOrder({
            client: newClient.name,
            rif: newClient.rif,
            ...addressUpdates
        }, `Cambio de Cliente: ${newClient.name}`);

        setIsEditingClient(false);
    };

    const handleConfirmSellerChange = () => {
        const newSeller = availableSellers.find(s => s.id === editingSellerId);
        if (!newSeller || !selectedTrip) return;

        handleUpdateOrder({
            sellerId: newSeller.id,
            sellerName: newSeller.name
        }, `Cambio de Vendedor: ${newSeller.name}`);

        setIsEditingSeller(false);
    };

    const handleConfirmSalesOrderChange = () => {
        if (!selectedTripId) return;

        handleUpdateOrder({
            salesOrderNumber: editingSalesOrder
        }, `Nro. Oferta actualizado a: ${editingSalesOrder}`);

        setIsEditingSalesOrder(false);
    }

    // Filter and Sort State
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [sortOrder, setSortOrder] = useState<string>("newest");

    // Derived Orders
    const filteredOrders = orders
        .filter(order => filterStatus === "all" || order.status === filterStatus)
        .sort((a, b) => {
            // Sort by ID (assuming VIA-XXX format loosely maps to time for this mock)
            // Or sort by plantOrderNumber if preferred. Using ID for stability.
            if (sortOrder === "newest") return b.id.localeCompare(a.id);
            if (sortOrder === "oldest") return a.id.localeCompare(b.id);
            return 0;
        });

    const handleTransportSave = () => {
        const selectedDriver = MOCK_DRIVERS.find(d => d.id.toString() === transportEditData.driverId);
        const selectedChuto = MOCK_CHUTOS.find(c => c.id.toString() === transportEditData.chutoId);
        const selectedBatea = MOCK_BATEAS.find(b => b.id.toString() === transportEditData.bateaId);

        const updates: Partial<TripDetail> = {};
        let details = "Actualización de Transporte:";

        if (selectedDriver) {
            updates.driver = selectedDriver.name;
            updates.driverCedula = selectedDriver.cedula; // Save Cedula
            details += ` Chofer: ${selectedDriver.name}.`;
        }

        if (selectedChuto) {
            updates.truck = `${selectedChuto.brand} ${selectedChuto.model}`;
            updates.plate = selectedChuto.plate;
            details += ` Chuto: ${selectedChuto.plate}.`;
        }

        if (selectedBatea) {
            details += ` Batea: ${selectedBatea.plate}.`;
        }

        handleUpdateOrder(updates, details);
        setIsTransportModalOpen(false);
    };

    const handleUpdateOrder = (updates: Partial<TripDetail>, historyAction?: string) => {
        if (!selectedTripId) return;

        setOrders(prevOrders => {
            const updated = prevOrders.map(order => {
                if (order.id !== selectedTripId) return order;

                const updatedOrder = { ...order, ...updates };

                if (historyAction) {
                    const newHistory: HistoryEntry = {
                        date: new Date().toLocaleString(),
                        action: historyAction,
                        details: 'Actualización realizada por usuario',
                        user: 'Admin'
                    };
                    updatedOrder.history = [newHistory, ...(order.history || [])];
                }

                return updatedOrder;
            });

            api.save("active_orders", updated);
            return updated;
        });
    };

    const handleConfirmStatusChange = () => {
        if (!selectedTrip || pendingStatus === selectedTrip.status) return;

        const updates: Partial<TripDetail> = { status: pendingStatus };
        let historyDetails = `Cambio de Estatus a: ${pendingStatus}`;

        // If completing, update quantity with the delivered quantity
        const finalQuantity = `${deliveredQuantity} ${quantityUnit}`.trim();
        if (pendingStatus === 'Completado' && finalQuantity !== selectedTrip.quantity) {
            updates.quantity = finalQuantity;
            historyDetails += `. Cantidad Final: ${finalQuantity}`;
        }

        handleUpdateOrder(updates, historyDetails);
    };

    const handleReguiaSave = () => {
        const clientObj = availableClients.find(c => c.id === reguiaData.clientId);
        const clientName = clientObj?.name || selectedTrip?.client;

        // Find detailed address info to breakdown State, Muni, Parish
        let extraAddressFields = {};
        if (clientObj && clientObj.addresses) {
            const addrObj = clientObj.addresses.find((a: any) => {
                const detail = typeof a === 'string' ? a : a.detail;
                return detail === reguiaData.address;
            });

            if (addrObj && typeof addrObj === 'object') {
                extraAddressFields = {
                    destinationState: addrObj.state,
                    destinationMunicipality: addrObj.municipality,
                    destinationParish: addrObj.parish,
                    destinationDetail: addrObj.detail
                };
            }
        }

        const originalClient = selectedTrip?.client || "Desconocido";
        const historyDetails = `Reguía: Cliente cambió de ${originalClient} a ${clientName}. Dirección: ${reguiaData.address}`;

        handleUpdateOrder({
            client: clientName,
            finalClient: clientName,
            finalAddress: reguiaData.address,
            sellerId: reguiaData.sellerId,
            sellerName: availableSellers.find(s => s.id === reguiaData.sellerId)?.name || 'Oficina',
            ...extraAddressFields
        }, historyDetails);

        setIsEditing(false);
    };

    // Plant Wallet Logic - Refactored for User Request: "Solo nombre planta y cantidad que nos deben (Completados)"
    const plantWallets = orders.reduce((acc, order) => {
        // Only count COMPLETED orders
        if (order.status !== 'Completado') return acc;

        const plant = order.origin || 'Desconocido';
        if (!acc[plant]) acc[plant] = { quantityOwed: 0, unit: '' };

        // Calculate Debt: Billed (Ordered) - Loaded (Actual)
        // If Billed > Loaded, the plant owes us product (Credit/Debt to us)
        const billed = parseFloat((order.quantity || "0").split(' ')[0]) || 0;
        const loaded = order.loaded_quantity ? (parseFloat(order.loaded_quantity.split(' ')[0]) || 0) : 0;

        // If we paid for (billed) 100 and they loaded 90, they owe us 10.
        // If loaded is 0/undefined but completed, assume full quantity loaded? 
        // User request "cantidad de producto que nos deben". 
        // Logic: Debt = Billed - Loaded.

        // If loaded is 0, it might mean logic wasn't used yet. 
        // Safest is to use the 'Saldo a Favor' logic: only add if positive difference.
        const diff = billed - loaded;

        if (diff > 0) {
            acc[plant].quantityOwed += diff;
            // Capture unit from first order
            if (!acc[plant].unit) {
                acc[plant].unit = (order.quantity || "").split(' ')[1] || 'Ton';
            }
        }

        return acc;
    }, {} as Record<string, { quantityOwed: number, unit: string }>);

    // Rate State
    const [rateInput, setRateInput] = useState(settings.current_exchange_rate?.toString() || "");
    const [isUpdatingRate, setIsUpdatingRate] = useState(false);

    useEffect(() => {
        if (settings.current_exchange_rate) {
            setRateInput(settings.current_exchange_rate.toString());
        }
    }, [settings.current_exchange_rate]);

    const handleUpdateRate = async () => {
        setIsUpdatingRate(true);
        const newRate = parseFloat(rateInput);
        if (newRate > 0) {
            await updateSettings({ ...settings, current_exchange_rate: newRate });
        }
        setIsUpdatingRate(false);
    };


    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">{t.sidebar.dashboard}</h1>
                <div className="flex items-center gap-2">
                    <Link href="/orders/new">
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" /> {t.sidebar.newOrder}
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Financial & KPI Row */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
                {/* Tasa del Día Widget */}
                <Card className="md:col-span-1 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-background border-indigo-100 dark:border-indigo-900">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Tasa del Día (BCV)</CardTitle>
                        <RefreshCw className={`h-4 w-4 text-indigo-500 ${isUpdatingRate ? 'animate-spin' : ''}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-2">
                            <div className="relative w-full">
                                <span className="absolute left-0 top-1 text-indigo-600 font-bold text-lg">Bs.</span>
                                <Input
                                    className="pl-10 text-right font-mono text-3xl font-bold h-10 bg-transparent border-0 border-b rounded-none focus-visible:ring-0 px-0"
                                    value={rateInput}
                                    onChange={(e) => setRateInput(e.target.value)}
                                    onBlur={handleUpdateRate}
                                    onKeyDown={(e) => e.key === 'Enter' && handleUpdateRate()}
                                />
                            </div>
                            <span className="text-xs text-muted-foreground mb-2 whitespace-nowrap">/ USD</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Actualizado automáticamente en pedidos nuevos.
                        </p>
                    </CardContent>
                </Card>

                {/* Plant Wallets Summaries */}
                <Card className="md:col-span-3">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-emerald-600" /> Billeteras de Planta (Estimado)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {Object.entries(plantWallets).map(([plant, data]) => (
                                <div key={plant} className="min-w-[200px] p-3 rounded-lg border bg-card/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Building className="h-3 w-3 text-muted-foreground" />
                                        <span className="text-xs font-semibold truncate max-w-[150px]" title={plant}>{plant}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Cantidad Adeudada</p>
                                        <p className="font-mono font-bold text-lg text-red-600 dark:text-red-400">
                                            {data.quantityOwed.toFixed(2)} <span className="text-xs text-muted-foreground">{data.unit}</span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {Object.keys(plantWallets).length === 0 && (
                                <div className="text-xs text-muted-foreground p-4">Procesando pedidos para calcular saldos...</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 grid-cols-1">
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Resumen de Viajes
                        </CardTitle>
                        <Truck className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4 items-center">
                            <div className="flex flex-col items-center p-2 bg-background rounded-lg border min-w-[100px]">
                                <span className="text-2xl font-bold">{orders.length}</span>
                                <span className="text-xs text-muted-foreground">Total Viajes</span>
                            </div>
                            {availableStatuses.map(status => {
                                const count = orders.filter(o => o.status === status).length;
                                if (count === 0) return null;
                                return (
                                    <div key={status} className="flex flex-col items-center p-2 bg-background rounded-lg border min-w-[100px]">
                                        <span className="text-2xl font-bold">{count}</span>
                                        <span className="text-xs text-muted-foreground">{status}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 grid-cols-1">
                <Card className="col-span-1">
                    <CardHeader>
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div>
                                <CardTitle>{t.dashboard.kpiActive}</CardTitle>
                                <CardDescription>
                                    {t.dashboard.recentDesc}
                                </CardDescription>
                            </div>

                            {/* Filter & Sort Toolbar Removed as per user request "no quiero nigun filtro" */}
                            {/* 
                            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                ...
                            </div> 
                            */}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border hidden md:block">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/50 text-muted-foreground font-medium">
                                    <tr>
                                        <th className="p-4">Pedido (Interno)</th>
                                        <th className="p-4 hidden sm:table-cell">Pedido Planta</th>
                                        <th className="p-4">Cliente</th>
                                        <th className="p-4 hidden lg:table-cell">Planta</th>
                                        <th className="p-4 hidden md:table-cell">Chofer</th>
                                        <th className="p-4 hidden lg:table-cell">Fecha de Entrega</th>
                                        <th className="p-4">Estatus</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="p-8 text-center text-muted-foreground text-sm">
                                                No se encontraron pedidos con los filtros seleccionados.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredOrders.map(trip => (
                                            <tr
                                                key={trip.id}
                                                className="border-t hover:bg-muted/50 transition-colors cursor-pointer group"
                                                onClick={() => handleTripClick(trip)}
                                            >
                                                <td className="p-4 font-medium group-hover:text-primary transition-colors underline decoration-dotted underline-offset-4">{trip.id}</td>
                                                <td className="p-4 font-mono text-muted-foreground hidden sm:table-cell">{trip.plantOrderNumber || "--"}</td>
                                                <td className="p-4 font-semibold">{trip.client}</td>
                                                <td className="p-4 hidden lg:table-cell text-muted-foreground">{trip.origin}</td>
                                                <td className="p-4 hidden md:table-cell">{trip.driver}</td>
                                                <td className="p-4 hidden lg:table-cell text-muted-foreground">
                                                    {trip.deliveryDate || trip.eta}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${trip.status === 'En Ruta' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                                        trip.status === 'Cargando' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                            trip.status === 'Cargado en sistema' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                                                                'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                        }`}>
                                                        {trip.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                        ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="grid gap-4 md:hidden mt-4">
                            {filteredOrders.map(trip => (
                                <Card key={trip.id} className="border shadow-sm" onClick={() => handleTripClick(trip)}>
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <span className="font-bold text-lg">{trip.id}</span>
                                                <p className="text-xs text-muted-foreground">{trip.plantOrderNumber || "--"}</p>
                                            </div>
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${trip.status === 'En Ruta' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                                trip.status === 'Cargando' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                    trip.status === 'Cargado en sistema' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                                                        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                }`}>
                                                {trip.status}
                                            </span>
                                        </div>
                                        <div className="space-y-1 text-sm">
                                            <div><span className="font-semibold">Cliente:</span> {trip.client}</div>
                                            <div><span className="font-semibold">Destino:</span> {trip.destination}</div>
                                            <div><span className="font-semibold">Chofer:</span> {trip.driver}</div>
                                            <div className="text-xs text-muted-foreground pt-2">{trip.deliveryDate || trip.eta}</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {filteredOrders.length === 0 && (
                                <div className="p-8 text-center text-muted-foreground text-sm border rounded-md border-dashed">
                                    No se encontraron pedidos.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Order Details Modal */}
            <Dialog open={!!selectedTrip} onOpenChange={(open) => !open && setSelectedTripId(null)}>
                <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-xl flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                Detalle de Pedido: {selectedTrip?.id}
                            </DialogTitle>
                            <div className="flex items-center gap-2">


                                {/* Reguia Trigger (Only if En Sitio) */}
                                {/* Reguia Trigger (Only if En Sitio or En Ruta) */}
                                {(selectedTrip?.status === 'En Sitio' || selectedTrip?.status === 'En Ruta') && (
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="gap-2"
                                        onClick={() => {
                                            // Scroll to Reguia section or just ensure it's visible
                                            const element = document.getElementById('reguia-section');
                                            if (element) element.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                    >
                                        <AlertTriangle className="h-4 w-4" />
                                        Reguía
                                    </Button>
                                )}
                            </div>
                        </div>
                        <DialogDescription>
                            Gestión y control de despacho.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedTrip && (
                        <div className="grid gap-6 py-4">
                            {/* Status Select */}
                            {/* Status and Date - Positions Swapped */}
                            <div className="bg-muted/30 p-4 rounded-lg flex flex-col md:flex-row items-center justify-between border border-border gap-4">
                                <div className="flex flex-col gap-4 w-full md:w-auto">
                                    <div className="flex items-end gap-2">
                                        <div className="flex items-center gap-4">
                                            <Label className="uppercase text-xs font-bold text-muted-foreground w-24">Fecha Entrega:</Label>
                                            <Input
                                                type="date"
                                                className="w-[140px] h-9 font-mono"
                                                value={tempDeliveryDate ? tempDeliveryDate.split('/').reverse().join('-') : ''}
                                                onChange={(e) => {
                                                    const dateVal = e.target.value; // YYYY-MM-DD
                                                    const formatted = dateVal ? dateVal.split('-').reverse().join('/') : '';
                                                    setTempDeliveryDate(formatted);
                                                }}
                                            />
                                        </div>
                                        {tempDeliveryDate !== (selectedTrip.deliveryDate || "") && (
                                            <Button
                                                size="sm"
                                                className="h-9 px-2 bg-green-600 hover:bg-green-700"
                                                onClick={() => handleUpdateOrder({ deliveryDate: tempDeliveryDate }, `Fecha de Entrega actualizada a: ${tempDeliveryDate}`)}
                                                title="Confirmar Fecha"
                                            >
                                                <CheckCircle className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Label className="uppercase text-xs font-bold text-muted-foreground w-24">Cant. Solicitada:</Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                className="w-[100px] h-9 font-mono bg-muted/50 text-right text-muted-foreground border-transparent"
                                                value={parseFloat(selectedTrip.quantity?.split(' ')[0] || "0")}
                                                readOnly
                                                disabled
                                                type="number"
                                            />
                                            <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded border">
                                                {quantityUnit}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Loaded Quantity (Real Plant Dispatch) */}
                                    <div className="flex items-end gap-2">
                                        <div className="flex items-center gap-4">
                                            <Label className="uppercase text-xs font-bold text-muted-foreground w-24">Cant. Cargada (Real):</Label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    className="w-[100px] h-9 font-mono bg-background text-right"
                                                    value={tempLoadedQuantity}
                                                    onChange={(e) => setTempLoadedQuantity(e.target.value)}
                                                    placeholder="0"
                                                    type="number"
                                                />
                                                <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded border">
                                                    {quantityUnit}
                                                </span>
                                            </div>
                                        </div>
                                        {tempLoadedQuantity !== (selectedTrip.loaded_quantity ? selectedTrip.loaded_quantity.split(' ')[0] : "") && (
                                            <Button
                                                size="sm"
                                                className="h-9 px-2 bg-green-600 hover:bg-green-700"
                                                onClick={() => {
                                                    const newLoaded = tempLoadedQuantity ? `${tempLoadedQuantity} ${quantityUnit}` : undefined;
                                                    handleUpdateOrder({ loaded_quantity: newLoaded }, `Cantidad Cargada Real: ${newLoaded}`);
                                                }}
                                                title="Confirmar Cantidad"
                                            >
                                                <CheckCircle className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>

                                    {/* Saldo a Favor Logic */}
                                    {selectedTrip.loaded_quantity && selectedTrip.quantity && (
                                        (() => {
                                            const billed = parseFloat(selectedTrip.quantity.split(' ')[0]) || 0;
                                            const loaded = parseFloat(selectedTrip.loaded_quantity.split(' ')[0]) || 0;
                                            const diff = billed - loaded;

                                            // Only show if there is a positive difference (Credit)
                                            if (diff > 0) {
                                                const unitCost = selectedTrip.unitPlantCost || ((selectedTrip.plantCost || 0) / billed);
                                                const creditAmount = diff * unitCost;

                                                return (
                                                    <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                                                        <div className="flex justify-between items-center text-xs">
                                                            <span className="font-bold text-green-700 dark:text-green-400 flex items-center gap-1">
                                                                <Wallet className="h-3 w-3" /> Saldo a Favor Planta:
                                                            </span>
                                                            <span className="font-mono font-bold text-green-800 dark:text-green-300">
                                                                ${creditAmount.toFixed(2)}
                                                            </span>
                                                        </div>
                                                        <p className="text-[10px] text-green-600 dark:text-green-500 mt-1">
                                                            {diff.toFixed(2)} {quantityUnit} no cargados (Facturado &gt; Real)
                                                        </p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })()
                                    )}

                                </div>

                                <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                                    <div className="flex items-center gap-2">
                                        <div className="flex flex-col gap-1">
                                            <Label className="uppercase text-[10px] font-bold text-muted-foreground self-end">Estatus Actual</Label>
                                            <Select
                                                value={pendingStatus}
                                                onValueChange={(val) => setPendingStatus(val)}
                                            >
                                                <SelectTrigger className={`w-[180px] font-bold ${pendingStatus === 'En Ruta' ? 'text-blue-600 border-blue-200 bg-blue-50' :
                                                    pendingStatus === 'Completado' ? 'text-green-600 border-green-200 bg-green-50' :
                                                        ''
                                                    }`}>
                                                    <SelectValue placeholder="Estatus" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availableStatuses.map(status => (
                                                        <SelectItem key={status} value={status}>
                                                            {status}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {pendingStatus !== selectedTrip.status && (
                                            <div className="flex flex-col gap-1">
                                                <Label className="uppercase text-[10px] font-bold text-muted-foreground self-end opacity-0">Action</Label>
                                                <Button
                                                    size="icon"
                                                    className="bg-primary hover:bg-primary/90"
                                                    onClick={handleConfirmStatusChange}
                                                    title="Guardar nuevo estatus"
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Delivered Quantity Input (Shows up when Status is Completed) */}
                                    {pendingStatus === 'Completado' && (
                                        <div className="flex items-center gap-2 mt-1 animate-in slide-in-from-top-1 fade-in duration-300">
                                            <Label className="text-xs font-bold text-green-600">Cant. Recibida:</Label>
                                            <Input
                                                className="w-[100px] h-8 font-mono border-green-200 bg-green-50/50"
                                                value={deliveredQuantity}
                                                onChange={(e) => setDeliveredQuantity(e.target.value)}
                                                placeholder="0.00"
                                            />
                                            <span className="text-xs font-bold text-muted-foreground">{quantityUnit}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Order Info Section */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <FileSignature className="h-4 w-4 text-primary" />
                                        </div>
                                        <h3 className="font-semibold text-lg">Información de Guía</h3>
                                    </div>
                                    <Card className="border-l-4 border-l-primary/50 shadow-sm">
                                        <CardContent className="p-4 space-y-3">
                                            {/* Plant Order Number */}
                                            <div className="flex flex-col gap-1">
                                                <Label className="uppercase text-xs font-bold text-muted-foreground">N° Pedido Planta:</Label>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        className="w-[140px] h-9 font-mono font-bold"
                                                        defaultValue={selectedTrip.plantOrderNumber}
                                                        onBlur={(e) => {
                                                            if (e.target.value !== selectedTrip.plantOrderNumber) {
                                                                handleUpdateOrder({ plantOrderNumber: e.target.value }, `N° Pedido Planta cambiado a: ${e.target.value}`);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Sales Order / Contract Number */}
                                            <div className="flex flex-col gap-1 pt-2 border-t border-dashed">
                                                <div className="flex items-center justify-between">
                                                    <Label className="uppercase text-xs font-bold text-muted-foreground">Nro. Oferta / Contrato:</Label>
                                                    {!isEditingSalesOrder && (
                                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => {
                                                            setIsEditingSalesOrder(true);
                                                            setEditingSalesOrder(selectedTrip.salesOrderNumber || "");
                                                        }}>
                                                            <Pencil className="h-3 w-3 text-muted-foreground" />
                                                        </Button>
                                                    )}
                                                </div>

                                                {isEditingSalesOrder ? (
                                                    <div className="flex items-center gap-2">
                                                        <Input
                                                            className="h-8 font-mono bg-background"
                                                            value={editingSalesOrder}
                                                            onChange={(e) => setEditingSalesOrder(e.target.value)}
                                                            placeholder="Nro. Oferta"
                                                        />
                                                        <Button size="sm" className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700" onClick={handleConfirmSalesOrderChange}>
                                                            <CheckCircle className="h-4 w-4" />
                                                        </Button>
                                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setIsEditingSalesOrder(false)}>
                                                            <Plus className="h-4 w-4 rotate-45" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="text-sm font-mono font-medium pl-1">
                                                        {selectedTrip.salesOrderNumber || <span className="text-muted-foreground italic text-xs">Sin asignar</span>}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 pt-2">
                                                <div className="space-y-1">
                                                    <Label className="uppercase text-xs font-bold text-muted-foreground">Cliente:</Label>
                                                    <div className="flex items-center justify-between">
                                                        {isEditingClient ? (
                                                            <div className="flex flex-col gap-2 w-full">
                                                                <Select
                                                                    value={editingClientId}
                                                                    onValueChange={(val) => {
                                                                        setEditingClientId(val);
                                                                        // Reset address when client changes
                                                                        setEditingAddress("");
                                                                    }}
                                                                >
                                                                    <SelectTrigger className="h-8">
                                                                        <SelectValue placeholder="Seleccionar Cliente" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {availableClients.map(c => (
                                                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>

                                                                {/* Address Selector for Client */}
                                                                {editingClientId && (
                                                                    <Select
                                                                        value={editingAddress}
                                                                        onValueChange={setEditingAddress}
                                                                    >
                                                                        <SelectTrigger className="h-8">
                                                                            <SelectValue placeholder="Seleccionar Obra/Dirección" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {availableClients.find(c => c.id === editingClientId)?.addresses.map((addr: any, idx: number) => {
                                                                                const detail = typeof addr === 'string' ? addr : addr.detail;
                                                                                const id = typeof addr === 'string' ? detail : addr.id;
                                                                                return (
                                                                                    <SelectItem key={idx} value={id}>{detail}</SelectItem>
                                                                                )
                                                                            })}
                                                                        </SelectContent>
                                                                    </Select>
                                                                )}

                                                                <div className="flex gap-2 justify-end">
                                                                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setIsEditingClient(false)}>Cancelar</Button>
                                                                    <Button size="sm" className="h-7 text-xs" onClick={handleConfirmClientChange}>Guardar</Button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <p className="font-semibold">{selectedTrip.client}</p>
                                                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => {
                                                                    setIsEditingClient(true);
                                                                    // Pre-select current
                                                                    const currentC = availableClients.find(c => c.name === selectedTrip.client);
                                                                    if (currentC) setEditingClientId(currentC.id);
                                                                }}>
                                                                    <Pencil className="h-3 w-3 text-muted-foreground" />
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">{selectedTrip.rif}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="uppercase text-xs font-bold text-muted-foreground">Planta Origen:</Label>
                                                    <p className="font-semibold">{selectedTrip.origin}</p>
                                                    <p className="text-xs text-muted-foreground">Venezuela</p>
                                                </div>
                                            </div>

                                            <div className="space-y-1 pt-2 border-t border-dashed">
                                                <Label className="uppercase text-xs font-bold text-muted-foreground">Destino:</Label>
                                                <p className="text-sm">{selectedTrip.destination}</p>
                                            </div>

                                            <div className="space-y-1 pt-2 border-t border-dashed">
                                                <Label className="uppercase text-xs font-bold text-muted-foreground">Producto:</Label>
                                                <p className="font-medium">{selectedTrip.product}</p>
                                                <div className="flex justify-between text-xs text-muted-foreground">
                                                    <span>Cant. {selectedTrip.quantity}</span>
                                                    <span>Presentación: Granel</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Transport Info */}
                                    <div className="flex items-center gap-2 mt-4">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                            <Truck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="flex-1 flex justify-between items-center">
                                            <h3 className="font-semibold text-lg">Transporte</h3>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsTransportModalOpen(true)}>
                                                <Pencil className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                        </div>
                                    </div>
                                    <Card className="border-l-4 border-l-blue-500/50 shadow-sm">
                                        <CardContent className="p-4 grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <Label className="uppercase text-xs font-bold text-muted-foreground">Chofer:</Label>
                                                <p className="font-medium text-sm">{selectedTrip.driver}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {selectedTrip.driverPhone ? (
                                                        <a href={`https://wa.me/${selectedTrip.driverPhone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="hover:text-green-600 flex items-center gap-1">
                                                            <Phone className="h-3 w-3" /> {selectedTrip.driverPhone}
                                                        </a>
                                                    ) : "Sin teléfono"}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="uppercase text-xs font-bold text-muted-foreground">Placa Chuto:</Label>
                                                <div className="font-mono bg-muted/50 px-2 py-1 rounded w-fit text-sm">
                                                    {selectedTrip.plate || "N/A"}
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="uppercase text-xs font-bold text-muted-foreground">Transporte:</Label>
                                                <p className="text-sm truncate" title={selectedTrip.truck}>{selectedTrip.truck}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="uppercase text-xs font-bold text-muted-foreground">Cédula:</Label>
                                                <p className="text-sm font-mono">{selectedTrip.driverCedula || "N/A"}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Right Column: Log & Actions */}
                                <div className="space-y-4">
                                    {/* Seller Info Block */}
                                    <div className="bg-card border rounded-lg p-3 shadow-sm">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm font-semibold">Vendedor Asignado</span>
                                            </div>
                                            {!isEditingSeller && (
                                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => {
                                                    setIsEditingSeller(true);
                                                    setEditingSellerId(selectedTrip.sellerId || availableSellers[0]?.id || "");
                                                }}>
                                                    <Pencil className="h-3 w-3 text-muted-foreground" />
                                                </Button>
                                            )}
                                        </div>

                                        {isEditingSeller ? (
                                            <div className="flex items-center gap-2">
                                                <Select
                                                    value={editingSellerId}
                                                    onValueChange={setEditingSellerId}
                                                >
                                                    <SelectTrigger className="h-8 flex-1">
                                                        <SelectValue placeholder="Seleccionar Vendedor" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {availableSellers.map(s => (
                                                            <SelectItem key={s.id} value={s.id}>{s.name} ({s.code})</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <Button size="sm" className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700" onClick={handleConfirmSellerChange}>
                                                    <CheckCircle className="h-4 w-4" />
                                                </Button>
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setIsEditingSeller(false)}>
                                                    <Plus className="h-4 w-4 rotate-45" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-700 dark:text-orange-400 font-bold text-xs">
                                                    {selectedTrip.sellerName ? selectedTrip.sellerName.substring(0, 2).toUpperCase() : "OF"}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{selectedTrip.sellerName || "Oficina / Directo"}</p>
                                                    <p className="text-xs text-muted-foreground">Comisión: Consultar</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Reguía Action */}
                                    {/* Reguía Action */}
                                    {(selectedTrip.status === "En Sitio" || selectedTrip.status === "En Ruta") && (
                                        <Card id="reguia-section" className="border-orange-200 bg-orange-50 dark:bg-orange-900/10">
                                            <CardContent className="p-4">
                                                <h4 className="font-bold text-orange-800 dark:text-orange-400 flex items-center gap-2 mb-2">
                                                    <AlertTriangle className="h-4 w-4" /> Desvío / Reguía
                                                </h4>
                                                <p className="text-xs text-orange-700/80 dark:text-orange-400/80 mb-3">
                                                    Si la carga fue desviada a otro cliente u obra, actualice los datos aquí.
                                                </p>

                                                <div className="space-y-3">
                                                    <div className="space-y-1">
                                                        <Label className="text-xs">Nuevo Cliente</Label>
                                                        <Select
                                                            value={reguiaData.clientId}
                                                            onValueChange={(val) => setReguiaData(prev => ({ ...prev, clientId: val, address: '' }))}
                                                        >
                                                            <SelectTrigger className="bg-background h-8">
                                                                <SelectValue placeholder="Seleccionar Cliente" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {availableClients.map(client => (
                                                                    <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <Label className="text-xs">Nueva Dirección / Obra</Label>
                                                        <Select
                                                            value={reguiaData.address}
                                                            onValueChange={(val) => setReguiaData(prev => ({ ...prev, address: val }))}
                                                            disabled={!reguiaData.clientId}
                                                        >
                                                            <SelectTrigger className="bg-background h-8">
                                                                <SelectValue placeholder="Seleccionar Obra" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {availableClients.find(c => c.id === reguiaData.clientId)?.addresses.map((addr: any, idx: number) => {
                                                                    const detail = typeof addr === 'string' ? addr : addr.detail;
                                                                    return (<SelectItem key={idx} value={detail}>{detail}</SelectItem>)
                                                                })}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <Label className="text-xs">Vendedor (Si aplica cambio)</Label>
                                                        <Select
                                                            value={reguiaData.sellerId}
                                                            onValueChange={(val) => setReguiaData(prev => ({ ...prev, sellerId: val }))}
                                                        >
                                                            <SelectTrigger className="bg-background h-8">
                                                                <SelectValue placeholder="Asignar Vendedor" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {availableSellers.map(seller => (
                                                                    <SelectItem key={seller.id} value={seller.id}>{seller.name}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white" size="sm" onClick={handleReguiaSave}>
                                                        Confirmar Reguía
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    <div className="flex items-center gap-2">
                                        <History className="h-4 w-4 text-muted-foreground" />
                                        <h3 className="font-semibold text-lg">Historial</h3>
                                    </div>
                                    <div className="relative border-l border-border pl-4 space-y-6">
                                        {selectedTrip.history?.map((entry: any, i: number) => (
                                            <div key={i} className="relative">
                                                <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-primary" />
                                                <p className="text-xs text-muted-foreground font-mono">{entry.date}</p>
                                                <p className="font-medium text-sm">{entry.action}</p>
                                                <p className="text-xs text-muted-foreground">{entry.details}</p>
                                                <p className="text-[10px] text-muted-foreground mt-1">Usuario: {entry.user}</p>
                                            </div>
                                        ))}
                                        {!selectedTrip.history?.length && (
                                            <p className="text-sm text-muted-foreground italic">No hay registros de historia.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {selectedTrip && (
                        <div className="flex justify-between items-center bg-muted/50 p-4 -mx-6 -mb-6 mt-6 border-t">
                            <div className="text-xs text-muted-foreground">
                                ID: {selectedTrip.id}
                            </div>
                            <div className="flex gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="gap-2">
                                            <Printer className="h-4 w-4" />
                                            Imprimir Documentos
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => window.open(`/print/order/${selectedTrip.id}?mode=transfer_guide`, '_blank')}>
                                            <FileText className="mr-2 h-4 w-4" /> Guía de Despacho
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => window.open(`/print/order/${selectedTrip.id}?mode=delivery`, '_blank')}>
                                            <FileText className="mr-2 h-4 w-4" /> Nota de Entrega
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => window.open(`/print/order/${selectedTrip.id}?mode=authorization`, '_blank')}>
                                            <FileText className="mr-2 h-4 w-4" /> Orden de Carga
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Button onClick={() => setIsEditing(false)}>Cerrar</Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Transport Edit Modal */}
            <Dialog open={isTransportModalOpen} onOpenChange={setIsTransportModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Transporte</DialogTitle>
                        <DialogDescription>Asignar chofer y unidades al pedido.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Chofer</Label>
                            <Select
                                value={transportEditData.driverId}
                                onValueChange={(val) => setTransportEditData(prev => ({ ...prev, driverId: val }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar Chofer" />
                                </SelectTrigger>
                                <SelectContent>
                                    {MOCK_DRIVERS.map(d => (
                                        <SelectItem key={d.id} value={d.id.toString()}>{d.name} ({d.cedula})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Chuto</Label>
                            <Select
                                value={transportEditData.chutoId}
                                onValueChange={(val) => setTransportEditData(prev => ({ ...prev, chutoId: val }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar Chuto" />
                                </SelectTrigger>
                                <SelectContent>
                                    {MOCK_CHUTOS.map(c => (
                                        <SelectItem key={c.id} value={c.id.toString()}>{c.brand} - {c.plate}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Batea</Label>
                            <Select
                                value={transportEditData.bateaId}
                                onValueChange={(val) => setTransportEditData(prev => ({ ...prev, bateaId: val }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar Batea" />
                                </SelectTrigger>
                                <SelectContent>
                                    {MOCK_BATEAS.map(b => (
                                        <SelectItem key={b.id} value={b.id.toString()}>{b.brand} - {b.plate}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsTransportModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleTransportSave}>Guardar Cambios</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
