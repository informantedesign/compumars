"use client"

import { Fira_Code, Fira_Sans } from "next/font/google"; // Futuristic Fonts
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider, useLanguage } from "@/context/language-context";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { LayoutDashboard, PlusCircle, Map, AlertTriangle, Building, Users, Truck, DollarSign, Settings, Factory, Package } from "lucide-react";
import { ReactNode, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, LogOut, FileText } from "lucide-react"; // Added User icon
import { Button } from "@/components/ui/button";
import { SystemSettingsProvider, useSystemSettings } from "@/context/system-settings-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fira-sans"
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code"
});

// Inner Layout Component to use hooks
function MainLayout({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  const { settings } = useSystemSettings();
  const pathname = usePathname();
  const isPrintView = pathname?.startsWith("/print");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isPrintView) {
    return (
      <div className="flex h-screen w-full flex-col bg-white text-black">
        <main className="flex-1 p-0">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar (Desktop) */}
      <aside className="hidden w-64 flex-col border-r border-border bg-card/50 backdrop-blur-xl md:flex">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar */}
        <header className="flex h-14 items-center gap-4 border-b border-border bg-card/50 backdrop-blur-xl px-4 lg:h-[60px] lg:px-6 shrink-0 z-10 transition-all">
          <div className="flex items-center gap-2 md:hidden">
            {isMounted && (
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col p-0 w-[280px]">
                  <Sidebar onNavigate={() => setIsMobileMenuOpen(false)} />
                </SheetContent>
              </Sheet>
            )}
            {!isMounted && (
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            )}
            <span className="font-bold text-lg tracking-tighter text-primary">{settings.company_name}</span>
          </div>

          <div className="w-full flex-1">
            {/* Dynamic Company Name for Desktop too if we want, or just "SGL-VZLA" */}
            <span className="hidden md:inline-block font-bold text-lg tracking-tighter text-primary mr-4">{settings.company_name}</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageToggle />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full border border-primary/20 bg-primary/10 p-0 text-primary hover:bg-primary/20">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Admin User</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    admin@sgl.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => window.location.href = '/users'}>
                <Users className="mr-2 h-4 w-4" />
                <span>Gestión Usuarios</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.location.href = '/admin/settings'}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuración</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${firaSans.variable} ${firaCode.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light" // Default to Light
          enableSystem={false} // Disable system preference to enforce light default
          disableTransitionOnChange
        >
          <LanguageProvider>
            <SystemSettingsProvider>
              <MainLayout>{children}</MainLayout>
            </SystemSettingsProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
