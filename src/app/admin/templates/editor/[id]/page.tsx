"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import RichTextEditor from '@/components/report-builder/RichTextEditor'
import { ArrowLeft, Save, Eye, LayoutTemplate, Settings } from 'lucide-react'
import Link from 'next/link'
import {
    DEFAULT_AUTHORIZATION_TEMPLATE,
    DEFAULT_DELIVERY_TEMPLATE,
    DEFAULT_TRANSFER_GUIDE_TEMPLATE
} from '@/lib/report-templates'

// Mock Data for Preview
const MOCK_DATA: any = {
    // Dates
    "{{DATE}}": new Date().toLocaleDateString(),
    "{{TIME}}": new Date().toLocaleTimeString(),

    // Client / Destination
    "{{CLIENT_NAME}}": "CONSTRUCTORA EL BOSQUE C.A.",
    "{{CLIENT_RIF}}": "J-12345678-9",
    "{{CLIENT_PHONE}}": "(0414) 123-4567",
    "{{DESTINATION_ADDRESS}}": "AV. PRINCIPAL, TORRE A, PISO 5, OFICINA 5-B",
    "{{SITE_CONTACT_NAME}}": "ING. ROBERTO GOMEZ",
    "{{SITE_CONTACT_PHONE}}": "0414-0001122",

    // Driver / Fleet
    "{{DRIVER_NAME}}": "JOSE GREGORIO PEREZ",
    "{{DRIVER_ID}}": "V-15.345.678",
    "{{DRIVER_PHONE}}": "0412-555-5555",
    "{{TRUCK_PLATE}}": "A12BC34",
    "{{TRUCK_BRAND}}": "MACK",
    "{{TRUCK_MODEL}}": "GRANITE",
    "{{TRUCK_COLOR}}": "BLANCO",
    "{{TRAILER_PLATE}}": "B98DF76",
    "{{TRAILER_MODEL}}": "REMOLQUE 3 EJES",
    "{{TRAILER_COLOR}}": "ROJO",

    // Cargo
    "{{PRODUCT_NAME}}": "CEMENTO GRIS TIPO I (GRANEL)",
    "{{QUANTITY}}": "30.00",
    "{{QUANTITY_UNIT}}": "TON",
    "{{PLANT_ORDER_NO}}": "ORD-2024-001",
    "{{ORIGIN_ADDRESS}}": "SECTOR EL BOSQUE, GUANTA, EDO. ANZOATEGUI",

    // Issuer
    "{{ISSUER_NAME}}": "MARIA RODRIGUEZ",
    "{{ISSUER_ID}}": "V-10.111.222",
    "{{ISSUER_ROLE}}": "JEFE DE DESPACHO",
    "{{COMPANY_NAME}}": "TRANSPORTE Y LOGISTICA C.A.",
    "{{COMPANY_RIF}}": "J-98765432-1",
    "{{CONTACT_PHONE}}": "0212-555-9999",
    "{{USER_NAME}}": "ADMINISTRADOR SISTEMA",
    "{{USER_ROLE}}": "SUPER ADMIN"
}

