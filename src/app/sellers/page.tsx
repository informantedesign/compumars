"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Pencil, Trash2, Users, Briefcase, Phone } from "lucide-react"
import { MOCK_SELLERS } from "@/lib/mock-data"
import { Separator } from "@/components/ui/separator"
import { api } from "@/lib/api"

type Seller = {
    id: string
    name: string
    commission: number
    phone: string
}

export default function SellersPage() {
    const [sellers, setSellers] = useState<Seller[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [currentSeller, setCurrentSeller] = useState<Seller | null>(null)

    // Form State
    const [formData, setFormData] = useState<Partial<Seller>>({
        name: "",
        commission: 0,
        phone: ""
    })

    useEffect(() => {
        const loadSellers = async () => {
            try {
                const saved = await api.get("sellers_data");
                if (saved && Array.isArray(saved) && saved.length > 0) {
                    setSellers(saved);
                } else {
                    setSellers(MOCK_SELLERS);
                    api.save("sellers_data", MOCK_SELLERS);
                }
            } catch (e) {
                console.error("Failed to load sellers", e);
                setSellers(MOCK_SELLERS);
            }
            setLoading(false);
        };
        loadSellers();
    }, [])

    const saveSellers = (newSellers: Seller[]) => {
        setSellers(newSellers)
        api.save("sellers_data", newSellers)
    }

    const handleSubmit = () => {
        if (!formData.name) return

        let updatedSellers = [...sellers]

        if (currentSeller) {
            // Edit
            updatedSellers = updatedSellers.map(s =>
                s.id === currentSeller.id
                    ? { ...s, name: formData.name!, commission: Number(formData.commission) || 0, phone: formData.phone || "N/A" }
                    : s
            )
        } else {
            // Create
            const newId = `V-${(sellers.length + 1).toString().padStart(3, '0')}`
            const newSeller: Seller = {
                id: newId,
                name: formData.name,
                commission: Number(formData.commission) || 0,
                phone: formData.phone || "N/A"
            }
            updatedSellers.push(newSeller)
        }

        saveSellers(updatedSellers)
        setIsDialogOpen(false)
        resetForm()
    }

    const handleDelete = (id: string) => {
        if (id === "V-000") {
            alert("No se puede eliminar el vendedor 'Oficina'.")
            return
        }
        if (confirm("¿Estás seguro de eliminar este vendedor?")) {
            const updated = sellers.filter(s => s.id !== id)
            saveSellers(updated)
        }
    }

    const openEdit = (seller: Seller) => {
        setCurrentSeller(seller)
        setFormData({
            name: seller.name,
            commission: seller.commission,
            phone: seller.phone
        })
        setIsDialogOpen(true)
    }

    const resetForm = () => {
        setCurrentSeller(null)
        setFormData({ name: "", commission: 0, phone: "" })
    }

    if (loading) return <div className="p-8">Cargando vendedores...</div>

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Users className="h-8 w-8 text-primary" /> Gestión de Vendedores
                    </h1>
                    <p className="text-muted-foreground">Administra el equipo de ventas y sus comisiones.</p>
                </div>
                <Button onClick={() => { resetForm(); setIsDialogOpen(true) }}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Vendedor
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* METRICS OR INFO CARD */}
                <Card className="md:col-span-3">
                    <CardHeader>
                        <CardTitle>Listado de Vendedores</CardTitle>
                        <CardDescription>
                            Total registrados: {sellers.length}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="hidden md:block rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">ID</TableHead>
                                        <TableHead>Nombre Completo</TableHead>
                                        <TableHead>Teléfono</TableHead>
                                        <TableHead className="text-right">Comisión (%)</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sellers.map((seller) => (
                                        <TableRow key={seller.id}>
                                            <TableCell className="font-medium font-mono">{seller.id}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                        {seller.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    {seller.name}
                                                    {seller.id === "V-000" && <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded border ml-2">SISTEMA</span>}
                                                </div>
                                            </TableCell>
                                            <TableCell>{seller.phone}</TableCell>
                                            <TableCell className="text-right font-bold text-green-600">
                                                {seller.commission}%
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => openEdit(seller)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        disabled={seller.id === "V-000"}
                                                        onClick={() => handleDelete(seller.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Mobile List View */}
                        <div className="grid gap-4 md:hidden">
                            {sellers.map((seller) => (
                                <div key={seller.id} className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm bg-card">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                                {seller.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">{seller.name}</p>
                                                <p className="text-xs text-muted-foreground font-mono">{seller.id}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(seller)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                disabled={seller.id === "V-000"}
                                                onClick={() => handleDelete(seller.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm mt-1">
                                        <div>
                                            <span className="text-muted-foreground text-xs block">Teléfono</span>
                                            {seller.phone}
                                        </div>
                                        <div className="text-right">
                                            <span className="text-muted-foreground text-xs block">Comisión</span>
                                            <span className="font-bold text-green-600">{seller.commission}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{currentSeller ? "Editar Vendedor" : "Registrar Nuevo Vendedor"}</DialogTitle>
                        <DialogDescription>
                            Ingresa los datos del vendedor y su porcentaje de comisión asignado.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre Completo</Label>
                            <Input
                                id="name"
                                placeholder="Ej: Juan Pérez"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone">Teléfono</Label>
                                <Input
                                    id="phone"
                                    placeholder="0414-0000000"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="commission">Comisión (%)</Label>
                                <div className="relative">
                                    <Input
                                        id="commission"
                                        type="number"
                                        placeholder="0"
                                        className="pr-8"
                                        value={formData.commission?.toString()}
                                        onChange={(e) => setFormData({ ...formData, commission: Number(e.target.value) })}
                                    />
                                    <span className="absolute right-3 top-2.5 text-muted-foreground text-sm">%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSubmit}>{currentSeller ? "Guardar Cambios" : "Registrar Vendedor"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
