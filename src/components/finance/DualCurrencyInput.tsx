
"use client"

import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSystemSettings } from "@/context/system-settings-context";
import { Calculator, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DualCurrencyInputProps {
    valueUSD: number;
    onChange: (usd: number) => void;
    label?: string;
    className?: string;
}

export function DualCurrencyInput({ valueUSD, onChange, label = "Monto", className }: DualCurrencyInputProps) {
    const { settings } = useSystemSettings();
    const rate = settings.current_exchange_rate || 0;

    const [localUSD, setLocalUSD] = useState(valueUSD.toString());
    const [localVES, setLocalVES] = useState((valueUSD * rate).toFixed(2));

    // Sync when external value changes
    useEffect(() => {
        setLocalUSD(valueUSD.toString());
        setLocalVES((valueUSD * rate).toFixed(2));
    }, [valueUSD, rate]);

    const handleUSDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setLocalUSD(val);
        const num = parseFloat(val) || 0;
        setLocalVES((num * rate).toFixed(2));
        onChange(num);
    };

    const handleVESChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setLocalVES(val);
        const num = parseFloat(val) || 0;
        if (rate > 0) {
            const usd = num / rate;
            setLocalUSD(usd.toFixed(2));
            onChange(usd);
        }
    };

    return (
        <div className={className}>
            {label && <Label className="mb-2 block">{label}</Label>}
            <div className="flex gap-2 items-center">
                <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-muted-foreground">$</span>
                    <Input
                        type="number"
                        step="0.01"
                        value={localUSD}
                        onChange={handleUSDChange}
                        className="pl-6"
                        placeholder="0.00 USD"
                    />
                </div>
                <div className="text-muted-foreground">
                    <RefreshCcw className="h-4 w-4" />
                </div>
                <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-muted-foreground">Bs.</span>
                    <Input
                        type="number"
                        step="0.01"
                        value={localVES}
                        onChange={handleVESChange}
                        className="pl-8"
                        placeholder="0.00 VES"
                    />
                </div>
            </div>
            <div className="text-xs text-muted-foreground mt-1 text-right">
                Tasa: {rate.toFixed(2)} VES/USD
            </div>
        </div>
    );
}
