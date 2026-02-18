"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/context/language-context"
import { Plus, Search, Building, MapPin, Trash2, Edit2, Settings } from "lucide-react"
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
import { api } from "@/lib/api"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { VENEZUELA_DATA, State, Municipality } from "@/lib/venezuela"

// Types
type Address = {
    id: string
    state: string
    municipality: string
    parish: string
    detail: string
    postalCode: string
    consigneeCode?: string // Added here
    isFiscal: boolean
}

type Client = {
    id: number
    name: string
    rif: string
    clientCode?: string
    // consigneeCode removed from here
    phone: string
    addresses: Address[]
}

export default function ClientsPage() {
    const { t } = useLanguage()

    // Mock Data - Replaced with API Loading
    const [clients, setClients] = useState<Client[]>([])

    // Load Clients from API
    useEffect(() => {
        const loadClients = async () => {
            try {
                const saved = await api.get("clients_data");
                if (saved && Array.isArray(saved) && saved.length > 0) {
                    setClients(saved);
                }
            } catch (e) {
                console.error("Failed to load clients", e);
            }
        };
        loadClients();
    }, []);

    // Form State
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [formData, setFormData] = useState<Omit<Client, 'id' | 'addresses'>>({ name: "", rif: "", phone: "", clientCode: "" })
    const [addresses, setAddresses] = useState<Address[]>([])

    // Address Form State
    const [newAddress, setNewAddress] = useState<Partial<Address>>({})
    const [showAddressForm, setShowAddressForm] = useState(false)

    // Geography Selectors
    const selectedState = useMemo(() => VENEZUELA_DATA.find(s => s.name === newAddress.state), [newAddress.state])
    const selectedMunicipality = useMemo(() => selectedState?.municipalities.find(m => m.name === newAddress.municipality), [selectedState, newAddress.municipality])

    const handleSaveClient = async () => {
        if (!formData.name || !formData.rif) return;

        const clientData = {
            name: formData.name,
            rif: formData.rif,
            phone: formData.phone,
            clientCode: formData.clientCode,
            addresses: addresses
        }

        let updatedClients;
        if (editingId) {
            updatedClients = clients.map(c => c.id === editingId ? { ...c, id: editingId, ...clientData } : c);
        } else {
            const newClient = {
                id: Date.now(), // Use timestamp for unique ID to avoid conflicts
                ...clientData
            };
            updatedClients = [...clients, newClient];
        }

        setClients(updatedClients);
        await api.save("clients_data", updatedClients);

        setIsDialogOpen(false)
        resetForm()
    }

    const handleAddAddress = () => {
        if (!newAddress.state || !newAddress.municipality || !newAddress.parish || !newAddress.detail) return;

        const address: Address = {
            id: `addr-${Date.now()}`,
            state: newAddress.state,
            municipality: newAddress.municipality,
            parish: newAddress.parish,
            detail: newAddress.detail,
            postalCode: newAddress.postalCode || "",
            consigneeCode: newAddress.consigneeCode || "",
            isFiscal: addresses.length === 0 // First address is always fiscal
        }

        setAddresses([...addresses, address])
        setNewAddress({})
        setShowAddressForm(false)
    }

    const handleRemoveAddress = (addressId: string) => {
        const updatedAddresses = addresses.filter(a => a.id !== addressId);
        // If we removed the fiscal address and there are others, make the first one fiscal
        if (addresses.find(a => a.id === addressId)?.isFiscal && updatedAddresses.length > 0) {
            updatedAddresses[0].isFiscal = true;
        }
        setAddresses(updatedAddresses);
    }

    const handleEditClient = (client: Client) => {
        setEditingId(client.id)
        setFormData({ name: client.name, rif: client.rif, phone: client.phone, clientCode: client.clientCode || "" })
        setAddresses(client.addresses) // Load existing addresses
        setIsDialogOpen(true)
    }

    const handleCreateClient = () => {
        setEditingId(null)
        resetForm()
        setIsDialogOpen(true)
    }

    const resetForm = () => {
        setFormData({ name: "", rif: "", phone: "", clientCode: "" })
        setAddresses([])
        setNewAddress({})
        setShowAddressForm(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">{t.clients.title}</h1>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleCreateClient}>
                            <Plus className="mr-2 h-4 w-4" /> {t.clients.add}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingId ? 'Editar Cliente' : 'Agregar Cliente'}</DialogTitle>
                            <DialogDescription>Gestione los datos fiscales y direcciones de entrega.</DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-6 py-4">
                            {/* Basic Info */}
                            <div className="space-y-4 border-b pb-4">
                                <h3 className="font-medium flex items-center gap-2">
                                    <Building className="h-4 w-4" /> Datos Fiscales
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Razón Social</Label>
                                        <Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="rif">RIF</Label>
                                        <Input id="rif" value={formData.rif} onChange={e => setFormData({ ...formData, rif: e.target.value })} />
                                    </div>

                                    {/* NEW FIELDS */}
                                    <div className="space-y-2">
                                        <Label htmlFor="clientCode">Códig. Cliente</Label>
                                        <Input id="clientCode" placeholder="Ej. CLI-001" value={formData.clientCode} onChange={e => setFormData({ ...formData, clientCode: e.target.value })} />
                                    </div>

                                    <div className="space-y-2 col-span-2">
                                        <Label htmlFor="phone">Teléfono de Contacto</Label>
                                        <Input id="phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            {/* Addresses */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-medium flex items-center gap-2">
                                        <MapPin className="h-4 w-4" /> Direcciones de Entrega
                                    </h3>
                                    {!showAddressForm && (
                                        <Button variant="outline" size="sm" onClick={() => setShowAddressForm(true)}>
                                            <Plus className="mr-2 h-3 w-3" /> Agregar Dirección
                                        </Button>
                                    )}
                                </div>

                                {/* Address List */}
                                <div className="space-y-3">
                                    {addresses.map((addr, idx) => (
                                        <div key={addr.id} className="flex items-start justify-between p-3 border rounded-lg bg-muted/20">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-sm">
                                                        {addr.state}, {addr.municipality}
                                                    </span>
                                                    {addr.consigneeCode && (
                                                        <span className="text-[10px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full font-bold">
                                                            {addr.consigneeCode}
                                                        </span>
                                                    )}
                                                    {addr.isFiscal && (
                                                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase">
                                                            Fiscal
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    Parroquia {addr.parish}
                                                </div>
                                                <div className="text-sm mt-1 font-medium">
                                                    {addr.detail}
                                                </div>
                                                {addr.postalCode && <div className="text-xs text-muted-foreground">ZP: {addr.postalCode}</div>}
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleRemoveAddress(addr.id)}>
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                    {addresses.length === 0 && !showAddressForm && (
                                        <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">
                                            No hay direcciones registradas.
                                        </p>
                                    )}
                                </div>

                                {/* Add Address Form */}
                                {showAddressForm && (
                                    <div className="p-4 border rounded-lg bg-muted/30 space-y-4 animate-in fade-in zoom-in-95">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                                <Label>Estado</Label>
                                                <Select value={newAddress.state} onValueChange={(val) => setNewAddress({ ...newAddress, state: val, municipality: "", parish: "" })}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccione Estado" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {VENEZUELA_DATA.map(s => (
                                                            <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Municipio</Label>
                                                <Select
                                                    value={newAddress.municipality}
                                                    onValueChange={(val) => setNewAddress({ ...newAddress, municipality: val, parish: "" })}
                                                    disabled={!newAddress.state}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccione Municipio" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {selectedState?.municipalities.map(m => (
                                                            <SelectItem key={m.name} value={m.name}>{m.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Parroquia</Label>
                                                <Select
                                                    value={newAddress.parish}
                                                    onValueChange={(val) => setNewAddress({ ...newAddress, parish: val })}
                                                    disabled={!newAddress.municipality}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccione Parroquia" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {selectedMunicipality?.parishes.map(p => (
                                                            <SelectItem key={p} value={p}>{p}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Código Postal</Label>
                                                <Input
                                                    placeholder="Ej. 1010"
                                                    value={newAddress.postalCode || ""}
                                                    onChange={e => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2 col-span-2">
                                                <Label>Código Destinatario</Label>
                                                <Input
                                                    placeholder="Ej. DEST-001"
                                                    value={newAddress.consigneeCode || ""}
                                                    onChange={e => setNewAddress({ ...newAddress, consigneeCode: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Detalle de Dirección</Label>
                                            <Input
                                                placeholder="Av. Principal, Edificio, Piso, Oficina..."
                                                value={newAddress.detail || ""}
                                                onChange={e => setNewAddress({ ...newAddress, detail: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex justify-end gap-2 pt-2">
                                            <Button variant="ghost" size="sm" onClick={() => setShowAddressForm(false)}>Cancelar</Button>
                                            <Button size="sm" onClick={handleAddAddress}>Agregar Dirección</Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button onClick={handleSaveClient}>Guardar Cliente</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar cliente..." className="pl-8" />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {clients.map(client => (
                    <Card key={client.id} className="hover:border-primary transition-colors group relative">
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" onClick={() => handleEditClient(client)}>
                                <Settings className="h-4 w-4" />
                            </Button>
                        </div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium leading-none truncate max-w-[180px]" title={client.rif}>
                                {client.rif}
                            </CardTitle>
                            <Building className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold truncate mb-2" title={client.name}>{client.name}</div>

                            <div className="space-y-2 text-sm text-muted-foreground">
                                <div className="flex gap-2 items-center">
                                    <Settings className="h-3 w-3" />
                                    <span>{client.phone}</span>
                                </div>
                                <div className="flex gap-2 items-start">
                                    <MapPin className="h-3 w-3 mt-1 shrink-0" />
                                    <span className="line-clamp-2 text-xs">
                                        {client.addresses?.[0] ? (
                                            <>
                                                {client.addresses[0].state}, {client.addresses[0].municipality}
                                                <br />
                                                <span className="opacity-75">{client.addresses[0].detail}</span>
                                            </>
                                        ) : (
                                            <span className="italic">Sin dirección registrada</span>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
