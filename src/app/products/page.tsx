"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/context/language-context"
import { Plus, Search, Package, Scale, Box, Settings } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

// Product Type Definition
type Product = {
    id: string
    name: string
    presentation: string // 'Sacos' | 'Granel' | 'Paleta'
    unit: string // 'kg' | 'Ton'
    weight: string
}

export default function ProductsPage() {
    const { t } = useLanguage()

    // Mock Data
    const [products, setProducts] = useState<Product[]>([
        { id: "PROD-001", name: "Cemento Portland Tipo I", presentation: "Sacos", unit: "kg", weight: "42.5" },
        { id: "PROD-002", name: "Cemento Granel Industrial", presentation: "Granel", unit: "Ton", weight: "1" },
        { id: "PROD-003", name: "Pego Gris Estándar", presentation: "Sacos", unit: "kg", weight: "10" },
    ])

    // Form State
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState<Partial<Product>>({
        name: "",
        presentation: "Sacos",
        unit: "kg",
        weight: ""
    })

    const handleSave = () => {
        if (!formData.name || !formData.weight) return;

        if (editingId) {
            // Update existing product
            setProducts(products.map(p => p.id === editingId ? { ...p, ...formData } as Product : p))
        } else {
            // Create new product
            const newProduct: Product = {
                id: `PROD-00${products.length + 1}`,
                name: formData.name!,
                presentation: formData.presentation || "Sacos",
                unit: formData.unit || "kg",
                weight: formData.weight!
            }
            setProducts([...products, newProduct])
        }

        setIsDialogOpen(false)
        setEditingId(null)
        setFormData({ name: "", presentation: "Sacos", unit: "kg", weight: "" })
    }

    const handleEdit = (product: Product) => {
        setEditingId(product.id)
        setFormData(product)
        setIsDialogOpen(true)
    }

    const handleCreate = () => {
        setEditingId(null)
        setFormData({ name: "", presentation: "Sacos", unit: "kg", weight: "" })
        setIsDialogOpen(true)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tipos de Productos</h1>
                    <p className="text-muted-foreground">Gestión del catálogo de productos y presentaciones.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleCreate}>
                            <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{editingId ? 'Editar Producto' : 'Crear Nuevo Producto'}</DialogTitle>
                            <DialogDescription>
                                Defina los detalles del producto y su presentación comercial.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Nombre
                                </Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="col-span-3"
                                    placeholder="Ej. Cemento Tipo I"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="presentation" className="text-right">
                                    Presentación
                                </Label>
                                <Select
                                    value={formData.presentation}
                                    onValueChange={(val) => setFormData({ ...formData, presentation: val })}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Seleccione..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Sacos">Sacos / Bolsas</SelectItem>
                                        <SelectItem value="Granel">Granel</SelectItem>
                                        <SelectItem value="Paleta">Paleta (Tarima)</SelectItem>
                                        <SelectItem value="BigBag">Big Bag</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="weight" className="text-right">
                                    Peso/Unidad
                                </Label>
                                <div className="col-span-3 flex gap-2">
                                    <Input
                                        id="weight"
                                        type="number"
                                        value={formData.weight}
                                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                        placeholder="0.00"
                                        className="flex-1"
                                    />
                                    <Select
                                        value={formData.unit}
                                        onValueChange={(val) => setFormData({ ...formData, unit: val })}
                                    >
                                        <SelectTrigger className="w-[100px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="kg">kg</SelectItem>
                                            <SelectItem value="Ton">Ton</SelectItem>
                                            <SelectItem value="Lbs">Lbs</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" onClick={handleSave}>Guardar Cambios</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar producto..." className="pl-8" />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {products.map(product => (
                    <Card key={product.id} className="hover:border-primary transition-colors group relative">
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                                <Settings className="h-4 w-4" />
                            </Button>
                        </div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {product.id}
                            </CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold mb-2">{product.name}</div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex flex-col gap-1">
                                    <span className="text-muted-foreground text-xs uppercase font-semibold">Presentación</span>
                                    <div className="flex items-center gap-2">
                                        <Box className="h-4 w-4 text-primary" />
                                        <span>{product.presentation}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-muted-foreground text-xs uppercase font-semibold">Peso Neto</span>
                                    <div className="flex items-center gap-2">
                                        <Scale className="h-4 w-4 text-primary" />
                                        <span>{product.weight} {product.unit}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
