"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import RichTextEditor from '@/components/report-builder/RichTextEditor'
import { Eye, Save, Plus, Trash2, Printer, Code, RotateCcw } from 'lucide-react'
import {
    DEFAULT_AUTHORIZATION_TEMPLATE,
    DEFAULT_DELIVERY_TEMPLATE,
    DEFAULT_TRANSFER_GUIDE_TEMPLATE
} from '@/lib/report-templates'

// --- Types ---
interface Template {
    id: string
    name: string
    type: 'ORDER' | 'REGUIA' | 'INVOICE' | 'AUTHORIZATION' | 'DELIVERY' | 'TRANSFER' | 'COMBINED'
    html_content: string
    is_active: boolean
}

const DATA_DICTIONARY = {
    "Datos del Chofer": [
        { label: "Nombre Chofer", variable: "{{DRIVER_NAME}}" },
        { label: "Cédula", variable: "{{DRIVER_ID}}" }, // Capitalized based on template usage
        { label: "Teléfono", variable: "{{DRIVER_PHONE}}" },
    ],
    "Datos del Vehículo (Chuto)": [
        { label: "Placa Chuto", variable: "{{TRUCK_PLATE}}" },
        { label: "Marca Chuto", variable: "{{TRUCK_BRAND}}" },
        { label: "Modelo Chuto", variable: "{{TRUCK_MODEL}}" },
        { label: "Color Chuto", variable: "{{TRUCK_COLOR}}" },
        { label: "Tipo Chuto", variable: "{{TRUCK_TYPE}}" },
    ],
    "Datos del Vehículo (Batea)": [
        { label: "Placa Batea", variable: "{{TRAILER_PLATE}}" },
        { label: "Marca Batea", variable: "{{TRAILER_BRAND}}" },
        { label: "Modelo Batea", variable: "{{TRAILER_MODEL}}" },
        { label: "Color Batea", variable: "{{TRAILER_COLOR}}" },
        { label: "Tipo Batea", variable: "{{TRAILER_TYPE}}" },
    ],
    "Datos Financieros": [
        { label: "Ganancia Total", variable: "{{TOTAL_PROFIT}}" },
        { label: "Costo Flete", variable: "{{FREIGHT_COST}}" },
        { label: "Precio Venta", variable: "{{SELLING_PRICE}}" },
        { label: "Costo Planta", variable: "{{PLANT_COST}}" },
    ],
    "Detalles de Carga": [
        { label: "N° Pedido", variable: "{{PLANT_ORDER_NO}}" },
        { label: "Producto", variable: "{{PRODUCT_NAME}}" },
        { label: "Cantidad", variable: "{{QUANTITY}}" },
        { label: "Cant. Valor", variable: "{{QUANTITY_VAL}}" },
        { label: "Cant. Unidad", variable: "{{QUANTITY_UNIT}}" },
        { label: "Origen (Planta)", variable: "{{ORIGIN}}" },
        { label: "Dir. Planta", variable: "{{ORIGIN_ADDRESS}}" },
        { label: "Ruta", variable: "{{ROUTE}}" },
        { label: "Fecha", variable: "{{DATE}}" },
    ],
    "Cliente / Destino": [
        { label: "Cliente", variable: "{{CLIENT_NAME}}" },
        { label: "RIF Cliente", variable: "{{CLIENT_RIF}}" },
        { label: "Telf Cliente", variable: "{{CLIENT_PHONE}}" },
        { label: "Dirección Destino", variable: "{{DESTINATION_ADDRESS}}" },
        { label: "Contacto Sitio", variable: "{{SITE_CONTACT_NAME}}" },
        { label: "Telf Sitio", variable: "{{SITE_CONTACT_PHONE}}" },
    ],
    "Empresa / Configuración": [
        { label: "Nombre Empresa", variable: "{{COMPANY_NAME}}" },
        { label: "RIF Empresa", variable: "{{COMPANY_RIF}}" },
        { label: "Emisor Nombre", variable: "{{ISSUER_NAME}}" },
        { label: "Emisor Cargo", variable: "{{ISSUER_ROLE}}" },
        { label: "Emisor ID", variable: "{{ISSUER_ID}}" },
        { label: "Teléfono Contacto", variable: "{{CONTACT_PHONE}}" },
        { label: "Usuario Sistema", variable: "{{USER_NAME}}" },
        { label: "Rol Usuario", variable: "{{USER_ROLE}}" },
    ]
}

