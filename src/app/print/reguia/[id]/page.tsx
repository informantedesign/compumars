"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

// Mock Data Lookup (In a real app, fetch from API/DB based on ID)
const getTripData = (id: string) => {
    // Return mock based on ID or default
    return {
        id: id || "VIA-001",
        date: new Date().toLocaleDateString(),
        originalClient: "Constructora Sambil",
        originalAddress: "Planta Pertigalete, Anzoátegui", // Using as Origin
        finalClient: "Viviendas Venezuela", // Destination
        finalAddress: "Urb. Los Guayos, Valencia",
        driver: "Juan Rodriguez",
        driverId: "V-12.345.678",
        truck: "Iveco Trakker",
        plate: "X99-ZZ1",
        trailerPlate: "PLT-998",
        product: "Cemento Saco (42.5kg)",
        quantity: "600 Sacos",
        terms: "El conductor declara haber recibido la carga a satisfacción. La empresa no se hace responsable por retrasos debidos a fuerza mayor."
    }
}

export default function PrintReguiaPage({ params }: { params: { id: string } }) {
    const [data, setData] = useState<any>(null)

    useEffect(() => {
        const tripData = getTripData(params.id)

        // Load custom terms from config
        if (typeof window !== 'undefined') {
            const savedConfig = localStorage.getItem("report_config")
            if (savedConfig) {
                try {
                    const parsed = JSON.parse(savedConfig)
                    if (parsed.reguia?.terms) {
                        tripData.terms = parsed.reguia.terms
                    }
                } catch (e) {
                    console.error("Error loading config", e)
                }
            }
        }
        setData(tripData)
    }, [params.id])

    if (!data) return <div>Cargando...</div>

    return (
        <div className="bg-white text-black min-h-screen p-8 max-w-[210mm] mx-auto print:p-0 print:max-w-none">
            {/* Print Controls */}
            <div className="mb-8 print:hidden flex justify-end gap-4">
                <Button onClick={() => window.print()}>
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimir Documento
                </Button>
            </div>

            {/* Header */}
            <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold uppercase tracking-wider">Reguía de Carga</h1>
                    <p className="text-sm">Documento de Control y Redirección</p>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-mono font-bold">{data.id}</h2>
                    <p className="text-sm">Fecha: {data.date}</p>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid gap-8">

                {/* Logistics Info */}
                <div className="grid grid-cols-2 gap-8">
                    <div className="border border-black p-4">
                        <h3 className="font-bold border-b border-black mb-2 uppercase text-sm">Origen / Remitente</h3>
                        <div className="space-y-1 text-sm">
                            <p><span className="font-semibold">Cliente Origen:</span> {data.originalClient}</p>
                            <p><span className="font-semibold">Dirección Salida:</span> {data.originalAddress}</p>
                        </div>
                    </div>
                    <div className="border border-black p-4 bg-gray-50 print:bg-transparent">
                        <h3 className="font-bold border-b border-black mb-2 uppercase text-sm">Destino / Receptor Final</h3>
                        <div className="space-y-1 text-sm">
                            <p><span className="font-semibold">Cliente Final:</span> {data.finalClient}</p>
                            <p><span className="font-semibold">Dirección Entrega:</span> {data.finalAddress}</p>
                        </div>
                    </div>
                </div>

                {/* Transport Info */}
                <div className="border border-black p-4">
                    <h3 className="font-bold border-b border-black mb-4 uppercase text-sm">Datos del Transporte</h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                            <p className="font-semibold mb-1">Conductor</p>
                            <p>{data.driver}</p>
                            <p className="text-xs">{data.driverId}</p>
                        </div>
                        <div>
                            <p className="font-semibold mb-1">Unidad (Chuto)</p>
                            <p>{data.truck}</p>
                            <p className="font-mono">{data.plate}</p>
                        </div>
                        <div>
                            <p className="font-semibold mb-1">Remolque (Batea)</p>
                            <p>Batea Standard</p>
                            <p className="font-mono">{data.trailerPlate}</p>
                        </div>
                    </div>
                </div>

                {/* Cargo Info */}
                <div className="border border-black p-4">
                    <h3 className="font-bold border-b border-black mb-4 uppercase text-sm">Detalle de Carga</h3>
                    <div className="flex justify-between items-center px-4">
                        <div>
                            <p className="font-semibold">Producto</p>
                            <p className="text-lg">{data.product}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold">Cantidad Total</p>
                            <p className="text-xl font-bold">{data.quantity}</p>
                        </div>
                    </div>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-3 gap-8 mt-12">
                    <div className="text-center">
                        <div className="border-t border-black pt-2 w-32 mx-auto"></div>
                        <p className="text-xs uppercase">Despachador</p>
                    </div>
                    <div className="text-center">
                        <div className="border-t border-black pt-2 w-32 mx-auto"></div>
                        <p className="text-xs uppercase">Conductor</p>
                    </div>
                    <div className="text-center">
                        <div className="border-t border-black pt-2 w-32 mx-auto"></div>
                        <p className="text-xs uppercase">Recibido Conforme</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-[10px] text-center text-gray-500 border-t pt-4">
                    <p>{data.terms}</p>
                </div>

            </div>
        </div>
    )
}
