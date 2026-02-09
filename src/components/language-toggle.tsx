"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/context/language-context"

export function LanguageToggle() {
    const { locale, setLocale } = useLanguage()

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={() => setLocale(locale === 'en' ? 'es' : 'en')}
            className="w-16 font-bold"
        >
            {locale.toUpperCase()}
        </Button>
    )
}