const MOCK_DATA = {
    DRIVER_NAME: "JUAN PEREZ",
    DRIVER_ID: "V-12.345.678",
    DRIVER_PHONE: "0414-1234567",

    TRUCK_PLATE: "A11-BC2",
    TRUCK_BRAND: "MACK",
    TRUCK_MODEL: "GRANITE",
    TRUCK_COLOR: "BLANCO",
    TRUCK_TYPE: "CHUTO",

    TRAILER_PLATE: "R-998877",
    TRAILER_BRAND: "TAZA",
    TRAILER_MODEL: "PLATAFORMA",
    TRAILER_COLOR: "GRIS",
    TRAILER_TYPE: "REMOLQUE",

    TOTAL_PROFIT: "$ 1,250.00",
    FREIGHT_COST: "$ 450.00",
    SELLING_PRICE: "$ 55.00",
    PLANT_COST: "$ 42.00",

    PLANT_ORDER_NO: "ORD-2026-001",
    PRODUCT_NAME: "CEMENTO GRIS TIPO I",
    QUANTITY: "30 TONELADAS",
    QUANTITY_VAL: "30",
    QUANTITY_UNIT: "TON",
    ORIGIN: "PLANTA PERTIGALETE",
    ORIGIN_ADDRESS: "SECTOR EL BOSQUE, GUANTA, EDO. ANZOATEGUI",
    ROUTE: "PERTIGALETE -> CARACAS",
    DATE: new Date().toLocaleDateString(),

    CLIENT_NAME: "CONSTRUCTORA MODELO C.A.",
    CLIENT_RIF: "J-12345678-9",
    CLIENT_PHONE: "0212-5555555",
    DESTINATION_ADDRESS: "AV. PRINCIPAL, TORRE EMPRESARIAL, CARACAS",
    SITE_CONTACT_NAME: "ING. ROBERTO GOMEZ",
    SITE_CONTACT_PHONE: "0414-0001122",

    COMPANY_NAME: "CONSTRUFANB C.A",
    COMPANY_RIF: "G-20010851-7",
    ISSUER_NAME: "OMARIS ASTRID SANCHEZ",
    ISSUER_ROLE: "GERENTE DE COMERCIALIZACIÓN",
    ISSUER_ID: "V-15.293.986",
    CONTACT_PHONE: "04120527421",

    USER_NAME: "ADMINISTRADOR SISTEMA",
    USER_ROLE: "SUPER ADMIN"
}



