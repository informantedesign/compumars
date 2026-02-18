"use client"

import { useState } from "react"
import { useSystemSettings } from "@/context/system-settings-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Save, RefreshCw, Trash2, ShieldAlert } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { toast } from "@/components/ui/use-toast"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function SettingsPage() {
    const { settings, updateSettings, isLoading } = useSystemSettings();
    const { t } = useLanguage();

    // Local state for form management
    // We initialize with context but manage changes locally until save
    const [formData, setFormData] = useState(settings);
    const [isSaving, setIsSaving] = useState(false);

    // Sync formData when settings load
    if (isLoading) return <div className="p-8">Cargando configuración...</div>;

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateSettings(formData);
            toast({
                title: "Configuración Guardada",
                description: "Los cambios han sido aplicados correctamente.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "No se pudieron guardar los cambios.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleMaintenanceAction = async (action: string, criteria?: string) => {
        try {
            const res = await fetch('/api/admin/maintenance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, criteria })
            });

            if (res.ok) {
                toast({ title: "Acción Completada", description: "El mantenimiento se realizó con éxito." });
            } else {
                throw new Error("Action failed");
            }
        } catch (error) {
            toast({ title: "Error", description: "Falló la acción de mantenimiento.", variant: "destructive" });
        }
    };

    return (
        <div className="container mx-auto py-8 max-w-5xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Configuración del Sistema</h1>
                    <p className="text-muted-foreground">Administración global de parámetros y mantenimiento.</p>
                </div>
                <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? "Guardando..." : "Guardar Cambios"}
                </Button>
            </div>

            <Tabs defaultValue="identity" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-8">
                    <TabsTrigger value="identity">Identidad Corporativa</TabsTrigger>
                    <TabsTrigger value="counters">Contadores y Numeración</TabsTrigger>
                    <TabsTrigger value="params">Parámetros Generales</TabsTrigger>
                    <TabsTrigger value="maintenance" className="text-red-500 data-[state=active]:text-red-600">Mantenimiento</TabsTrigger>
                </TabsList>

                {/* 1. Identidad Corporativa */}
                <TabsContent value="identity">
                    <Card>
                        <CardHeader>
                            <CardTitle>Datos de la Empresa</CardTitle>
                            <CardDescription>Información que aparecerá en los encabezados de reportes y documentos.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Razón Social / Nombre</Label>
                                    <Input
                                        value={formData.company_name}
                                        onChange={e => setFormData({ ...formData, company_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>RIF / Identificación Fiscal</Label>
                                    <Input
                                        value={formData.rif}
                                        onChange={e => setFormData({ ...formData, rif: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Dirección Fiscal</Label>
                                <Input
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Teléfonos de Contacto</Label>
                                    <Input
                                        value={formData.phone || ""}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+58 ..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Correo Electrónico</Label>
                                    <Input
                                        value={formData.email || ""}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Pie de Página (Reportes)</Label>
                                <Input
                                    value={formData.report_footer || ""}
                                    onChange={e => setFormData({ ...formData, report_footer: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 2. Contadores */}
                <TabsContent value="counters">
                    <Card>
                        <CardHeader>
                            <CardTitle>Numeración de Documentos</CardTitle>
                            <CardDescription>Ajuste el siguiente número correlativo para los documentos del sistema.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-3 gap-6">
                                <div className="space-y-2 p-4 border rounded-lg bg-muted/20">
                                    <Label className="font-bold">Próximo Pedido (Int)</Label>
                                    <div className="text-xs text-muted-foreground mb-2">Prefijo: PED-</div>
                                    <Input
                                        type="number"
                                        value={formData.next_order_number || 1}
                                        onChange={e => setFormData({ ...formData, next_order_number: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2 p-4 border rounded-lg bg-muted/20">
                                    <Label className="font-bold">Próxima Guía</Label>
                                    <div className="text-xs text-muted-foreground mb-2">Prefijo: GT-</div>
                                    <Input
                                        type="number"
                                        value={formData.next_guide_number || 1}
                                        onChange={e => setFormData({ ...formData, next_guide_number: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2 p-4 border rounded-lg bg-muted/20">
                                    <Label className="font-bold">Próxima Nota Entrega</Label>
                                    <div className="text-xs text-muted-foreground mb-2">Prefijo: NE-</div>
                                    <Input
                                        type="number"
                                        value={formData.next_delivery_note_number || 1}
                                        onChange={e => setFormData({ ...formData, next_delivery_note_number: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 3. Parámetros Generales */}
                <TabsContent value="params">
                    <Card>
                        <CardHeader>
                            <CardTitle>Parámetros Financieros y Globales</CardTitle>
                            <CardDescription>Ajustes de cálculo y comportamiento general.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <Label className="text-base">Tasa de Cambio (Referencial)</Label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-bold">Bs.</span>
                                        <Input
                                            type="number"
                                            className="text-2xl font-mono h-12 w-48"
                                            value={formData.current_exchange_rate}
                                            onChange={e => setFormData({ ...formData, current_exchange_rate: parseFloat(e.target.value) })}
                                        />
                                        <span className="text-muted-foreground">/ USD</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <Label className="text-base">Impuesto al Valor Agregado (IVA)</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            className="text-2xl font-mono h-12 w-32"
                                            value={formData.current_iva || 16}
                                            onChange={e => setFormData({ ...formData, current_iva: parseFloat(e.target.value) })}
                                        />
                                        <span className="text-lg font-bold">%</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 4. Mantenimiento */}
                <TabsContent value="maintenance">
                    <Card className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20">
                        <CardHeader>
                            <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
                                <ShieldAlert className="h-5 w-5" /> Zona de Mantenimiento
                            </CardTitle>
                            <CardDescription className="text-red-600/80">Acciones destructivas e irreversibles.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            {/* Batch Delete */}
                            <div className="flex items-center justify-between p-4 bg-background border rounded-lg">
                                <div>
                                    <h4 className="font-bold flex items-center gap-2"><Trash2 className="h-4 w-4" /> Limpiar Cancelados</h4>
                                    <p className="text-sm text-muted-foreground">Elimina permanentemente solo los pedidos con estatus 'Cancelado'.</p>
                                </div>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">Ejecutar Limpieza</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>¿Eliminar pedidos cancelados?</AlertDialogTitle>
                                            <AlertDialogDescription>Esta acción no se puede deshacer. Se borrarán todos los registros marcados como cancelados.</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => handleMaintenanceAction('batch_delete', 'status_cancelled')}>Confirmar Eliminación</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>

                            {/* Reset All */}
                            <div className="flex items-center justify-between p-4 bg-background border rounded-lg border-red-500/20">
                                <div>
                                    <h4 className="font-bold text-red-600 flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Reseteo de Fábrica (Transaccional)</h4>
                                    <p className="text-sm text-muted-foreground">Elimina TODOS los pedidos, guías e historial. <br /> Mantiene clientes, productos y choferes.</p>
                                </div>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive">Reiniciar Sistema</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="text-red-600">¿ESTÁS ABSOLUTAMENTE SEGURO?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Esta acción borrará <strong>TODA LA ACTIVIDAD DE PEDIDOS</strong> de la base de datos.<br /><br />
                                                El sistema volverá al pedido #1. Los datos de clientes y choferes NO serán borrados.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction className="bg-red-600 hover:bg-red-700 font-bold" onClick={() => handleMaintenanceAction('reset_orders')}>
                                                SÍ, BORRAR TODO
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>

                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
