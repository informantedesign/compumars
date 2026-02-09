"use client"

import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider, useLanguage } from "@/context/language-context";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { LayoutDashboard, PlusCircle, Map, AlertTriangle, Building, Users, Truck, DollarSign, Settings, Factory, Package } from "lucide-react";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

// Inner Layout Component to use hooks
function MainLayout({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const isPrintView = pathname?.startsWith("/print");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            <span className="font-bold text-lg tracking-tighter text-primary">SGL-VZLA</span>
          </div>

          <div className="w-full flex-1">
            {/* Search or Breadcrumbs could go here */}
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageToggle />
          </div>
          <div className="rounded-full bg-primary/10 w-8 h-8 flex items-center justify-center text-primary text-xs font-bold border border-primary/20">
            U
          </div>
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
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light" // Default to Light
          enableSystem={false} // Disable system preference to enforce light default
          disableTransitionOnChange
        >
          <LanguageProvider>
            <MainLayout>{children}</MainLayout>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