export default function ReportBuilderPage() {
    const [templates, setTemplates] = useState<Template[]>([])
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
    const [currentTemplate, setCurrentTemplate] = useState<Partial<Template>>({
        name: 'Nuevo Reporte',
        type: 'ORDER',
        html_content: '<p>Comience a diseñar su reporte aquí...</p>',
        is_active: true
    })
    const [previewHtml, setPreviewHtml] = useState('')
    const [loading, setLoading] = useState(true)

    // Fetch Templates
    useEffect(() => {
        fetchTemplates()
    }, [])

    const fetchTemplates = async () => {
        try {
            const res = await fetch('/api/report-templates')
            const data = await res.json()
            if (Array.isArray(data)) {
                setTemplates(data)
                if (data.length > 0 && !selectedTemplateId) {
                    // Optional: Select first by default
                    // setSelectedTemplateId(data[0].id)
                    // handleSelectTemplate(data[0].id)
                }
            }
        } catch (error) {
            console.error("Error fetching templates:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSelectTemplate = (id: string) => {
        if (id === 'new') {
            setSelectedTemplateId('new')
            setCurrentTemplate({
                name: 'Nuevo Reporte',
                type: 'ORDER',
                html_content: '<p>Comience a diseñar su reporte aquí...</p>',
                is_active: true
            })
            return
        }
        const t = templates.find(temp => temp.id === id)
        if (t) {
            setSelectedTemplateId(id)
            setCurrentTemplate({ ...t })
        }
    }

    const handleSave = async () => {
        if (!currentTemplate.name || !currentTemplate.html_content) {
            alert("Por favor complete el nombre y el contenido")
            return
        }

        try {
            const method = selectedTemplateId && selectedTemplateId !== 'new' ? 'PUT' : 'POST'
            const url = selectedTemplateId && selectedTemplateId !== 'new'
                ? `/api/report-templates/${selectedTemplateId}`
                : '/api/report-templates'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentTemplate)
            })

            if (res.ok) {
                alert("Guardado exitosamente")
                fetchTemplates()
                if (method === 'POST') {
                    const newTemp = await res.json()
                    setSelectedTemplateId(newTemp.id)
                }
            } else {
                alert("Error al guardar")
            }
        } catch (e) {
            console.error(e)
            alert("Error de conexión")
        }
    }

    const handleDelete = async () => {
        if (!selectedTemplateId || selectedTemplateId === 'new') return
        if (!confirm("¿Está seguro de eliminar este reporte?")) return

        try {
            const res = await fetch(`/api/report-templates/${selectedTemplateId}`, {
                method: 'DELETE'
            })
            if (res.ok) {
                alert("Reporte eliminado")
                fetchTemplates()
                setSelectedTemplateId(null)
                setCurrentTemplate({
                    name: 'Nuevo Reporte',
                    type: 'ORDER',
                    html_content: '<p>Comience a diseñar su reporte aquí...</p>',
                    is_active: true
                })
            }
        } catch (e) {
            console.error(e)
        }
    }

    const handleSeed = async () => {
        if (!confirm("¿Desea restaurar las plantillas por defecto? Esto agregará las plantillas base si no existen.")) return;
        try {
            setLoading(true);
            const res = await fetch('/api/report-templates/seed');
            const data = await res.json();
            alert(data.message || "Proceso completado");
            fetchTemplates();
        } catch (error) {
            console.error(error);
            alert("Error al restaurar plantillas");
        } finally {
            setLoading(false);
        }
    }

    const generatePreview = () => {
        let html = currentTemplate.html_content || ''
        // Simple Replacement
        Object.entries(MOCK_DATA).forEach(([key, value]) => {
            const regex = new RegExp(`{{${key}}}`, 'g')
            html = html.replace(regex, value)
        })
        setPreviewHtml(html)
    }

    // Helper to copy variable
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        // You could add a toast here
        alert(`Variable ${text} copiada!`)
    }

    return (
        <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden p-6 gap-4">

            {/* HEADER */}
            <div className="flex justify-between items-center shrink-0 border-b border-border pb-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                        Constructor de Reportes
                    </h1>
                    <p className="text-muted-foreground text-sm">Diseñe sus guías y facturas dinámicamente</p>
                </div>

                <div className="flex items-center gap-3">
                    <Select
                        value={selectedTemplateId || ''}
                        onValueChange={handleSelectTemplate}
                    >
                        <SelectTrigger className="w-[250px]">
                            <SelectValue placeholder="Seleccionar Plantilla" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="new">-- Nueva Plantilla --</SelectItem>
                            {templates.map(t => (
                                <SelectItem key={t.id} value={t.id}>{t.name} ({t.type})</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-950" onClick={generatePreview}>
                                <Eye className="w-4 h-4 mr-2" /> Vista Previa
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[800px] h-[80vh] flex flex-col bg-white text-black p-0 overflow-hidden">
                            <DialogHeader className="p-4 border-b shrink-0">
                                <DialogTitle>Vista Previa de Impresión</DialogTitle>
                            </DialogHeader>
                            <div className="flex-1 overflow-auto p-8 bg-gray-100">
                                <div
                                    className="bg-white shadow-lg mx-auto min-h-[1000px] w-full max-w-[210mm] p-[10mm]"
                                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                                />
                            </div>
                            <div className="p-4 border-t flex justify-end gap-2 bg-gray-50 shrink-0">
                                <Button onClick={() => window.print()}>Imprimir</Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                        <Save className="w-4 h-4 mr-2" /> Guardar
                    </Button>

                    {selectedTemplateId && selectedTemplateId !== 'new' && (
                        <Button variant="destructive" size="icon" onClick={handleDelete}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    )}
                    <Button variant="ghost" onClick={handleSeed} title="Restaurar plantillas por defecto">
                        <RotateCcw className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* OPTIONS BAR */}
            <div className="flex gap-4 items-end shrink-0 bg-zinc-900/50 p-3 rounded-lg border border-white/5">
                <div className="grid gap-1.5 w-full max-w-sm">
                    <Label>Nombre del Reporte</Label>
                    <Input
                        value={currentTemplate.name || ''}
                        onChange={e => setCurrentTemplate({ ...currentTemplate, name: e.target.value })}
                        className="bg-zinc-950 border-zinc-700 text-white"
                    />
                </div>
                <div className="grid gap-1.5 w-[200px]">
                    <Label>Tipo de Documento</Label>
                    <Select
                        value={currentTemplate.type || 'AUTHORIZATION'}
                        onValueChange={(v: any) => {
                            // Validar si cambiamos el contenido
                            const defaults: Record<string, string> = {
                                'AUTHORIZATION': DEFAULT_AUTHORIZATION_TEMPLATE,
                                'DELIVERY': DEFAULT_DELIVERY_TEMPLATE,
                                'TRANSFER': DEFAULT_TRANSFER_GUIDE_TEMPLATE,
                                'COMBINED': `${DEFAULT_AUTHORIZATION_TEMPLATE}<div style="page-break-before: always;"></div>${DEFAULT_DELIVERY_TEMPLATE}`,
                                'INVOICE': '<p><strong>FACTURA / RELACIÓN</strong><br>Diseñe su formato aquí...</p>',
                                'ORDER': '<p>Guía de Carga Genérica</p>',
                                'REGUIA': '<p>Reguía Genérica</p>'
                            };

                            let newContent = currentTemplate.html_content;
                            const isNew = !selectedTemplateId || selectedTemplateId === 'new';
                            const isEmpty = !currentTemplate.html_content || currentTemplate.html_content === '<p>Comience a diseñar su reporte aquí...</p>';

                            if (defaults[v]) {
                                // Auto-replace if new, empty, or user confirms
                                if (isNew && isEmpty) {
                                    newContent = defaults[v];
                                } else if (confirm("¿Desea cargar la plantilla por defecto para este tipo? Esto reemplazará el contenido actual.")) {
                                    newContent = defaults[v];
                                }
                            }

                            setCurrentTemplate({ ...currentTemplate, type: v, html_content: newContent });
                        }}
                    >
                        <SelectTrigger className="bg-zinc-950 border-zinc-700">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                            <SelectItem value="COMBINED">Imprimir Todo (Paquete Completo)</SelectItem>
                            <SelectItem value="AUTHORIZATION">Solo Autorización de Carga</SelectItem>
                            <SelectItem value="DELIVERY">Solo Nota de Entrega</SelectItem>
                            <SelectItem value="TRANSFER">Guía de Traslado (Ministerio)</SelectItem>
                            <SelectItem value="INVOICE">Factura / Relación</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* MAIN EDITOR AREA (SPLIT VIEW) */}
            <div className="flex-1 flex gap-6 overflow-hidden min-h-0">

                {/* LEFT: EDITOR */}
                <div className="flex-1 flex flex-col min-h-0">
                    <RichTextEditor
                        content={currentTemplate.html_content || ''}
                        onChange={(html) => setCurrentTemplate({ ...currentTemplate, html_content: html })}
                    />
                </div>

                {/* RIGHT: DATA DICTIONARY */}
                <Card className="w-[300px] h-full bg-zinc-900 border-zinc-800 flex flex-col shrink-0">
                    <CardHeader className="pb-2 pt-4 px-4">
                        <CardTitle className="text-sm font-medium text-zinc-400">Diccionario de Datos</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-clip p-0">
                        <ScrollArea className="h-full px-4 pb-4">
                            <div className="grid gap-6">
                                {Object.entries(DATA_DICTIONARY).map(([section, items]) => (
                                    <div key={section}>
                                        <h4 className="text-xs font-semibold text-cyan-500 mb-2 uppercase tracking-wider">{section}</h4>
                                        <div className="grid gap-2">
                                            {items.map((item) => (
                                                <button
                                                    key={item.variable}
                                                    onClick={() => copyToClipboard(item.variable)}
                                                    className="text-left text-sm p-2 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-colors flex justify-between group"
                                                    title="Clic para copiar"
                                                >
                                                    <span className="text-zinc-300">{item.label}</span>
                                                    <code className="text-[10px] bg-black px-1 rounded text-green-500 opacity-50 group-hover:opacity-100">{item.variable}</code>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>

        </div>
    )
}
