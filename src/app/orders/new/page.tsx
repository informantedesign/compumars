"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Factory, Package, Users, MapPin, Truck, Wallet,
    ArrowRight, ArrowLeft, CheckCircle, AlertCircle, Briefcase
} from "lucide-react"
import {
    MOCK_PLANTS, MOCK_PRODUCTS, MOCK_CLIENTS,
    MOCK_DRIVERS, MOCK_TRANSPORTERS, MOCK_CHUTOS, MOCK_BATEAS, MOCK_SELLERS
} from "@/lib/mock-data"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"

// Steps
const STEPS = [
    { id: 1, title: "Origen y Producto", icon: Factory },
    { id: 2, title: "Cliente y Destino", icon: Users },
    { id: 3, title: "Logística", icon: Truck },
    { id: 4, title: "Finanzas", icon: Wallet },
]

export default function NewOrderPage() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)

    // Form State
    const [formData, setFormData] = useState({
        // Step 1
        plantId: "",
        plantOrderNumber: "",
        productId: "",
        quantity: "",

        // Step 2
        clientId: "",
        addressId: "",
        clientToBeAssigned: false, // New Field
        sellerId: "", // New Field

        // Step 3
        transporterId: "",
        driverId: "",
        chutoId: "",
        bateaId: "",
        driverToBeAssigned: false, // New Field
        isPickup: false,
        freightCost: "",

        // Step 4
        unitPrice: "",
        unitCost: ""
    })

    // Load Sellers and Plants (simulating persistence)
    const [availableSellers, setAvailableSellers] = useState<any[]>(MOCK_SELLERS);
    const [availablePlants, setAvailablePlants] = useState<any[]>(MOCK_PLANTS);

    useEffect(() => {
        const loadData = async () => {
            try {
                const savedSellers = await api.get("sellers_data");
                if (savedSellers && Array.isArray(savedSellers)) {
                    setAvailableSellers(savedSellers);
                }

                const savedPlants = await api.get("plants_data");
                if (savedPlants && Array.isArray(savedPlants) && savedPlants.length > 0) {
                    setAvailablePlants(savedPlants);
                }
            } catch (e) {
                console.error("Error loading initial data", e);
            }
        };
        loadData();
    }, []);

    // Auto-fill logic when Plant changes
    const handlePlantChange = (plantId: string) => {
        // We just reset the product and quantity when plant changes to force re-selection from valid list
        setFormData(prev => ({
            ...prev,
            plantId,
            productId: "",
            quantity: ""
        }));
    };

    const handleProductChange = (productId: string) => {
        const plant = availablePlants.find(p => p.id === formData.plantId);
        // Find config in the new 'products' array
        const productConfig = plant?.products?.find((p: any) => p.productId === productId);

        setFormData(prev => ({
            ...prev,
            productId,
            quantity: productConfig?.defaultQuantity || prev.quantity
        }));
    }

    // Derived Data
    const selectedPlant = useMemo(() => availablePlants.find(p => p.id === formData.plantId), [formData.plantId, availablePlants])

    // Filtered Products based on Plant Configuration
    const filteredProducts = useMemo(() => {
        // If plant has no specific product list, show all (legacy behavior or unconfigured)
        if (!selectedPlant || !selectedPlant.products || selectedPlant.products.length === 0) {
            return MOCK_PRODUCTS;
        }
        // Otherwise, filter MOCK_PRODUCTS to only those in the plant's list
        return MOCK_PRODUCTS.filter(p => selectedPlant.products.some((pp: any) => pp.productId === p.id));
    }, [selectedPlant]);

    const selectedProduct = useMemo(() => MOCK_PRODUCTS.find(p => p.id === formData.productId), [formData.productId])
    const selectedClient = useMemo(() => MOCK_CLIENTS.find(c => c.id === Number(formData.clientId)), [formData.clientId])
    const selectedAddress = useMemo(() => selectedClient?.addresses.find(a => a.id === formData.addressId), [selectedClient, formData.addressId])
    const selectedSeller = useMemo(() => availableSellers.find(s => s.id === formData.sellerId), [formData.sellerId, availableSellers])

    // Validation Logic
    const isStep1Valid = !!formData.plantId && !!formData.productId && !!formData.quantity && parseFloat(formData.quantity) > 0;

    // Step 2 Valid if (Client & Address Selected) OR (Client To Be Assigned Checked)
    const isStep2Valid = formData.clientToBeAssigned || (!!formData.clientId && !!formData.addressId);

    // Step 3 Valid if (Driver logic met) OR (Driver To Be Assigned Checked)
    const isDriverDetailsComplete = !!formData.transporterId && !!formData.driverId && !!formData.chutoId && !!formData.bateaId;
    const isFreightValid = formData.isPickup || (!formData.driverToBeAssigned ? (!!formData.freightCost && parseFloat(formData.freightCost) > 0) : true);

    const isStep3Valid = formData.driverToBeAssigned || (isDriverDetailsComplete && isFreightValid);

    const isStep4Valid = !!formData.unitPrice && !!formData.unitCost;

    const isCurrentStepValid = useMemo(() => {
        switch (currentStep) {
            case 1: return isStep1Valid;
            case 2: return isStep2Valid;
            case 3: return isStep3Valid;
            case 4: return isStep4Valid;
            default: return false;
        }
    }, [currentStep, isStep1Valid, isStep2Valid, isStep3Valid, isStep4Valid]);

    const selectedDriver = useMemo(() => MOCK_DRIVERS.find(d => d.id === Number(formData.driverId)), [formData.driverId])
    const selectedChuto = useMemo(() => MOCK_CHUTOS.find(c => c.id === Number(formData.chutoId)), [formData.chutoId])
    const selectedBatea = useMemo(() => MOCK_BATEAS.find(b => b.id === Number(formData.bateaId)), [formData.bateaId])

    // Calculations
    const quantityNum = parseFloat(formData.quantity) || 0
    const priceNum = parseFloat(formData.unitPrice) || 0
    const costNum = parseFloat(formData.unitCost) || 0
    const totalSales = quantityNum * priceNum
    const totalCost = quantityNum * costNum

    const handleNext = () => {
        if (currentStep < 4) setCurrentStep(currentStep + 1)
    }

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1)
    }

    const handleSubmit = () => {
        const newOrder = {
            id: `PED-${Math.floor(Math.random() * 10000)}`,
            plantOrderNumber: formData.plantOrderNumber,

            // Client Logic
            client: formData.clientToBeAssigned ? "Por Asignar" : (selectedClient?.name || "Cliente"),
            rif: formData.clientToBeAssigned ? "N/A" : (selectedClient?.rif || ""),
            route: `${selectedPlant?.name || 'Origen'} -> ${formData.clientToBeAssigned ? 'Por Asignar' : (selectedAddress?.municipality || 'Destino')}`,
            origin: selectedPlant?.name,
            destination: formData.clientToBeAssigned ? "Por Asignar" : (selectedAddress?.detail || "Destino"),
            contact: formData.clientToBeAssigned ? "N/A" : selectedClient?.phone,
            phone: formData.clientToBeAssigned ? "N/A" : selectedClient?.phone,

            // Final details (Reguía) - Initialize empty/placeholder
            finalClient: formData.clientToBeAssigned ? "Por Asignar" : undefined,
            finalAddress: formData.clientToBeAssigned ? "Por Asignar" : undefined,

            // Driver Logic
            driver: formData.driverToBeAssigned ? "Por Asignar" : (selectedDriver?.name || "Chofer"),
            driverPhone: "0000-000000",

            // Truck Snapshot
            truck: formData.driverToBeAssigned ? "Por Asignar" : (selectedChuto?.plate),
            truckPlate: formData.driverToBeAssigned ? "N/A" : selectedChuto?.plate,
            truckBrand: formData.driverToBeAssigned ? "N/A" : (selectedChuto?.brand || "Mack"),
            truckModel: formData.driverToBeAssigned ? "N/A" : (selectedChuto?.model || "Standard"),
            truckColor: "Blanco",
            truckType: "Chuto",

            // Trailer Snapshot  
            plate: formData.driverToBeAssigned ? "N/A" : (selectedBatea?.plate),
            trailerPlate: formData.driverToBeAssigned ? "N/A" : selectedBatea?.plate,
            trailerBrand: "N/A",
            trailerModel: "Standard",
            trailerColor: "Rojo",
            trailerType: formData.driverToBeAssigned ? "N/A" : (selectedBatea?.type || "Platform"),

            // Status - Logic based on missing info
            status: (formData.clientToBeAssigned || formData.driverToBeAssigned) ? "Programado" : "Programado",

            eta: "Por definir",
            product: selectedProduct?.name,
            quantity: `${formData.quantity} ${selectedProduct?.unit}`,

            // Financials Mapping
            freightPrice: totalSales, // Venta Total
            plantCost: totalCost,     // Costo Producto
            driverPayment: parseFloat(formData.freightCost) || 0, // Costo Flete (might be 0 if 'Por Asignar' and not filled)
            otherExpenses: 0,

            // Seller Info
            sellerId: formData.sellerId || "V-000", // Default to Oficina if not selected
            sellerName: selectedSeller?.name || "Oficina",

            history: [{
                date: new Date().toLocaleString(),
                action: "Creación",
                details: "Pedido creado desde el asistente",
                user: "Usuario"
            }]
        }

        // Save to API
        const saveOrder = async () => {
            try {
                const existingOrders = await api.get("active_orders") || [];
                await api.save("active_orders", [newOrder, ...existingOrders]);
                router.push("/dashboard");
            } catch (e) {
                console.error("Error saving order", e);
            }
        };
        saveOrder();
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 py-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Nuevo Pedido</h1>
                    <p className="text-muted-foreground">Asistente de creación de guía de despacho.</p>
                </div>
                <Link href="/dashboard">
                    <Button variant="ghost">Cancelar</Button>
                </Link>
            </div>

            {/* Stepper */}
            <div className="relative flex items-center justify-between w-full px-10">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-muted -z-10" />
                {STEPS.map((step) => {
                    const isActive = step.id === currentStep
                    const isCompleted = step.id < currentStep
                    return (
                        <div key={step.id} className="flex flex-col items-center gap-2 bg-background px-4">
                            <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                                ${isActive ? 'border-primary bg-primary text-primary-foreground scale-110' :
                                    isCompleted ? 'border-primary bg-background text-primary' : 'border-muted-foreground/30 text-muted-foreground'}
                            `}>
                                <step.icon className="h-5 w-5" />
                            </div>
                            <span className={`text-xs font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {step.title}
                            </span>
                        </div>
                    )
                })}
            </div>

            <Card className="min-h-[400px] flex flex-col">
                <CardHeader>
                    <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
                    <CardDescription>Paso {currentStep} de 4</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">

                    {/* STEP 1: ORIGIN & PRODUCT */}
                    {currentStep === 1 && (
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Planta de Origen</Label>
                                <Select value={formData.plantId} onValueChange={handlePlantChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione Planta" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availablePlants.map(p => (
                                            <SelectItem key={p.id} value={p.id}>{p.name} ({p.location})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Número de Pedido Planta</Label>
                                <Input
                                    placeholder="Ej. PL-2024-001"
                                    value={formData.plantOrderNumber}
                                    onChange={(e) => setFormData({ ...formData, plantOrderNumber: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Producto</Label>
                                <Select
                                    value={formData.productId}
                                    onValueChange={handleProductChange}
                                    disabled={!formData.plantId}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione Producto" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredProducts.map(p => (
                                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Cantidad {selectedProduct && `(${selectedProduct.unit === 'Ton' ? 'Toneladas' : 'Sacos'})`}</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    />
                                    <span className="text-sm font-medium bg-muted px-3 py-2 rounded-md min-w-[60px] text-center">
                                        {selectedProduct?.unit || '-'}
                                    </span>
                                </div>
                                {selectedProduct && (
                                    <p className="text-xs text-muted-foreground">
                                        Presentación: {selectedProduct.presentation} ({selectedProduct.weight} {selectedProduct.unit})
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* STEP 2: CLIENT & ADDRESS */}
                    {currentStep === 2 && (
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Checkbox for "To Be Assigned" */}
                            <div className="col-span-2 flex items-center space-x-2 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-md border border-orange-100 dark:border-orange-900 border-dashed">
                                <Checkbox
                                    id="client-assign"
                                    checked={formData.clientToBeAssigned}
                                    onCheckedChange={(checked) => setFormData({ ...formData, clientToBeAssigned: checked === true })}
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <label
                                        htmlFor="client-assign"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Cliente por Asignar / Pendiente Venta
                                    </label>
                                    <p className="text-xs text-muted-foreground">
                                        Seleccione esta opción si aún no tiene un cliente final definido para la carga.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className={formData.clientToBeAssigned ? "opacity-50" : ""}>Cliente</Label>
                                <Select
                                    value={formData.clientId}
                                    onValueChange={(v) => setFormData({ ...formData, clientId: v, addressId: "" })}
                                    disabled={formData.clientToBeAssigned}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione Cliente" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {MOCK_CLIENTS.map(c => (
                                            <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className={formData.clientToBeAssigned ? "opacity-50" : ""}>Dirección de Entrega</Label>
                                <Select
                                    value={formData.addressId}
                                    onValueChange={(v) => setFormData({ ...formData, addressId: v })}
                                    disabled={formData.clientToBeAssigned || !formData.clientId}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={formData.clientId ? "Seleccione Dirección" : "Primero seleccione un cliente"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {selectedClient?.addresses.map(addr => (
                                            <SelectItem key={addr.id} value={addr.id}>
                                                {addr.state}, {addr.municipality} - {addr.detail}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {selectedClient && selectedClient.addresses.length === 0 && (
                                    <p className="text-xs text-destructive flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" /> Este cliente no tiene direcciones registradas.
                                    </p>
                                )}
                                {selectedAddress && !formData.clientToBeAssigned && (
                                    <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-800 flex items-start gap-2">
                                        <MapPin className="h-4 w-4 text-blue-600 mt-0.5" />
                                        <div className="text-xs">
                                            <p className="font-semibold text-blue-800 dark:text-blue-300">Contacto en Sitio:</p>
                                            <p className="text-muted-foreground">Juan Perez (Resident Engineer)</p>
                                            <p className="text-muted-foreground font-mono">0414-9988776</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Seller Selection */}
                            <div className="col-span-2 space-y-2 pt-4 border-t border-dashed">
                                <Label className="flex items-center gap-2">
                                    <Briefcase className="h-4 w-4" /> Vendedor Asignado
                                </Label>
                                <Select
                                    value={formData.sellerId}
                                    onValueChange={(v) => setFormData({ ...formData, sellerId: v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione Vendedor (Opcional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableSellers.map(s => (
                                            <SelectItem key={s.id} value={s.id}>
                                                {s.name} ({s.commission}%)
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    Por defecto: Oficina (0%)
                                </p>
                            </div>

                            {selectedClient && !formData.clientToBeAssigned && (
                                <div className="col-span-2 p-4 bg-muted/50 rounded-lg border border-dashed">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Users className="h-4 w-4 text-primary" />
                                        <span className="font-semibold text-sm">Datos del Cliente</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div><span className="text-muted-foreground">RIF:</span> {selectedClient.rif}</div>
                                        <div><span className="text-muted-foreground">Teléfono:</span> {selectedClient.phone}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 3: LOGISTICS */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            {/* Checkbox for "Driver To Be Assigned" */}
                            <div className="flex items-center space-x-2 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-md border border-orange-100 dark:border-orange-900 border-dashed">
                                <Checkbox
                                    id="driver-assign"
                                    checked={formData.driverToBeAssigned}
                                    onCheckedChange={(checked) => setFormData({ ...formData, driverToBeAssigned: checked === true })}
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <label
                                        htmlFor="driver-assign"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Chofer por Asignar / Pendiente Transporte
                                    </label>
                                    <p className="text-xs text-muted-foreground">
                                        Seleccione esta opción si aún no tiene un transporte asignado.
                                    </p>
                                </div>
                            </div>

                            <div className={`grid gap-6 md:grid-cols-2 ${formData.driverToBeAssigned ? 'opacity-50 pointer-events-none' : ''}`}>
                                <div className="space-y-2">
                                    <Label>Transportista</Label>
                                    <Select value={formData.transporterId} onValueChange={(v) => setFormData({ ...formData, transporterId: v })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Empresa de Transporte" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {MOCK_TRANSPORTERS.map(t => (
                                                <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Chofer</Label>
                                    <Select value={formData.driverId} onValueChange={(v) => setFormData({ ...formData, driverId: v })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione Chofer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {MOCK_DRIVERS.map(d => (
                                                <SelectItem key={d.id} value={d.id.toString()}>{d.name} ({d.cedula})</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Unidad (Chuto)</Label>
                                    <Select value={formData.chutoId} onValueChange={(v) => setFormData({ ...formData, chutoId: v })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Placa Chuto" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {MOCK_CHUTOS.map(c => (
                                                <SelectItem key={c.id} value={c.id.toString()}>{c.plate} - {c.model}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Batea (Remolque)</Label>
                                    <Select value={formData.bateaId} onValueChange={(v) => setFormData({ ...formData, bateaId: v })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Placa Batea" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {MOCK_BATEAS.map(b => (
                                                <SelectItem key={b.id} value={b.id.toString()}>{b.plate} ({b.type})</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex flex-col gap-4 p-4 border rounded-lg bg-orange-50 dark:bg-orange-950/20">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="pickup"
                                        checked={formData.isPickup}
                                        onCheckedChange={(checked) => setFormData({ ...formData, isPickup: checked === true, freightCost: checked ? "" : formData.freightCost })}
                                    />
                                    <label
                                        htmlFor="pickup"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Retiro en Planta (Cliente retira con transporte propio)
                                    </label>
                                </div>

                                <div className="space-y-2 max-w-xs">
                                    <Label className={formData.isPickup ? "opacity-50" : ""}>Pago Chofer / Flete ($)</Label>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        disabled={formData.isPickup}
                                        value={formData.freightCost}
                                        onChange={(e) => setFormData({ ...formData, freightCost: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: FINANCIALS */}
                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <div className="border rounded-md overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted text-muted-foreground font-medium border-b">
                                        <tr>
                                            <th className="p-4">Producto</th>
                                            <th className="p-4 text-center">Unidad</th>
                                            <th className="p-4 text-center">Cantidad</th>
                                            <th className="p-4 text-right">Precio Unit. ($)</th>
                                            <th className="p-4 text-right">Venta (Ingreso) $</th>
                                            <th className="p-4 text-right">Costo Unit. ($)</th>
                                            <th className="p-4 text-right">Costo Planta $</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        <tr>
                                            <td className="p-4 font-medium">{selectedProduct?.name}</td>
                                            <td className="p-4 text-center">{selectedProduct?.unit}</td>
                                            <td className="p-4 text-center font-mono">{quantityNum}</td>
                                            <td className="p-4 text-right">
                                                <Input
                                                    type="number"
                                                    className="w-24 text-right h-8 ml-auto"
                                                    value={formData.unitPrice}
                                                    onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                                                    placeholder="0.00"
                                                />
                                            </td>
                                            <td className="p-4 text-right font-bold text-green-600">
                                                {totalSales.toFixed(2)}
                                            </td>
                                            <td className="p-4 text-right">
                                                <Input
                                                    type="number"
                                                    className="w-24 text-right h-8 ml-auto"
                                                    value={formData.unitCost}
                                                    onChange={(e) => setFormData({ ...formData, unitCost: e.target.value })}
                                                    placeholder="0.00"
                                                />
                                            </td>
                                            <td className="p-4 text-right font-bold text-red-600">
                                                {totalCost.toFixed(2)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex justify-end gap-8 bg-muted/20 p-6 rounded-lg border">
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground mb-1">Ganancia Estimada</p>
                                    <p className={`text-3xl font-bold ${totalSales - totalCost >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        $ {(totalSales - totalCost).toFixed(2)}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Margen: {totalSales > 0 ? (((totalSales - totalCost) / totalSales) * 100).toFixed(1) : 0}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-6 bg-muted/10">
                    <Button
                        variant="outline"
                        onClick={handleBack}
                        disabled={currentStep === 1}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
                    </Button>

                    {currentStep < 4 ? (
                        <Button onClick={handleNext} disabled={!isCurrentStepValid}>
                            Siguiente <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700" disabled={!isCurrentStepValid}>
                            <CheckCircle className="mr-2 h-4 w-4" /> Crear Pedido
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
