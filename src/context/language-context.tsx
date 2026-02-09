"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { dictionaries, Locale } from '@/lib/dictionaries';

type LanguageContextType = {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: typeof dictionaries['en'];
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [locale, setLocale] = useState<Locale>('es');

    const value = {
        locale,
        setLocale,
        t: dictionaries[locale],
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
