"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, MapPin, AlertTriangle, Truck, Printer } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ReguiaPage({ params }: { params: { id: string } }) {
    const { t } = useLanguage();
    // Mock Data for the existing order
    const order = {
        id: params.id,
        originalOrigin: "Planta Pertigalete",
        originalDest: "Sambil Maracaibo",
        driver: "Pedro Perez (CH-04)",
        status: "In Transit"
    }

    return (
        <div className="max-w-3xl mx-auto py-8 space-y-8">

            {/* Header Alert */}
            <div className="flex justify-end mb-4 print:hidden">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2">
                            <Printer className="h-4 w-4" />
                            Imprimir Documentos
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={`/print/order/${params.id}?mode=combined`} target="_blank" className="cursor-pointer">
                                Todo (Autorización + Nota)
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={`/print/order/${params.id}?mode=authorization`} target="_blank" className="cursor-pointer">
                                Solo Autorización
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/print/order/${params.id}?mode=delivery`} target="_blank" className="cursor-pointer">
                                Solo Nota de Entrega
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={`/print/order/${params.id}?mode=transfer_guide`} target="_blank" className="cursor-pointer font-bold text-green-700">
                                Guía de Traslado (Ministerio)
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-destructive mt-1" />
                <div>
                    <h3 className="text-lg font-bold text-destructive">{t.reguia.alertTitle}</h3>
                    <p className="text-sm text-destructive/80">
                        {t.reguia.alertMsg}
                    </p>
                </div>
            </div>

            {/* Visual Route Change */}
            <Card>
                <CardHeader>
                    <CardTitle>{t.reguia.routeTitle}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                        <div className="opacity-50 line-through decoration-destructive decoration-2">
                            <p className="text-xs font-uppercase text-muted-foreground">{t.reguia.origDest}</p>
                            <p className="font-bold flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> {order.originalDest}
                            </p>
                        </div>
                        <ArrowRight className="text-muted-foreground" />
                        <div className="text-primary">
                            <p className="text-xs font-uppercase text-primary/80">{t.reguia.newDest}</p>
                            <p className="font-bold flex items-center gap-2 animate-pulse">
                                <MapPin className="w-4 h-4" /> {t.reguia.selectBelow}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">{t.reguia.newSiteLabel}</label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus:ring-2 focus:ring-primary">
                            <option>Viviendas El Sol (Valencia)</option>
                            <option>Deposito Central (Barquisimeto)</option>
                            <option>Obra Privada (Caracas)</option>
                        </select>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Truck className="w-4 h-4" /> {t.reguia.resourceStatus}
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 border rounded bg-background/50">
                                <p className="text-xs text-muted-foreground">{t.reguia.currentDriver}</p>
                                <p className="font-semibold">{order.driver}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="breakdown" className="w-4 h-4 accent-primary" />
                                <label htmlFor="breakdown" className="text-sm">{t.reguia.breakdown}</label>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Financial Adjustment */}
            <Card className="border-t-4 border-t-yellow-500">
                <CardHeader>
                    <CardTitle>{t.reguia.costTitle}</CardTitle>
                    <CardDescription>{t.reguia.costDesc}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t.reguia.addFreight}</label>
                            <Input type="number" placeholder="0.00" className="border-yellow-500/20 focus:border-yellow-500" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t.reguia.reasonCode}</label>
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                <option>Client Request</option>
                                <option>Road Blockage / Protest</option>
                                <option>Weather Conditions</option>
                                <option>Vehicle Breakdown</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="ghost">{t.reguia.buttons.cancel}</Button>
                    <Button variant="destructive" className="bg-yellow-600 hover:bg-yellow-500 text-white border-none">
                        {t.reguia.buttons.confirm}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