export default function DocumentStudioPage() {
    const params = useParams()
    const router = useRouter()
    const id = params?.id as string
    const isNew = id === 'new'

    const [loading, setLoading] = useState(!isNew)
    const [template, setTemplate] = useState<{
        id?: string
        name: string
        type: string
        category: string
        html_content: string
        preview_image_url?: string
    }>({
        name: "Nuevo Documento",
        type: 'AUTHORIZATION',
        category: 'FORMATO_LEGAL',
        html_content: isNew ? DEFAULT_AUTHORIZATION_TEMPLATE : ''
    })

    const [mode, setMode] = useState<'edit' | 'preview'>('edit')
    const [previewContent, setPreviewContent] = useState('')

    useEffect(() => {
        if (!isNew && id) {
            fetchTemplate(id)
        }
    }, [id])

    useEffect(() => {
        if (mode === 'preview') {
            generatePreview()
        }
    }, [mode, template.html_content])

    const fetchTemplate = async (templateId: string) => {
        try {
            const res = await fetch(`/api/report-templates/${templateId}`, { cache: 'no-store' })
            if (res.ok) {
                const data = await res.json()
                setTemplate(data)
            } else {
                console.error("Failed to fetch template")
                alert("Error: No se encontró la plantilla. Vuelva a la biblioteca.")
                router.push('/admin/templates')
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const generatePreview = () => {
        let content = template.html_content || ''
        Object.keys(MOCK_DATA).forEach(key => {
            const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
            content = content.replace(regex, MOCK_DATA[key])
        })
        setPreviewContent(content)
    }

    const handleSave = async () => {
        try {
            const endpoint = isNew ? '/api/report-templates' : `/api/report-templates/${id}`
            const method = isNew ? 'POST' : 'PUT'

            const res = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(template)
            })

            if (res.ok) {
                alert("Documento guardado correctamente")
                router.push('/admin/templates')
            } else {
                alert("Error al guardar")
            }
        } catch (error) {
            console.error(error)
            alert("Error de conexión")
        }
    }

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#1a1a1a] text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-zinc-400 text-sm">Cargando editor...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-screen flex flex-col bg-[#1a1a1a] text-white overflow-hidden font-sans">
            {/* STUDIO HEADER */}
            <div className="h-16 border-b border-white/10 bg-[#0f0f0f] px-4 flex items-center justify-between shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <Link href="/admin/templates">
                        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div className="h-6 w-px bg-white/10 mx-2" />
                    <div>
                        <Input
                            value={template.name}
                            onChange={e => setTemplate({ ...template, name: e.target.value })}
                            className="bg-transparent border-none text-lg font-bold h-auto p-0 focus-visible:ring-0 text-white w-[300px]"
                            placeholder="Nombre del Documento"
                        />
                        <div className="flex gap-2 text-xs text-zinc-500 mt-0.5">
                            <span>{isNew ? 'Nueva Plantilla' : 'Editando Plantilla'}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Tabs value={mode} onValueChange={(v: any) => setMode(v)} className="bg-zinc-800 p-0.5 rounded-lg border border-white/5">
                        <TabsList className="h-8">
                            <TabsTrigger value="edit" className="text-xs h-7 px-3">
                                <LayoutTemplate className="w-3.5 h-3.5 mr-2" /> Editor
                            </TabsTrigger>
                            <TabsTrigger value="preview" className="text-xs h-7 px-3">
                                <Eye className="w-3.5 h-3.5 mr-2" /> Vista Previa
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="h-6 w-px bg-white/10 mx-2" />

                    <Button onClick={handleSave} className="bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg shadow-cyan-900/20">
                        <Save className="w-4 h-4 mr-2" /> Guardar Cambios
                    </Button>
                </div>
            </div>

            {/* MAIN WORKSPACE */}
            <div className="flex-1 flex overflow-hidden">

                {/* LEFT: SETTINGS (Slim) */}
                <div className="w-[280px] bg-[#121212] border-r border-white/5 flex flex-col shrink-0 z-10 shadow-xl">
                    <ScrollArea className="flex-1">
                        <div className="p-4 space-y-6">

                            {/* CONFIG SECTION */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                    <Settings className="w-3 h-3" /> Propiedades
                                </h3>

                                <div className="space-y-2">
                                    <Label className="text-xs text-zinc-400">Categoría</Label>
                                    <Select
                                        value={template.category || 'OTRO'}
                                        onValueChange={(v) => setTemplate({ ...template, category: v })}
                                    >
                                        <SelectTrigger className="bg-zinc-900 border-zinc-800 text-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                            <SelectItem value="FORMATO_LEGAL">Formato Legal</SelectItem>
                                            <SelectItem value="REPORTE_ESTADISTICO">Reporte Estadístico</SelectItem>
                                            <SelectItem value="OTRO">Otro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs text-zinc-400">Tipo de Sistema</Label>
                                    <Select
                                        value={template.type}
                                        onValueChange={(v) => {
                                            const defaults: Record<string, string> = {
                                                'AUTHORIZATION': DEFAULT_AUTHORIZATION_TEMPLATE,
                                                'DELIVERY': DEFAULT_DELIVERY_TEMPLATE,
                                                'TRANSFER': DEFAULT_TRANSFER_GUIDE_TEMPLATE,
                                            }
                                            let content = template.html_content;
                                            if (defaults[v] && confirm("¿Cargar plantilla base?")) {
                                                content = defaults[v];
                                            }
                                            setTemplate({ ...template, type: v, html_content: content })
                                        }}
                                    >
                                        <SelectTrigger className="bg-zinc-900 border-zinc-800 text-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                            <SelectItem value="AUTHORIZATION">Autorización de Carga</SelectItem>
                                            <SelectItem value="DELIVERY">Nota de Entrega</SelectItem>
                                            <SelectItem value="TRANSFER">Guía de Traslado</SelectItem>
                                            <SelectItem value="COMBINED">Paquete Completo</SelectItem>
                                            <SelectItem value="INVOICE">Factura</SelectItem>
                                            <SelectItem value="ORDER">Genérico</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-md mt-6">
                                    <p className="text-[10px] text-blue-200 leading-relaxed">
                                        <strong>Tip:</strong> Usa el botón <strong className="text-white">"Variables SGL"</strong> en la barra de herramientas del editor para insertar datos dinámicos como Nombres, RIF o Cantidades.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </ScrollArea>
                </div>

                {/* CENTER: CANVAS */}
                <div className="flex-1 overflow-hidden relative bg-[#e3e3e3]">
                    {mode === 'edit' ? (
                        <RichTextEditor
                            key={template.id || 'new'}
                            content={template.html_content}
                            onChange={(html) => setTemplate({ ...template, html_content: html })}
                        />
                    ) : (
                        <div className="w-full h-full flex justify-center py-8 overflow-y-auto">
                            <div
                                className="bg-white w-[21cm] min-h-[29.7cm] shadow-2xl p-[2cm] text-black print:p-0 print:shadow-none origin-top"
                                dangerouslySetInnerHTML={{ __html: previewContent }}
                            />
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}
