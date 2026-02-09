"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/context/language-context"
import { Plus, Search, User, Truck, Building2 } from "lucide-react"
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

export default function DriversPage() {
    const { t } = useLanguage()

    // Data State
    const [drivers, setDrivers] = useState([
        { id: 1, name: "Pedro Perez", cedula: "V-15.223.111", license: "5ta", status: "Active" },
        { id: 2, name: "Juan Rodriguez", cedula: "V-12.998.222", license: "5ta", status: "Active" },
        { id: 3, name: "Carlos Mendez", cedula: "V-20.111.999", license: "5ta", status: "On Leave" },
    ])

    const [transporters, setTransporters] = useState([
        { id: 0, name: "INDEPENDIENTES", rif: "J-00000000-0", contact: "N/A", phone: "N/A", type: "Genérico" },
        { id: 1, name: "Transportes Los Andes", rif: "J-30123456-0", contact: "Sr. Luis", phone: "0414-1112222", type: "Empresa" },
        { id: 2, name: "Logística Central", rif: "J-40987654-1", contact: "Sra. Ana", phone: "0424-3334444", type: "Cooperativa" },
    ])

    // Edit State
    const [driverModal, setDriverModal] = useState(false)
    const [transporterModal, setTransporterModal] = useState(false)
    const [editingDriverId, setEditingDriverId] = useState<number | null>(null)
    const [editingTransporterId, setEditingTransporterId] = useState<number | null>(null)

    // Forms
    const [driverForm, setDriverForm] = useState({ name: "", cedula: "", license: "5ta" })
    const [transporterForm, setTransporterForm] = useState({ name: "", rif: "", contact: "", phone: "", type: "Empresa" })

    // Driver Handlers
    const handleEditDriver = (driver: any) => {
        setEditingDriverId(driver.id)
        setDriverForm(driver)
        setDriverModal(true)
    }

    const handleSaveDriver = () => {
        if (editingDriverId) {
            setDrivers(drivers.map(d => d.id === editingDriverId ? { ...d, ...driverForm } : d))
        } else {
            setDrivers([...drivers, { id: Date.now(), ...driverForm, status: "Active" }])
        }
        setDriverModal(false)
    }

    // Transporter Handlers
    const handleEditTransporter = (transporter: any) => {
        if (transporter.id === 0) return; // Prevent editing INDEPENDIENTES
        setEditingTransporterId(transporter.id)
        setTransporterForm(transporter)
        setTransporterModal(true)
    }

    const handleSaveTransporter = () => {
        if (editingTransporterId) {
            setTransporters(transporters.map(t => t.id === editingTransporterId ? { ...t, ...transporterForm } : t))
        } else {
            setTransporters([...transporters, { id: Date.now(), ...transporterForm }])
        }
        setTransporterModal(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">{t.drivers.title}</h1>
            </div>

            <Tabs defaultValue="choferes" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="choferes" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Choferes
                    </TabsTrigger>
                    <TabsTrigger value="transportistas" className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Transportistas
                    </TabsTrigger>
                </TabsList>

                {/* CHOFERES TAB */}
                <TabsContent value="choferes" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Buscar chofer..." className="pl-8" />
                        </div>

                        <Dialog open={driverModal} onOpenChange={setDriverModal}>
                            <DialogTrigger asChild>
                                <Button onClick={() => { setEditingDriverId(null); setDriverForm({ name: "", cedula: "", license: "5ta" }) }}>
                                    <Plus className="mr-2 h-4 w-4" /> {t.drivers.add}
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{editingDriverId ? "Editar Chofer" : "Agregar Chofer"}</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label>Nombre Completo</Label>
                                        <Input value={driverForm.name} onChange={e => setDriverForm({ ...driverForm, name: e.target.value })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Cédula</Label>
                                        <Input value={driverForm.cedula} onChange={e => setDriverForm({ ...driverForm, cedula: e.target.value })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Licencia</Label>
                                        <Input value={driverForm.license} onChange={e => setDriverForm({ ...driverForm, license: e.target.value })} />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleSaveDriver}>Guardar</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {drivers.map(driver => (
                            <Card key={driver.id} className="hover:border-primary transition-colors group relative">
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" onClick={() => handleEditDriver(driver)}>
                                        <Settings className="h-4 w-4" />
                                    </Button>
                                </div>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {driver.cedula}
                                    </CardTitle>
                                    <User className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{driver.name}</div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500 ring-1 ring-inset ring-green-500/20">
                                            Licencia: {driver.license}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* TRANSPORTISTAS TAB */}
                <TabsContent value="transportistas" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Buscar transportista..." className="pl-8" />
                        </div>

                        <Dialog open={transporterModal} onOpenChange={setTransporterModal}>
                            <DialogTrigger asChild>
                                <Button onClick={() => { setEditingTransporterId(null); setTransporterForm({ name: "", rif: "", contact: "", phone: "", type: "Empresa" }) }}>
                                    <Plus className="mr-2 h-4 w-4" /> Agregar Transportista
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{editingTransporterId ? "Editar Transportista" : "Agregar Transportista"}</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label>Razón Social</Label>
                                        <Input value={transporterForm.name} onChange={e => setTransporterForm({ ...transporterForm, name: e.target.value })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>RIF</Label>
                                        <Input value={transporterForm.rif} onChange={e => setTransporterForm({ ...transporterForm, rif: e.target.value })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Contacto</Label>
                                        <Input value={transporterForm.contact} onChange={e => setTransporterForm({ ...transporterForm, contact: e.target.value })} />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleSaveTransporter}>Guardar</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {transporters.map((transporter, index) => (
                            <Card key={transporter.id} className={`transition-colors hover:border-primary group relative ${index === 0 ? 'border-l-4 border-l-primary bg-primary/5' : ''}`}>
                                {index !== 0 && (
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" onClick={() => handleEditTransporter(transporter)}>
                                            <Settings className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {transporter.rif}
                                    </CardTitle>
                                    <Building2 className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-xl font-bold truncate" title={transporter.name}>{transporter.name}</div>
                                    <div className="space-y-1 mt-2 text-sm text-muted-foreground">
                                        <div className="flex justify-between">
                                            <span>Tipo:</span>
                                            <span className="font-medium text-foreground">{transporter.type}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Contacto:</span>
                                            <span className="font-medium text-foreground">{transporter.contact}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
