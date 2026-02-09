"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/context/language-context"
import { PlusCircle, Truck, AlertTriangle, MapPin, Package, User, FileText, Phone, RefreshCw, FileSignature, CheckCircle, AlertCircle, Building, Plus, History, Lock, Unlock, Printer, DollarSign, Pencil, Users, Briefcase } from "lucide-react"
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

// Extended type for details
type HistoryEntry = {
    date: string
    action: string
    details: string
    user: string
}

type TripDetail = {
    id: string
    plantOrderNumber: string // New Field
    client: string
    rif: string
    route: string
    origin: string
    destination: string
    driver: string
    driverCedula?: string
    driverPhone: string
    truck: string
    plate: string
    status: string
    eta: string
    deliveryDate: string // New Field
    product: string
    quantity: string
    contact: string
    phone: string
    // Final details (Reguía)
    finalClient?: string
    finalAddress?: string
    history: HistoryEntry[]
    // Financials
    freightPrice?: number // Venta (Ingreso)
    plantCost?: number    // Compra (Costo)
    driverPayment?: number // Pago Chofer (Gasto)
    otherExpenses?: number // Peajes/Otros (Gasto)
    // Seller Info
    sellerId?: string
    sellerName?: string
}

export default function Dashboard() {
    const { t } = useLanguage();

    // Global State for Orders (to simulate persistence)
    const [orders, setOrders] = useState<TripDetail[]>([
        {
            id: "VIA-001",
            plantOrderNumber: "PL-40921",
            client: "Constructora Sambil",
            rif: "J-3049293-1",
            route: "Pertigalete -> Caracas",
            origin: "Planta Pertigalete",
            destination: "Obras Sambil La Candelaria, Caracas",
            driver: "Pedro Perez",
            driverPhone: "0414-1112233",
            truck: "Mack Granite",
            plate: "A21-BC2",
            status: "En Ruta",
            eta: "2h 30m",
            deliveryDate: "08/10/2025",
            product: "Cemento Granel Tipo I",
            quantity: "30 Toneladas",
            contact: "Ing. Roberto",
            phone: "0414-1234567",
            history: [],
            freightPrice: 1200.00,
            plantCost: 450.00,
            driverPayment: 300.00,
            otherExpenses: 50.00
        },
        {
            id: "VIA-002",
            plantOrderNumber: "PL-88210",
            client: "Viviendas Venezuela",
            rif: "J-4099221-0",
            route: "Pertigalete -> Valencia",
            origin: "Planta Pertigalete",
            destination: "Urb. Los Guayos, Valencia",
            driver: "Juan Rodriguez",
            driverPhone: "0412-2223344",
            truck: "Iveco Trakker",
            plate: "X99-ZZ1",
            status: "Cargando",
            eta: "N/A",
            deliveryDate: "09/10/2025",
            product: "Cemento Saco (42.5kg)",
            quantity: "600 Sacos",
            contact: "Lic. Maria",
            phone: "0412-9876543",
            history: [],
            freightPrice: 950.00,
            plantCost: 400.00,
            driverPayment: 250.00,
            otherExpenses: 20.00
        },
        {
            id: "VIA-003",
            plantOrderNumber: "PL-11029",
            client: "Inversiones El Lago",
            rif: "J-9922112-3",
            route: "Pertigalete -> Maracaibo",
            origin: "Planta Pertigalete",
            destination: "Dist. Industrial, Maracaibo",
            driver: "Carlos Mendez",
            driverPhone: "0424-3334455",
            truck: "Mack Granite",
            plate: "B11-AA3",
            status: "En Sitio",
            eta: "Esperando Descarga",
            deliveryDate: "07/10/2025",
            product: "Cemento Granel Tipo I",
            quantity: "28 Toneladas",
            contact: "Sr. Jose",
            phone: "0424-5550000",
            history: [],
            freightPrice: 1400.00,
            plantCost: 500.00,
            driverPayment: 350.00,
            otherExpenses: 100.00
        }
    ]);

    // Load from LocalStorage
    // Load from API
    useEffect(() => {
        const loadOrders = async () => {
            try {
                const saved = await api.get('active_orders');
                if (saved && Array.isArray(saved) && saved.length > 0) {
                    setOrders(prev => {
                        const orderMap = new Map(prev.map(o => [o.id, o]));
                        saved.forEach((o: TripDetail) => orderMap.set(o.id, o));
                        return Array.from(orderMap.values());
                    });
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
    const [availableClients, setAvailableClients] = useState<any[]>(MOCK_CLIENTS);

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

    // Mock Clients List (AvailableClients initialized with MOCK_CLIENTS in state above)
    // Removed the hardcoded array that was here before


    const availableStatuses = ["Cargando", "En Ruta", "En Sitio", "Completado", "Cancelado"];

    const handleTripClick = (trip: TripDetail) => {
        setSelectedTripId(trip.id);
        setIsEditing(false); // Default to view only

        // Initialize Reguia data
        const currentClientId = availableClients.find(c => c.name === trip.finalClient || c.name === trip.client)?.id || '';
        const currentAddress = trip.finalAddress || trip.destination;
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
        setPendingStatus(trip.status);

        // Initialize Delivered Quantity
        const qtyParts = trip.quantity.split(' ');
        setDeliveredQuantity(qtyParts[0]);
        setQuantityUnit(qtyParts.slice(1).join(' ') || '');
    };

    // Status Confirmation State
    const [pendingStatus, setPendingStatus] = useState<string>("");
    const [deliveredQuantity, setDeliveredQuantity] = useState<string>("");
    const [quantityUnit, setQuantityUnit] = useState<string>("");

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

        // Find RIF if possible, otherwise mock or keep existing if same
        // For MOCK_CLIENTS we only have id/name in the local var here, but in real app we have full object.
        // Let's assume we update name. RIF update would require finding it from a master list.
        // In the local availableClients array above, we only have ID and Name.
        // We'll update Client Name. RIF might become stale if we don't look it up.
        // Let's rely on MOCK_CLIENTS from lib/mock-data if available in scope, otherwise just update Name.

        handleUpdateOrder({
            client: newClient.name,
            // rif: newClient.rif // We don't have RIF in the local array. 
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
            // In a real app we'd update phone too presumably, but it's not in the mock-data explicitly for all
            // updates.driverPhone = ... 
            details += ` Chofer: ${selectedDriver.name}.`;
        }

        if (selectedChuto) {
            updates.truck = `${selectedChuto.brand} ${selectedChuto.model}`;
            updates.plate = selectedChuto.plate;
            details += ` Chuto: ${selectedChuto.plate}.`;
        }

        // We don't verify Batea in TripDetail type explicitly other than maybe "truck" combo, 
        // but let's assume we just log it for now or update if we add a batea field later.
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
                    updatedOrder.history = [newHistory, ...order.history];
                }

                return updatedOrder;
            });

            // Persist to LocalStorage
            // Persist to API
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
        const clientName = availableClients.find(c => c.id === reguiaData.clientId)?.name || selectedTrip?.client;

        handleUpdateOrder({
            finalClient: clientName,
            finalAddress: reguiaData.address,
            sellerId: reguiaData.sellerId,
            sellerName: availableSellers.find(s => s.id === reguiaData.sellerId)?.name || 'Oficina'
        }, `Reguía: ${clientName} - ${reguiaData.address}`);

        setIsEditing(false);
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

            <div className="grid gap-4 grid-cols-1">
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {t.dashboard.kpiActive}
                        </CardTitle>
                        <Truck className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{orders.filter(o => o.status === 'En Ruta').length}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {t.dashboard.trucksArriving}
                        </p>
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

                            {/* Filter & Sort Toolbar */}
                            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-muted-foreground uppercase">Estatus:</span>
                                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                                        <SelectTrigger className="w-[140px] h-8 text-xs">
                                            <SelectValue placeholder="Todos" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos</SelectItem>
                                            {availableStatuses.map(st => (
                                                <SelectItem key={st} value={st}>{st}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-muted-foreground uppercase">Orden:</span>
                                    <Select value={sortOrder} onValueChange={setSortOrder}>
                                        <SelectTrigger className="w-[140px] h-8 text-xs">
                                            <SelectValue placeholder="Ordenar por" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="newest">Más Recientes</SelectItem>
                                            <SelectItem value="oldest">Más Antiguos</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
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
                                    <div className="flex items-center gap-4">
                                        <Label className="uppercase text-xs font-bold text-muted-foreground w-24">Fecha Entrega:</Label>
                                        <Input
                                            type="date"
                                            className="w-[180px] h-9 font-mono"
                                            value={selectedTrip.deliveryDate ? selectedTrip.deliveryDate.split('/').reverse().join('-') : ''}
                                            onChange={(e) => {
                                                const dateVal = e.target.value; // YYYY-MM-DD
                                                const formatted = dateVal ? dateVal.split('-').reverse().join('/') : '';
                                                handleUpdateOrder({ deliveryDate: formatted }, `Fecha de Entrega actualizada a: ${formatted}`);
                                            }}
                                        />
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Label className="uppercase text-xs font-bold text-muted-foreground w-24">Cant. Entregada:</Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                className="w-[100px] h-9 font-mono bg-background text-right"
                                                value={deliveredQuantity}
                                                onChange={(e) => setDeliveredQuantity(e.target.value)}
                                                placeholder="0"
                                                type="number"
                                            />
                                            <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded border">
                                                {quantityUnit}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                                    <div className="flex items-center gap-4">
                                        <Label className="uppercase text-xs font-bold text-muted-foreground w-24">Estatus Carga:</Label>
                                        <Select
                                            value={pendingStatus}
                                            onValueChange={setPendingStatus}
                                        >
                                            <SelectTrigger className="w-[180px] h-9 font-bold">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableStatuses.map(st => (
                                                    <SelectItem key={st} value={st}>
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-2 h-2 rounded-full ${st === 'En Ruta' ? 'bg-blue-500' :
                                                                st === 'En Sitio' ? 'bg-indigo-500' :
                                                                    st === 'Cargando' ? 'bg-yellow-500' :
                                                                        st === 'Completado' ? 'bg-green-600' :
                                                                            st === 'Cancelado' ? 'bg-red-600' :
                                                                                'bg-gray-500'
                                                                }`} />
                                                            {st}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {selectedTrip.status !== pendingStatus && (
                                        <Button
                                            size="sm"
                                            onClick={handleConfirmStatusChange}
                                            className="w-full bg-orange-600 hover:bg-orange-700 text-white animate-in ease-in-out zoom-in-50 duration-300"
                                        >
                                            <AlertTriangle className="mr-2 h-3 w-3" />
                                            Confirmar Cambio
                                        </Button>
                                    )}
                                </div>
                            </div>
                            {/* IMMUTABLE ORIGINAL DETAILS & SELLER */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Client (Editable) */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                            <User className="h-4 w-4" /> Cliente
                                        </h4>
                                        {!isEditingClient && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() => {
                                                    // Initialize with current match or generic
                                                    const match = availableClients.find(c => c.name === selectedTrip.client);
                                                    setEditingClientId(match ? match.id : "");
                                                    setIsEditingClient(true);
                                                }}
                                            >
                                                <Pencil className="h-3 w-3" />
                                            </Button>
                                        )}
                                    </div>

                                    {isEditingClient ? (
                                        <div className="space-y-2 bg-muted/20 border rounded-md p-3">
                                            {/* Client Selector */}
                                            <Select
                                                value={editingClientId}
                                                onValueChange={(val) => {
                                                    setEditingClientId(val);
                                                    // Reset address when client changes
                                                    setEditingAddress("");
                                                }}
                                            >
                                                <SelectTrigger className="h-8">
                                                    <SelectValue placeholder="Seleccione Cliente" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availableClients.map(c => (
                                                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            {/* Address Selector (New) */}
                                            {editingClientId && (
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Dirección / Obra</label>
                                                    <Select
                                                        value={editingAddress}
                                                        onValueChange={setEditingAddress}
                                                    >
                                                        <SelectTrigger className="h-8 text-xs">
                                                            <SelectValue placeholder="Seleccione Dirección" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {(() => {
                                                                const client = availableClients.find(c => c.id === editingClientId);
                                                                const addresses = client?.addresses || [];

                                                                if (addresses.length === 0) return <SelectItem value="default" disabled>Sin direcciones registradas</SelectItem>;

                                                                return addresses.map((addr: any, idx: number) => {
                                                                    // Handle both string addresses and object addresses
                                                                    const addrValue = typeof addr === 'string' ? addr : addr.detail || JSON.stringify(addr);
                                                                    const addrLabel = typeof addr === 'string' ? addr : `${addr.municipality || ''} - ${addr.detail || ''}`;
                                                                    const key = typeof addr === 'string' ? addr : addr.id || `addr-${idx}`;

                                                                    return <SelectItem key={key} value={addrValue}>{addrLabel}</SelectItem>;
                                                                });
                                                            })()}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            )}

                                            <div className="flex gap-2 pt-1">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="w-full h-7 text-xs"
                                                    onClick={() => setIsEditingClient(false)}
                                                >
                                                    Cancelar
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="w-full h-7 text-xs bg-orange-600 hover:bg-orange-700 text-white"
                                                    onClick={handleConfirmClientChange}
                                                    disabled={!editingClientId}
                                                >
                                                    Confirmar
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-muted/20 border rounded-md p-3 text-sm space-y-1 h-full select-none">
                                            <p className="font-bold opacity-80">{selectedTrip.client}</p>
                                            <p className="text-muted-foreground font-mono text-xs">{selectedTrip.rif}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Seller (Editable) - Replaces Original Destination slot for better UX */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                            <Briefcase className="h-4 w-4" /> Vendedor
                                        </h4>
                                        {!isEditingSeller && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() => {
                                                    setEditingSellerId(selectedTrip.sellerId || "V-000");
                                                    setIsEditingSeller(true);
                                                }}
                                            >
                                                <Pencil className="h-3 w-3" />
                                            </Button>
                                        )}
                                    </div>

                                    {isEditingSeller ? (
                                        <div className="space-y-2 bg-muted/20 border rounded-md p-3">
                                            <Select
                                                value={editingSellerId}
                                                onValueChange={setEditingSellerId}
                                            >
                                                <SelectTrigger className="h-8">
                                                    <SelectValue placeholder="Seleccione Vendedor" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availableSellers.map(s => (
                                                        <SelectItem key={s.id} value={s.id}>
                                                            {s.name} ({s.commission}%)
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="w-full h-7 text-xs"
                                                    onClick={() => setIsEditingSeller(false)}
                                                >
                                                    Cancelar
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="w-full h-7 text-xs bg-orange-600 hover:bg-orange-700 text-white"
                                                    onClick={handleConfirmSellerChange}
                                                    disabled={!editingSellerId}
                                                >
                                                    Confirmar
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-muted/20 border rounded-md p-3 text-sm space-y-1 h-full select-none">
                                            <p className="font-bold opacity-80">{selectedTrip.sellerName || "Oficina"}</p>
                                            <p className="text-muted-foreground text-xs">Comisión:
                                                {availableSellers.find(s => s.id === (selectedTrip.sellerId || "V-000"))?.commission || 0}%
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Transport (Read-onlyish) */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Truck className="h-4 w-4" /> Transporte
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 ml-auto"
                                        onClick={() => setIsTransportModalOpen(true)}
                                        title="Editar Transporte"
                                    >
                                        <Pencil className="h-3 w-3" />
                                    </Button>
                                </h4>
                                <div className="bg-card border rounded-md p-3 text-sm space-y-1 h-full">
                                    <div className="flex justify-between items-start">
                                        <p className="font-bold">{selectedTrip.driver}</p>
                                        <a href={`tel:${selectedTrip.driverPhone}`} className="text-primary hover:underline flex items-center gap-1 text-xs bg-primary/10 px-2 py-0.5 rounded-full">
                                            <Phone className="h-3 w-3" /> {selectedTrip.driverPhone}
                                        </a>
                                    </div>
                                    <p className="text-muted-foreground text-xs">{selectedTrip.truck}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="bg-muted px-2 py-0.5 rounded text-xs font-mono border">
                                            {selectedTrip.plate}
                                        </span>
                                    </div>
                                </div>
                            </div>


                            {/* FINANCIAL DATA SECTION */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <DollarSign className="h-4 w-4" /> Datos Financieros
                                </h4>
                                <div className="bg-card border rounded-md p-4 grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-muted-foreground">PRECIO FLETE (VENTA)</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                            <Input
                                                type="number"
                                                className={`pl-6 font-mono font-bold ${!isEditing && 'bg-muted/50 border-transparent'}`}
                                                placeholder="0.00"
                                                value={selectedTrip.freightPrice ?? ''}
                                                readOnly={!isEditing}
                                                onChange={(e) => handleUpdateOrder({ freightPrice: parseFloat(e.target.value) })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-muted-foreground">COSTO PLANTA</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                            <Input
                                                type="number"
                                                className={`pl-6 font-mono ${!isEditing && 'bg-muted/50 border-transparent'}`}
                                                placeholder="0.00"
                                                value={selectedTrip.plantCost ?? ''}
                                                readOnly={!isEditing}
                                                onChange={(e) => handleUpdateOrder({ plantCost: parseFloat(e.target.value) })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-muted-foreground">PAGO CHOFER</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                            <Input
                                                type="number"
                                                className={`pl-6 font-mono ${!isEditing && 'bg-muted/50 border-transparent'}`}
                                                placeholder="0.00"
                                                value={selectedTrip.driverPayment ?? ''}
                                                readOnly={!isEditing}
                                                onChange={(e) => handleUpdateOrder({ driverPayment: parseFloat(e.target.value) })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-muted-foreground">OTROS GASTOS</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                            <Input
                                                type="number"
                                                className={`pl-6 font-mono ${!isEditing && 'bg-muted/50 border-transparent'}`}
                                                placeholder="0.00"
                                                value={selectedTrip.otherExpenses ?? ''}
                                                readOnly={!isEditing}
                                                onChange={(e) => handleUpdateOrder({ otherExpenses: parseFloat(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ROUTE & DESTINATION */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <MapPin className="h-4 w-4" /> Ruta y Destino
                                </h4>
                                <div className="bg-card border rounded-md p-4 text-sm grid gap-4">
                                    {/* Original Info */}
                                    <div className="grid grid-cols-[20px_1fr] gap-2 items-start opacity-75">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Punto de Salida / Origen</p>
                                            <p className="font-medium">{selectedTrip.origin}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-[20px_1fr] gap-2 items-start opacity-75">
                                        <div className="w-2 h-2 rounded-full bg-gray-400 mt-1.5" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Dirección Cliente Original</p>
                                            <p className="font-medium text-muted-foreground">{selectedTrip.destination}</p>
                                        </div>
                                    </div>

                                    <div className="my-2 border-t border-dashed" />

                                    {/* FINAL DESTINATION (Conditional Edit) */}
                                    <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                                        <div className={`w-2 h-2 rounded-full mt-2.5 transition-colors ${isEditing ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`} />
                                        <div className="space-y-4 w-full">
                                            <div>
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="text-xs font-bold text-green-600 dark:text-green-400">CLIENTE FINAL / RECEPTOR</p>
                                                    {isEditing && <span className="text-[10px] text-orange-500 font-bold uppercase animate-pulse">Modo Edición Activo</span>}
                                                </div>
                                                <div className="flex gap-2">
                                                    {isEditing ? (
                                                        <Select
                                                            value={reguiaData.clientId}
                                                            onValueChange={(val) => {
                                                                const client = availableClients.find(c => c.id === val);
                                                                let newAddress = "";
                                                                if (client && client.addresses && client.addresses.length > 0) {
                                                                    const addr = client.addresses[0];
                                                                    newAddress = typeof addr === 'string' ? addr : (addr.detail || JSON.stringify(addr));
                                                                }
                                                                setReguiaData({ ...reguiaData, clientId: val, address: newAddress });
                                                            }}
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Seleccionar Cliente" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {availableClients.map(client => (
                                                                    <SelectItem key={client.id} value={client.id}>
                                                                        {client.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    ) : (
                                                        <div className="w-full min-h-[36px] px-3 py-2 text-sm bg-muted/50 border border-transparent rounded-md flex items-center font-medium">
                                                            {selectedTrip.finalClient || selectedTrip.client || "Sin Cliente Asignado"}
                                                        </div>
                                                    )}

                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="outline" size="icon" title="Opciones de Impresión" className="text-blue-600 hover:text-blue-700">
                                                                <FileText className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/print/order/${selectedTrip.id}?mode=combined`} target="_blank" className="cursor-pointer">
                                                                    Imprimir Todo (Autorización + Nota)
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/print/order/${selectedTrip.id}?mode=authorization`} target="_blank" className="cursor-pointer">
                                                                    Solo Autorización de Carga
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/print/order/${selectedTrip.id}?mode=delivery`} target="_blank" className="cursor-pointer">
                                                                    Solo Nota de Entrega
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/print/order/${selectedTrip.id}?mode=transfer_guide`} target="_blank" className="cursor-pointer font-bold text-green-700">
                                                                    Guía de Traslado (Ministerio)
                                                                </Link>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-xs font-bold text-green-600 dark:text-green-400 mb-1">DIRECCIÓN DE ENTREGA FINAL</p>
                                                <Input
                                                    value={reguiaData.address}
                                                    onChange={(e) => setReguiaData({ ...reguiaData, address: e.target.value })}
                                                    placeholder="Dirección exacta de descarga..."
                                                    className={`bg-background ${!isEditing && 'bg-muted/50 text-muted-foreground border-transparent'}`}
                                                    readOnly={!isEditing}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SELLER & DETAILS */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Users className="h-4 w-4" /> Vendedor Asignado
                                </h4>
                                <div className="bg-card border rounded-md p-3">
                                    {isEditing ? (
                                        <div className="space-y-2">
                                            <Select
                                                value={reguiaData.sellerId}
                                                onValueChange={(val) => setReguiaData({ ...reguiaData, sellerId: val })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccionar Vendedor" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availableSellers.map(seller => (
                                                        <SelectItem key={seller.id} value={seller.id}>
                                                            {seller.name} ({seller.commission}%)
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <p className="text-xs text-muted-foreground">
                                                Comisión: {availableSellers.find(s => s.id === reguiaData.sellerId)?.commission || 0}%
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold flex items-center gap-2">
                                                <Briefcase className="h-4 w-4 text-primary" />
                                                {availableSellers.find(s => s.id === (selectedTrip.sellerId || "V-000"))?.name || "Oficina"}
                                            </span>
                                            <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded border border-green-200 dark:border-green-800">
                                                Comisión: {availableSellers.find(s => s.id === (selectedTrip.sellerId || "V-000"))?.commission || 0}%
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* HISTORY LOG */}
                            {selectedTrip.history.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <History className="h-4 w-4" /> Historial de Cambios
                                    </h4>
                                    <div className="bg-muted/20 border rounded-md divide-y">
                                        {selectedTrip.history.map((entry, idx) => (
                                            <div key={idx} className="p-3 text-xs grid grid-cols-[auto_1fr] gap-3">
                                                <div className="text-muted-foreground font-mono">{entry.date}</div>
                                                <div>
                                                    <p className="font-bold text-primary">{entry.action}</p>
                                                    <p className="text-muted-foreground">{entry.details}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-2 justify-between items-center w-full bg-muted/10 -mx-6 -mb-6 p-6 mt-4 border-t">
                        {selectedTrip && (
                            <>
                                <div className="order-2 sm:order-1 mr-auto">
                                    <Link href="/clients">
                                        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-primary">
                                            <Plus className="w-3 h-3 mr-1" /> Nuevo Cliente
                                        </Button>
                                    </Link>
                                </div>

                                <div className="order-1 sm:order-2 flex gap-2 w-full sm:w-auto">
                                    {!isEditing ? (
                                        <Button variant="outline" onClick={() => setIsEditing(true)}>
                                            <Unlock className="mr-2 h-4 w-4" />
                                            Reguía / Editar
                                        </Button>
                                    ) : (
                                        <>
                                            <Button variant="ghost" onClick={() => setIsEditing(false)}>
                                                Cancelar
                                            </Button>
                                            <Button onClick={handleReguiaSave} className="bg-orange-600 hover:bg-orange-700 text-white">
                                                <FileSignature className="mr-2 h-4 w-4" />
                                                Guardar Cambios
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Transport Edit Modal */}
            <Dialog open={isTransportModalOpen} onOpenChange={setIsTransportModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Editar Datos de Transporte</DialogTitle>
                        <DialogDescription>
                            Modifique el conductor y los vehículos asignados a este pedido.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Chofer</Label>
                            <Select
                                value={transportEditData.driverId}
                                onValueChange={(v) => setTransportEditData({ ...transportEditData, driverId: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione Chofer" />
                                </SelectTrigger>
                                <SelectContent>
                                    {MOCK_DRIVERS.map(driver => (
                                        <SelectItem key={driver.id} value={driver.id.toString()}>
                                            {driver.name} ({driver.cedula})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Chuto (Cabezal)</Label>
                            <Select
                                value={transportEditData.chutoId}
                                onValueChange={(v) => setTransportEditData({ ...transportEditData, chutoId: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione Chuto" />
                                </SelectTrigger>
                                <SelectContent>
                                    {MOCK_CHUTOS.map(chuto => (
                                        <SelectItem key={chuto.id} value={chuto.id.toString()}>
                                            {chuto.plate} - {chuto.model}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Batea (Remolque)</Label>
                            <Select
                                value={transportEditData.bateaId}
                                onValueChange={(v) => setTransportEditData({ ...transportEditData, bateaId: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione Batea" />
                                </SelectTrigger>
                                <SelectContent>
                                    {MOCK_BATEAS.map(batea => (
                                        <SelectItem key={batea.id} value={batea.id.toString()}>
                                            {batea.plate} ({batea.type})
                                        </SelectItem>
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
        </div >
    )
}
