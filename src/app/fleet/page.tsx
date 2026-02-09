"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/context/language-context"
import { Plus, Search, Truck } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { useState } from "react"
import { Settings } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function FleetPage() {
    const { t } = useLanguage()

    // Data State
    const [chutos, setChutos] = useState([
        { id: 1, plate: "A21-BC2", brand: "Mack", model: "Granite", color: "Blanco", type: "Chuto", status: "Active" },
        { id: 2, plate: "X99-ZZ1", brand: "Iveco", model: "Trakker", color: "Azul", type: "Chuto", status: "Maintenance" },
    ])

    const [bateas, setBateas] = useState([
        { id: 3, plate: "BT-9921", brand: "Randon", model: "Standard", color: "Rojo", type: "Platform", status: "Active" },
        { id: 4, plate: "BT-1100", brand: "Taza", model: "Bulk", color: "Gris", type: "Bulk (Granel)", status: "Active" },
    ])

    // Modal & Form State
    const [chutoModal, setChutoModal] = useState(false)
    const [bateaModal, setBateaModal] = useState(false)
    const [editingChutoId, setEditingChutoId] = useState<number | null>(null)
    const [editingBateaId, setEditingBateaId] = useState<number | null>(null)

    const [chutoForm, setChutoForm] = useState({ plate: "", brand: "", model: "", color: "", type: "Chuto", status: "Active" })
    const [bateaForm, setBateaForm] = useState({ plate: "", brand: "", model: "", color: "", type: "Platform", status: "Active" })

    // Chuto Handlers
    const handleEditChuto = (chuto: any) => {
        setEditingChutoId(chuto.id)
        setChutoForm(chuto)
        setChutoModal(true)
    }

    const handleSaveChuto = () => {
        if (editingChutoId) {
            setChutos(chutos.map(c => c.id === editingChutoId ? { ...c, ...chutoForm } : c))
        } else {
            setChutos([...chutos, { id: Date.now(), ...chutoForm }])
        }
        setChutoModal(false)
    }

    // Batea Handlers
    const handleEditBatea = (batea: any) => {
        setEditingBateaId(batea.id)
        setBateaForm(batea)
        setBateaModal(true)
    }

    const handleSaveBatea = () => {
        if (editingBateaId) {
            setBateas(bateas.map(b => b.id === editingBateaId ? { ...b, ...bateaForm } : b))
        } else {
            setBateas([...bateas, { id: Date.now(), ...bateaForm }])
        }
        setBateaModal(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">{t.fleet.title}</h1>
            </div>

            <Tabs defaultValue="chutos" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="chutos">{t.fleet.chuto}</TabsTrigger>
                    <TabsTrigger value="bateas">{t.fleet.batea}</TabsTrigger>
                </TabsList>

                <TabsContent value="chutos" className="space-y-4">
                    <div className="flex justify-end mb-4">
                        <Dialog open={chutoModal} onOpenChange={setChutoModal}>
                            <DialogTrigger asChild>
                                <Button onClick={() => { setEditingChutoId(null); setChutoForm({ plate: "", brand: "", model: "", color: "", type: "Chuto", status: "Active" }) }}>
                                    <Plus className="mr-2 h-4 w-4" /> {t.fleet.add}
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{editingChutoId ? "Editar Chuto" : "Agregar Chuto"}</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label>Placa</Label>
                                        <Input value={chutoForm.plate} onChange={e => setChutoForm({ ...chutoForm, plate: e.target.value })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Marca</Label>
                                        <Input value={chutoForm.brand} onChange={e => setChutoForm({ ...chutoForm, brand: e.target.value })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Modelo</Label>
                                        <Input value={chutoForm.model} onChange={e => setChutoForm({ ...chutoForm, model: e.target.value })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Color</Label>
                                        <Input value={chutoForm.color} onChange={e => setChutoForm({ ...chutoForm, color: e.target.value })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Tipo</Label>
                                        <Input value={chutoForm.type} onChange={e => setChutoForm({ ...chutoForm, type: e.target.value })} />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleSaveChuto}>Guardar</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {chutos.map(unit => (
                        <Card key={unit.id} className="relative group">
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" onClick={() => handleEditChuto(unit)}>
                                    <Settings className="h-4 w-4" />
                                </Button>
                            </div>
                            <CardContent className="flex items-center justify-between p-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Truck className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">{unit.plate}</p>
                                        <p className="text-sm text-muted-foreground">{unit.brand} {unit.model} - {unit.color}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${unit.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                    {unit.status}
                                </span>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="bateas" className="space-y-4">
                    <div className="flex justify-end mb-4">
                        <Dialog open={bateaModal} onOpenChange={setBateaModal}>
                            <DialogTrigger asChild>
                                <Button onClick={() => { setEditingBateaId(null); setBateaForm({ plate: "", brand: "", model: "", color: "", type: "Platform", status: "Active" }) }}>
                                    <Plus className="mr-2 h-4 w-4" /> {t.fleet.add}
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{editingBateaId ? "Editar Batea" : "Agregar Batea"}</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label>Placa</Label>
                                        <Input value={bateaForm.plate} onChange={e => setBateaForm({ ...bateaForm, plate: e.target.value })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Marca</Label>
                                        <Input value={bateaForm.brand} onChange={e => setBateaForm({ ...bateaForm, brand: e.target.value })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Modelo</Label>
                                        <Input value={bateaForm.model} onChange={e => setBateaForm({ ...bateaForm, model: e.target.value })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Color</Label>
                                        <Input value={bateaForm.color} onChange={e => setBateaForm({ ...bateaForm, color: e.target.value })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Tipo</Label>
                                        <Input value={bateaForm.type} onChange={e => setBateaForm({ ...bateaForm, type: e.target.value })} />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleSaveBatea}>Guardar</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {bateas.map(unit => (
                        <Card key={unit.id} className="relative group">
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" onClick={() => handleEditBatea(unit)}>
                                    <Settings className="h-4 w-4" />
                                </Button>
                            </div>
                            <CardContent className="flex items-center justify-between p-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                                        <span className="font-bold text-xs">TR</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">{unit.plate}</p>
                                        <p className="text-sm text-muted-foreground">{unit.brand} {unit.model} ({unit.type})</p>
                                    </div>
                                </div>
                                <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500">
                                    {unit.status}
                                </span>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    )
}
