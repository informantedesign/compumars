"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function UtilitiesPage() {
    return (
        <div className="flex flex-col items-center justify-center p-10 h-full">
            <h1 className="text-2xl font-bold mb-4">Módulo de Utilidades Movido</h1>
            <p className="mb-6 text-muted-foreground">La configuración de reportes se ha movido al nuevo constructor de reportes.</p>
            <Link href="/admin/report-builder">
                <Button>Ir al Constructor de Reportes</Button>
            </Link>
        </div>
    )
}
