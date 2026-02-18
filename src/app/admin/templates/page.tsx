"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Edit, Copy, Trash2, FileText, BarChart, MoreHorizontal, Check } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Template {
    id: string
    name: string
    type: string
    category: 'FORMATO_LEGAL' | 'REPORTE_ESTADISTICO' | 'OTRO'
    preview_image_url?: string
    is_system_default: boolean
    updated_at: string
}

export default function TemplateLibraryPage() {
    const router = useRouter()
    const [templates, setTemplates] = useState<Template[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchTemplates()
    }, [])

    const fetchTemplates = async () => {
        try {
            const res = await fetch('/api/report-templates', { cache: 'no-store' })
            const data = await res.json()
            setTemplates(data)
        } catch (error) {
            console.error("Failed to load templates", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("¿Está seguro de eliminar esta plantilla?")) return
        try {
            const res = await fetch(`/api/report-templates/${id}`, { method: 'DELETE' })
            if (res.ok) {
                setTemplates(templates.filter(t => t.id !== id))
            }
        } catch (error) {
            console.error(error)
        }
    }

    const categories = [
        { id: 'all', label: 'Todos' },
        { id: 'FORMATO_LEGAL', label: 'Formatos Legales' },
        { id: 'REPORTE_ESTADISTICO', label: 'Reportes' },
        { id: 'OTRO', label: 'Otros' }
    ]

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Biblioteca de Documentos
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Gestione sus formatos legales y reportes operativos.
                    </p>
                </div>
                <Link href="/admin/templates/editor/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Crear Nuevo Documento
                    </Button>
                </Link>
            </div>

            {/* Filter Tabs */}
            <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-4">
                    {categories.map(cat => (
                        <TabsTrigger
                            key={cat.id}
                            value={cat.id}
                        >
                            {cat.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {categories.map(cat => (
                    <TabsContent key={cat.id} value={cat.id} className="mt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {templates
                                .filter(t => cat.id === 'all' || t.category === cat.id || (!t.category && cat.id === 'OTRO'))
                                .map(template => (
                                    <Card key={template.id} className="group overflow-hidden flex flex-col h-[320px] hover:shadow-md transition-all">
                                        {/* Preview Image Area */}
                                        <div className="h-40 bg-muted relative overflow-hidden flex items-center justify-center">
                                            {template.preview_image_url ? (
                                                <img src={template.preview_image_url} alt={template.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                                            ) : (
                                                <div className="text-muted-foreground/50 flex flex-col items-center">
                                                    <FileText className="h-12 w-12 mb-2" />
                                                    <span className="text-xs uppercase tracking-widest font-bold">Sin Vista Previa</span>
                                                </div>
                                            )}
                                            {template.is_system_default && (
                                                <Badge variant="secondary" className="absolute top-2 right-2 backdrop-blur-sm">
                                                    Sistema
                                                </Badge>
                                            )}
                                        </div>

                                        <CardHeader className="p-4 flex-1">
                                            <div className="flex justify-between items-start gap-2">
                                                <CardTitle className="text-base font-semibold line-clamp-2 leading-tight">
                                                    {template.name}
                                                </CardTitle>
                                            </div>
                                            <CardDescription className="text-xs mt-1 flex items-center gap-2">
                                                <span className="bg-muted px-2 py-0.5 rounded font-mono">
                                                    {template.type}
                                                </span>
                                                <span>•</span>
                                                <span>{new Date(template.updated_at).toLocaleDateString()}</span>
                                            </CardDescription>
                                        </CardHeader>

                                        <CardFooter className="p-4 border-t bg-muted/20 flex justify-between gap-2">
                                            <Link href={`/admin/templates/editor/${template.id}`} className="flex-1">
                                                <Button variant="secondary" size="sm" className="w-full">
                                                    <Edit className="h-4 w-4 mr-2" /> Editar
                                                </Button>
                                            </Link>
                                            {!template.is_system_default && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => handleDelete(template.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </CardFooter>
                                    </Card>
                                ))}

                            {/* Empty State for category */}
                            {templates.filter(t => cat.id === 'all' || t.category === cat.id || (!t.category && cat.id === 'OTRO')).length === 0 && (
                                <div className="col-span-full py-20 text-center border border-dashed rounded-xl bg-muted/10">
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <FileText className="h-12 w-12 mb-4 opacity-50" />
                                        <p className="text-lg font-medium">No hay documentos en esta categoría</p>
                                        <p className="text-sm mt-1">Cree uno nuevo o ajuste los filtros.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}
