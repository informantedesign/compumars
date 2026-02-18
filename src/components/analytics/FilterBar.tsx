"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { DateRange } from "react-day-picker";
import { es } from "date-fns/locale";

// Static Options
const PRODUCT_TYPES = ["Cemento Gris", "Yeso", "Granel", "Agregados"];
const STATUS_OPTIONS = ["Entregado", "En Planta", "Reguía", "Cancelado", "En Ruta", "Cargando"];

export function FilterBar({ className }: { className?: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // States
    const [date, setDate] = useState<DateRange | undefined>();
    const [selectedVendor, setSelectedVendor] = useState<string>("ALL");
    const [selectedProduct, setSelectedProduct] = useState<string>("ALL");
    const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
    const [selectedClient, setSelectedClient] = useState<string>("ALL"); // Changed from clientSearch to selectedClient

    // Data States
    const [vendors, setVendors] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);

    // Fetch Data
    useEffect(() => {
        const loadData = async () => {
            try {
                const sellersData = await api.get("sellers_data");
                if (Array.isArray(sellersData)) setVendors(sellersData);

                const clientsData = await api.get("clients_data");
                if (Array.isArray(clientsData)) setClients(clientsData);

            } catch (e) {
                console.error("Error loading filter data", e);
            }
        };
        loadData();
    }, []);

    // Load URL Params
    useEffect(() => {
        const vendor = searchParams.get("vendor");
        const product = searchParams.get("product");
        const client = searchParams.get("client");
        const status = searchParams.get("status");
        const start = searchParams.get("startDate");
        const end = searchParams.get("endDate");

        if (vendor) setSelectedVendor(vendor);
        if (product) setSelectedProduct(product);
        if (client) setSelectedClient(client);
        if (status) setSelectedStatus(status);
        if (start && end) {
            setDate({
                from: new Date(start),
                to: new Date(end)
            });
        }
    }, [searchParams]);

    // Apply Filters
    const applyFilters = () => {
        const params = new URLSearchParams();
        if (selectedVendor && selectedVendor !== 'ALL') params.set("vendor", selectedVendor);
        if (selectedProduct && selectedProduct !== 'ALL') params.set("product", selectedProduct);
        if (selectedClient && selectedClient !== 'ALL') params.set("client", selectedClient);
        if (selectedStatus && selectedStatus !== 'ALL') params.set("status", selectedStatus);

        if (date?.from) params.set("startDate", date.from.toISOString());
        if (date?.to) params.set("endDate", date.to.toISOString());

        router.push(`/analytics/explorer?${params.toString()}`);
    };

    const clearFilters = () => {
        setSelectedVendor("ALL");
        setSelectedProduct("ALL");
        setSelectedClient("ALL");
        setSelectedStatus("ALL");
        setDate(undefined);
        router.push("/analytics/explorer");
    };

    return (
        <div className={cn("bg-background border-b p-4 space-y-4 md:space-y-0 md:flex md:items-end md:gap-4 flex-wrap", className)}>

            {/* Date Range Filter */}
            <div className="space-y-2 w-full md:w-auto">
                <Label className="text-xs font-semibold text-muted-foreground uppercase">Rango de Fecha</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                                "w-[260px] justify-start text-left font-normal h-9",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date?.from ? (
                                date.to ? (
                                    <>
                                        {format(date.from, "LLL dd, y", { locale: es })} -{" "}
                                        {format(date.to, "LLL dd, y", { locale: es })}
                                    </>
                                ) : (
                                    format(date.from, "LLL dd, y", { locale: es })
                                )
                            ) : (
                                <span>Seleccionar fechas</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={2}
                            locale={es}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {/* Vendor Filter */}
            <div className="space-y-2 w-full md:w-40">
                <Label className="text-xs font-semibold text-muted-foreground uppercase">Vendedor</Label>
                <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                    <SelectTrigger className="h-9">
                        <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">TODOS</SelectItem>
                        {vendors.map((v: any) => (
                            <SelectItem key={v.id} value={v.name}>{v.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Client Filter */}
            <div className="space-y-2 w-full md:w-48">
                <Label className="text-xs font-semibold text-muted-foreground uppercase">Cliente</Label>
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                    <SelectTrigger className="h-9">
                        <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">TODOS</SelectItem>
                        {clients.map((c: any) => (
                            <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Product Filter */}
            <div className="space-y-2 w-full md:w-40">
                <Label className="text-xs font-semibold text-muted-foreground uppercase">Producto</Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger className="h-9">
                        <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">TODOS</SelectItem>
                        {PRODUCT_TYPES.map(p => (
                            <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2 w-full md:w-40">
                <Label className="text-xs font-semibold text-muted-foreground uppercase">Estatus</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="h-9">
                        <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">TODOS</SelectItem>
                        {STATUS_OPTIONS.map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 md:pt-0 pb-1 ml-auto md:ml-0">
                <Button size="sm" onClick={applyFilters}>
                    <Filter className="h-4 w-4 mr-2" />
                    Aplicar
                </Button>
                <Button size="sm" variant="ghost" onClick={clearFilters}>
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
