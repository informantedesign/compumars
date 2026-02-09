"use client"

import { useParams, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import { DEFAULT_AUTHORIZATION_TEMPLATE, DEFAULT_DELIVERY_TEMPLATE, DEFAULT_TRANSFER_GUIDE_TEMPLATE } from "@/lib/report-templates"
import { processTemplate, ReportConfig } from "@/lib/report-utils"
import { api } from "@/lib/api"

// Types (Mirrors Dashboard/Order Type)
type TripDetail = {
    id: string
    plantOrderNumber?: string
    client: string
    rif: string
    route: string
    origin: string
    destination: string
    driver: string
    driverPhone: string
    truck: string
    plate: string

    // Detailed Vehicle Info
    truckPlate?: string
    truckBrand?: string
    truckModel?: string
    truckColor?: string
    truckType?: string

    trailerPlate?: string
    trailerBrand?: string
    trailerModel?: string
    trailerColor?: string
    trailerType?: string

    status: string
    eta: string
    product: string
    quantity: string
    contact: string
    phone: string
    history: any[]
    finalClient?: string
    finalAddress?: string
}

function OrderPrintContent() {
    const params = useParams()
    const searchParams = useSearchParams()
    const mode = searchParams.get('mode') || 'authorization' // authorization, delivery, combined

    const [order, setOrder] = useState<TripDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [templates, setTemplates] = useState({
        authorization: DEFAULT_AUTHORIZATION_TEMPLATE,
        delivery: DEFAULT_DELIVERY_TEMPLATE,
        transfer_guide: DEFAULT_TRANSFER_GUIDE_TEMPLATE
    })
    const [config, setConfig] = useState<ReportConfig>({
        issuerName: "OMARIS ASTRID SANCHEZ",
        issuerRole: "GERENTE DE COMERCIALIZACIÓN",
        issuerId: "V-15.293.986",
        companyName: "CONSTRUFANB C.A",
        companyRif: "G-20010851-7",
        contactPhone: "04120527421"
    })

    useEffect(() => {
        const loadData = async () => {
            const idToSearch = Array.isArray(params.id) ? params.id[0] : params.id;
            try {
                // Load Order
                const savedOrders = await api.get("active_orders");
                if (savedOrders && Array.isArray(savedOrders)) {
                    const found = savedOrders.find((o: any) => o.id === idToSearch);
                    if (found) {
                        setOrder(found);
                    } else {
                        // Fallback/Mock
                        const staticMock: TripDetail = {
                            id: idToSearch as string,
                            plantOrderNumber: "PL-MOCK-001",
                            client: "Constructora Sambil",
                            rif: "J-3049293-1",
                            origin: "Planta Pertigalete",
                            destination: "Obras Sambil La Candelaria",
                            driver: "MIGUEL AGUIRRE",
                            driverPhone: "0414-1112233",
                            truck: "MACK",
                            plate: "A53AA9D",
                            product: "CEMENTO GRIS",
                            quantity: "34 TON",
                            contact: "Ing. Roberto",
                            phone: "0414-1234567",
                            history: [],
                            route: "Pertigalete -> Caracas",
                            status: "En Ruta",
                            eta: "N/A"
                        }
                        setOrder(staticMock)
                    }
                }

                // Load Templates
                const savedTemplates = await api.get("report_templates");
                if (savedTemplates) {
                    setTemplates(prev => ({ ...prev, ...savedTemplates }));
                }

                // Load Config
                const savedConfig = await api.get("report_config");
                if (savedConfig) {
                    if (savedConfig.issuerName) setConfig(prev => ({ ...prev, ...savedConfig }));
                    if (savedConfig.authorization) setConfig(prev => ({ ...prev, ...savedConfig.authorization }));
                }
            } catch (e) {
                console.error("Error loading print data", e);
            }
            setLoading(false);
        };
        loadData();
    }, [params.id])

    if (loading) return <div>Cargando...</div>
    if (!order) return <div>Pedido no encontrado</div>

    // Render Helpers
    const renderAuthorization = () => {
        const html = processTemplate(templates.authorization, order, config);
        return <div dangerouslySetInnerHTML={{ __html: html }} className="bg-white" />
    }

    const renderDelivery = () => {
        const html = processTemplate(templates.delivery, order, config);
        return <div dangerouslySetInnerHTML={{ __html: html }} className="bg-white" />
    }

    const renderTransferGuide = () => {
        const html = processTemplate(templates.transfer_guide, order, config);
        return <div dangerouslySetInnerHTML={{ __html: html }} className="bg-white" />
    }

    return (
        <div className="print:m-0">
            {/* Print Controls */}
            <div className="p-8 bg-gray-50 mb-4 print:hidden flex justify-between items-center shadow-md">
                <div>
                    <h1 className="text-xl font-bold">Vista de Impresión</h1>
                    <p className="text-sm text-muted-foreground">
                        Modo: {mode}
                    </p>
                </div>
                <Button onClick={() => window.print()}>
                    <Printer className="mr-2 h-4 w-4" /> Imprimir
                </Button>
            </div>

            {/* Render based on mode */}
            {(mode === 'authorization' || mode === 'combined') && (
                <div className="print:break-after-page mb-8 print:mb-0 shadow-lg print:shadow-none">
                    {renderAuthorization()}
                </div>
            )}

            {(mode === 'delivery' || mode === 'combined') && (
                <div className="print:break-after-page mb-8 print:mb-0 shadow-lg print:shadow-none">
                    {renderDelivery()}
                </div>
            )}

            {(mode === 'transfer_guide') && (
                <div className="print:break-after-page mb-8 print:mb-0 shadow-lg print:shadow-none">
                    {renderTransferGuide()}
                </div>
            )}
        </div>
    )
}

export default function OrderPrintPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OrderPrintContent />
        </Suspense>
    )
}
