
"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';

export type SystemSettings = {
    company_name: string;
    rif: string;
    address: string;
    phone: string;
    email: string;
    logo_url: string;
    report_footer: string;
    current_exchange_rate: number;
    current_iva: number;
    next_order_number: number;
    next_guide_number: number;
    next_delivery_note_number: number;
};

const DEFAULT_SETTINGS: SystemSettings = {
    company_name: "SGL-Venezuela",
    rif: "J-00000000-0",
    address: "Sin Dirección Configurada",
    phone: "",
    email: "",
    logo_url: "",
    report_footer: "Emitido por Sistema SGL",
    current_exchange_rate: 40.00,
    current_iva: 16.00,
    next_order_number: 100,
    next_guide_number: 1,
    next_delivery_note_number: 1,
};

type SystemSettingsContextType = {
    settings: SystemSettings;
    updateSettings: (newSettings: Partial<SystemSettings>) => void;
    isLoading: boolean;
};

const SystemSettingsContext = createContext<SystemSettingsContextType | undefined>(undefined);

export function SystemSettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            if (res.ok) {
                const data = await res.json();
                // Merge with defaults to ensure all fields exist
                setSettings({ ...DEFAULT_SETTINGS, ...data });
            }
        } catch (error) {
            console.error("Failed to load settings:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateSettings = async (newSettings: Partial<SystemSettings>) => {
        // Optimistic update
        const updated = { ...settings, ...newSettings };
        setSettings(updated);

        try {
            await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated),
            });
        } catch (error) {
            console.error("Failed to save settings:", error);
            // Revert on error? checking fetchSettings() again would be safer but simple optimistic is fine for now
            fetchSettings();
        }
    };

    return (
        <SystemSettingsContext.Provider value={{ settings, updateSettings, isLoading }}>
            {children}
        </SystemSettingsContext.Provider>
    );
}

export const useSystemSettings = () => {
    const context = useContext(SystemSettingsContext);
    if (context === undefined) {
        throw new Error('useSystemSettings must be used within a SystemSettingsProvider');
    }
    return context;
};
