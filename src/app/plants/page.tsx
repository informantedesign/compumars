"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Factory, MapPin, Phone, Plus, Search, Pencil, Save, Package, Trash2 } from "lucide-react"
import { MOCK_PLANTS, MOCK_PRODUCTS } from "@/lib/mock-data"
import { api } from "@/lib/api"
import { VENEZUELA_DATA } from "@/lib/venezuela"

export default function PlantsPage() {
    const [plants, setPlants] = useState(MOCK_PLANTS);
    const [searchQuery, setSearchQuery] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingPlant, setEditingPlant] = useState<any>(null);

    // Add Plant State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newPlant, setNewPlant] = useState({
        name: "",
        location: "", // State name
        type: "Producción",
        capacityGranel: 0,
        capacitySacos: 0,
        manager: "",
        phone: "",
        status: "Operativo"
    });

    // Form State for Adding New Product in Modal
    const [newProductForm, setNewProductForm] = useState({ productId: "", defaultQuantity: "" });

    // Load from LocalStorage
    // Load from API
    const [availableProducts, setAvailableProducts] = useState<any[]>([]);

    useEffect(() => {
        const loadPlants = async () => {
            try {
                const saved = await api.get("plants_data");
                if (saved && Array.isArray(saved) && saved.length > 0) {
                    setPlants(prev => {
                        // Validate schema
                        const isValid = saved.every((p: any) => Array.isArray(p.products));
                        if (isValid) return saved;
                        console.warn("Stale plant data detected. Using defaults.");
                        return prev;
                    });
                }

                // Load Products dynamically
                const savedProducts = await api.get("products_data");
                if (savedProducts && Array.isArray(savedProducts) && savedProducts.length > 0) {
                    setAvailableProducts(prev => {
                        // Merge or replace? Replace is safer if API is source of truth
                        // But let's keep MOCK if API is partial? No, API should be full list if used.
                        return savedProducts;
                    });
                }
            } catch (e) {
                console.error("Failed to load plants or products", e);
            }
        };
        loadPlants();
    }, []);

    const handleEditClick = (plant: any) => {
        // Ensure products array exists
        setEditingPlant({ ...plant, products: plant.products || [] });
        setIsEditModalOpen(true);
    };

    const handleAddProduct = () => {
        if (!newProductForm.productId || !newProductForm.defaultQuantity) return;

        // Check if exists
        if (editingPlant.products.some((p: any) => p.productId === newProductForm.productId)) {
            alert("Este producto ya está asignado a esta planta.");
            return;
        }

        setEditingPlant((prev: any) => ({
            ...prev,
            products: [...prev.products, { ...newProductForm }]
        }));
        setNewProductForm({ productId: "", defaultQuantity: "" });
    };

    const handleRemoveProduct = (index: number) => {
        setEditingPlant((prev: any) => ({
            ...prev,
            products: prev.products.filter((_: any, i: number) => i !== index)
        }));
    };

    const handleSavePlant = () => {
        if (!editingPlant) return;

        setPlants(prev => {
            const updated = prev.map(p => p.id === editingPlant.id ? editingPlant : p);

            // Persist
            api.save("plants_data", updated);
            return updated;
        });

        setIsEditModalOpen(false);
    };

    const handleSaveNewPlant = () => {
        if (!newPlant.name || !newPlant.location) {
            alert("Por favor complete el nombre y la ubicación.");
            return;
        }

        const plantToAdd = {
            id: `PL-${Date.now()}`,
            ...newPlant,
            products: [] // Start with empty products
        };

        setPlants(prev => {
            const updated = [...prev, plantToAdd];
            api.save("plants_data", updated);
            return updated;
        });

        setIsAddModalOpen(false);
        setNewPlant({
            name: "",
            location: "",
            type: "Producción",
            capacityGranel: 0,
            capacitySacos: 0,
            manager: "",
            phone: "",
            status: "Operativo"
        });
    };

    const filteredPlants = plants.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Plantas y Centros</h1>
                    <p className="text-muted-foreground">Gestión de plantas de producción y centros de distribución.</p>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Agregar Planta
                </Button>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Buscar plantas..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredPlants.map((plant) => (
                    <Card key={plant.id} className="hover:shadow-md transition-shadow flex flex-col">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {plant.name}
                            </CardTitle>
                            <div className={`h-2 w-2 rounded-full ${plant.status === 'Operativa' || plant.status === 'Operativo' ? 'bg-green-500' : 'bg-yellow-500'}`} title={plant.status} />
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="text-2xl font-bold flex items-center gap-2 mb-2">
                                <Factory className="h-5 w-5 text-muted-foreground" />
                                <span className="text-lg">{plant.type || "Planta"}</span>
                            </div>

                            <div className="space-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    {plant.location}
                                </div>
                                <div className="pt-2 border-t mt-2">
                                    <span className="font-semibold text-foreground block text-xs mb-1">Productos Habilitados:</span>
                                    {plant.products && plant.products.length > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                            {plant.products.map((pp: any, idx: number) => {
                                                const product = availableProducts.find(p => p.id === pp.productId);
                                                return (
                                                    <span key={idx} className="text-[10px] bg-muted px-1.5 py-0.5 rounded border">
                                                        {product?.name || pp.productId} ({pp.defaultQuantity})
                                                    </span>
                                                )
                                            })}
                                        </div>
                                    ) : (
                                        <span className="text-xs italic">Sin productos configurados</span>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                            <Button variant="outline" className="w-full" onClick={() => handleEditClick(plant)}>
                                <Pencil className="mr-2 h-3 w-3" /> Configurar Productos
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Configurar Productos de Planta</DialogTitle>
                        <DialogDescription>
                            Asigne los productos que esta planta puede despachar y sus cantidades predeterminadas.
                        </DialogDescription>
                    </DialogHeader>

                    {editingPlant && (
                        <div className="py-4 space-y-6">
                            {/* List of Configured Products */}
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold uppercase text-muted-foreground">Productos Asignados</Label>
                                <div className="border rounded-md divide-y max-h-[200px] overflow-y-auto">
                                    {editingPlant.products.length === 0 && (
                                        <div className="p-4 text-center text-sm text-muted-foreground">
                                            No hay productos asignados.
                                        </div>
                                    )}
                                    {editingPlant.products.map((pp: any, idx: number) => {
                                        const product = availableProducts.find(p => p.id === pp.productId);
                                        return (
                                            <div key={idx} className="flex items-center justify-between p-2 text-sm">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{product?.name || "Producto Desconocido"}</span>
                                                    <span className="text-xs text-muted-foreground">Default: {pp.defaultQuantity} {product?.unit}</span>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 text-destructive hover:text-destructive"
                                                    onClick={() => handleRemoveProduct(idx)}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Add New Product Form */}
                            <div className="space-y-3 bg-muted/30 p-3 rounded-lg border border-dashed">
                                <Label className="text-xs font-semibold">Agregar Producto</Label>
                                <div className="grid grid-cols-[1fr_80px] gap-2">
                                    <Select
                                        value={newProductForm.productId}
                                        onValueChange={(v) => setNewProductForm({ ...newProductForm, productId: v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Producto" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableProducts.map(p => (
                                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        type="number"
                                        placeholder="Cant."
                                        value={newProductForm.defaultQuantity}
                                        onChange={(e) => setNewProductForm({ ...newProductForm, defaultQuantity: e.target.value })}
                                    />
                                </div>
                                <Button
                                    className="w-full text-xs"
                                    size="sm"
                                    variant="secondary"
                                    onClick={handleAddProduct}
                                    disabled={!newProductForm.productId || !newProductForm.defaultQuantity}
                                >
                                    <Plus className="mr-2 h-3 w-3" /> Agregar a la Lista
                                </Button>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSavePlant}>
                            <Save className="mr-2 h-4 w-4" /> Guardar Configuración
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add New Plant Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Agregar Nueva Planta</DialogTitle>
                        <DialogDescription>
                            Ingrese los detalles de la nueva planta o centro de distribución.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">
                                Nombre
                            </Label>
                            <Input
                                id="name"
                                value={newPlant.name}
                                onChange={(e) => setNewPlant({ ...newPlant, name: e.target.value })}
                                placeholder="Ej. Planta San Cristóbal"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="location">
                                Ubicación
                            </Label>
                            <Select
                                value={newPlant.location}
                                onValueChange={(val) => setNewPlant({ ...newPlant, location: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione Estado" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[200px]">
                                    {VENEZUELA_DATA.map((state) => (
                                        <SelectItem key={state.name} value={state.name}>
                                            {state.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="type">
                                Tipo
                            </Label>
                            <Select
                                value={newPlant.type}
                                onValueChange={(val) => setNewPlant({ ...newPlant, type: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Producción">Producción</SelectItem>
                                    <SelectItem value="Centro Dist.">Centro Dist.</SelectItem>
                                    <SelectItem value="Distribución">Distribución</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="manager">
                                Encargado
                            </Label>
                            <Input
                                id="manager"
                                value={newPlant.manager}
                                onChange={(e) => setNewPlant({ ...newPlant, manager: e.target.value })}
                                placeholder="Nombre del responsable"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="phone">
                                Teléfono
                            </Label>
                            <Input
                                id="phone"
                                value={newPlant.phone}
                                onChange={(e) => setNewPlant({ ...newPlant, phone: e.target.value })}
                                placeholder="02xx-xxxxxxx"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs">Cap. Granel (Ton)</Label>
                                <Input
                                    type="number"
                                    value={newPlant.capacityGranel}
                                    onChange={(e) => setNewPlant({ ...newPlant, capacityGranel: Number(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs">Cap. Sacos (Unid)</Label>
                                <Input
                                    type="number"
                                    value={newPlant.capacitySacos}
                                    onChange={(e) => setNewPlant({ ...newPlant, capacitySacos: Number(e.target.value) })}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSaveNewPlant}>Guardar Planta</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
