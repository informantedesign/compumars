"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    PlusCircle,
    Factory,
    Package,
    Building,
    Users,
    Truck,
    Map,
    DollarSign,
    Settings,
    FileText,
    BarChart,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";

interface SidebarProps {
    className?: string; // Allow external styling (e.g., hidden on mobile)
    onNavigate?: () => void; // Optional callback to close sheet on navigate
}

export function Sidebar({ className, onNavigate }: SidebarProps) {
    const { t } = useLanguage();
    const pathname = usePathname();

    const links = [
        { href: "/dashboard", icon: LayoutDashboard, label: t.sidebar.dashboard },
        { href: "/orders/new", icon: PlusCircle, label: t.sidebar.newOrder },
        { separator: true },
        { href: "/plants", icon: Factory, label: t.sidebar.plants },
        { href: "/products", icon: Package, label: t.sidebar.products },
        { href: "/clients", icon: Building, label: t.sidebar.clients },
        { href: "/drivers", icon: Users, label: t.sidebar.drivers },
        { href: "/fleet", icon: Truck, label: t.sidebar.fleet },
        { href: "/sellers", icon: Users, label: "Vendedores" },
        { href: "/users", icon: Users, label: "Usuarios y Seguridad" },


        { href: "/finance", icon: DollarSign, label: "Finanzas" },
        { href: "/analytics/explorer", icon: BarChart, label: "REPORTES" },
        { separator: true },
        { href: "/admin/templates", icon: FileText, label: "Biblioteca Documentos" },
        { href: "/admin/settings", icon: Settings, label: "Configuración" },
    ];

    return (
        <div className={cn("flex h-full flex-col glass-panel border-r-0", className)}>
            <div className="flex h-14 items-center border-b border-white/10 px-4 lg:h-[60px] lg:px-6 shrink-0">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <span className="text-xl font-bold tracking-tighter neon-text">SGL-VZLA</span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1">
                    {links.map((link, idx) => {
                        if (link.separator) {
                            return <div key={idx} className="my-2 border-t border-white/10 mx-2" />;
                        }

                        const Icon = link.icon!;
                        const isActive = pathname === link.href;

                        return (
                            <Link
                                key={link.href || idx}
                                href={link.href || "#"}
                                onClick={onNavigate}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary hover:bg-white/5",
                                    isActive ? "bg-primary/20 text-primary font-bold shadow-[0_0_15px_rgba(124,58,237,0.3)] border border-primary/20" : "text-muted-foreground"
                                )}
                            >
                                <Icon className={cn("h-4 w-4", isActive && "text-neon-rose")} />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
