"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
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
import { Checkbox } from "@/components/ui/checkbox"
import { PlusCircle, Search, Trash2, Pencil, Shield, User, Lock, Phone } from "lucide-react"

// Types
type UserRole = "SuperAdmin" | "Admin" | "Viewer" | "Operador"

type UserPermission = "dashboard" | "orders" | "fleet" | "clients" | "products" | "users" | "reports" | "finance"

interface AppUser {
    id: string
    name: string
    username: string
    role: UserRole
    phone?: string
    position?: string
    status: "Active" | "Inactive"
    permissions: UserPermission[]
    password?: string
}

// Mock Data
const MOCK_USERS: AppUser[] = [
    {
        id: "USR-001",
        name: "Michael Design",
        username: "admin",
        role: "SuperAdmin",
        phone: "0414-1234567",
        position: "Diseñador de Sistema",
        status: "Active",
        permissions: ["dashboard", "orders", "fleet", "clients", "products", "users", "reports", "finance"]
    },
    {
        id: "USR-002",
        name: "Operador Logístico",
        username: "operador",
        role: "Operador",
        phone: "0424-9876543",
        position: "Analista de Tráfico",
        status: "Active",
        permissions: ["dashboard", "orders", "fleet"]
    }
]

const MODULES: { id: UserPermission; label: string }[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "orders", label: "Pedidos y Despacho" },
    { id: "fleet", label: "Gestión de Flota" },
    { id: "clients", label: "Clientes" },
    { id: "products", label: "Productos y Plantas" },
    { id: "users", label: "Usuarios y Seguridad" },
    { id: "reports", label: "Reportes" },
    { id: "finance", label: "Finanzas" },
]

export default function UsersPage() {
    const [users, setUsers] = useState<AppUser[]>(MOCK_USERS)
    const [searchTerm, setSearchTerm] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<AppUser | null>(null)

    // Form State
    const [formData, setFormData] = useState<Partial<AppUser>>({
        permissions: []
    })

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleOpenDialog = (user?: AppUser) => {
        if (user) {
            setEditingUser(user)
            setFormData({ ...user })
        } else {
            setEditingUser(null)
            setFormData({
                status: "Active",
                role: "Operador",
                permissions: []
            })
        }
        setIsDialogOpen(true)
    }

    const handleSaveUser = () => {
        if (!formData.name || !formData.username || !formData.role) return

        if (editingUser) {
            setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } as AppUser : u))
        } else {
            const newUser: AppUser = {
                ...formData as AppUser,
                id: `USR-${Math.floor(Math.random() * 1000)}`,
                status: formData.status || "Active",
                permissions: formData.permissions || []
            }
            setUsers([...users, newUser])
        }
        setIsDialogOpen(false)
    }

    const handleDeleteUser = (id: string) => {
        if (confirm("¿Está seguro de eliminar este usuario?")) {
            setUsers(users.filter(u => u.id !== id))
        }
    }

    const togglePermission = (moduleId: UserPermission) => {
        const currentPermissions = formData.permissions || []
        if (currentPermissions.includes(moduleId)) {
            setFormData({ ...formData, permissions: currentPermissions.filter(p => p !== moduleId) })
        } else {
            setFormData({ ...formData, permissions: [...currentPermissions, moduleId] })
        }
    }

    const handleRoleChange = (role: UserRole) => {
        let newPermissions: UserPermission[] = []

        switch (role) {
            case "SuperAdmin":
                newPermissions = MODULES.map(m => m.id)
                break
            case "Admin":
                newPermissions = MODULES.map(m => m.id).filter(id => id !== "users")
                break
            case "Viewer":
                newPermissions = ["dashboard", "reports"]
                break
            default:
                newPermissions = ["dashboard", "orders"]
        }

        setFormData({ ...formData, role, permissions: newPermissions })
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
                    <p className="text-muted-foreground">Administración de acceso y seguridad del sistema.</p>
                </div>
                <Button onClick={() => handleOpenDialog()}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Usuario
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Usuarios del Sistema</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar usuarios..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Usuario</TableHead>
                                <TableHead>Rol</TableHead>
                                <TableHead>Cargo</TableHead>
                                <TableHead>Teléfono</TableHead>
                                <TableHead>Estatus</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {user.name.charAt(0)}
                                            </div>
                                            {user.name}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">{user.username}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.role === 'SuperAdmin' ? 'bg-purple-100 text-purple-800' :
                                            user.role === 'Admin' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </TableCell>
                                    <TableCell>{user.position || "-"}</TableCell>
                                    <TableCell>{user.phone || "-"}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {user.status === 'Active' ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(user)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteUser(user.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingUser ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
                        <DialogDescription>
                            Configure los datos personales y permisos de acceso del usuario.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Nombre Completo</Label>
                                <Input
                                    value={formData.name || ""}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ej. Juan Perez"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Nombre de Usuario</Label>
                                <Input
                                    value={formData.username || ""}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    placeholder="Ej. jperez"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Cargo / Posición</Label>
                                <Input
                                    value={formData.position || ""}
                                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                    placeholder="Ej. Analista de Tráfico"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Teléfono</Label>
                                <Input
                                    value={formData.phone || ""}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="0414-0000000"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-t pt-4">
                            <div className="space-y-2">
                                <Label>Contraseña</Label>
                                <div className="relative">
                                    <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        className="pl-9"
                                        placeholder="Min. 6 caracteres"
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Rol del Sistema</Label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(val) => handleRoleChange(val as UserRole)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione Rol" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="SuperAdmin">SuperAdmin (Acceso Total)</SelectItem>
                                        <SelectItem value="Admin">Administrador</SelectItem>
                                        <SelectItem value="Operador">Operador</SelectItem>
                                        <SelectItem value="Viewer">Visualizador</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-t pt-4">
                            <div className="space-y-2">
                                <Label>Estatus</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(val) => setFormData({ ...formData, status: val as any })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">Activo</SelectItem>
                                        <SelectItem value="Inactive">Inactivo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-3 border-t pt-4">
                            <Label className="flex items-center gap-2">
                                <Shield className="h-4 w-4" /> Permisos de Acceso
                            </Label>
                            <div className="grid grid-cols-2 gap-3 p-4 bg-muted/30 rounded-lg">
                                {MODULES.map((module) => (
                                    <div key={module.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`perm-${module.id}`}
                                            checked={formData.permissions?.includes(module.id)}
                                            onCheckedChange={() => togglePermission(module.id)}
                                            disabled={formData.role === 'SuperAdmin'} // SuperAdmin always has all
                                        />
                                        <label
                                            htmlFor={`perm-${module.id}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {module.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSaveUser}>Guardar Usuario</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
