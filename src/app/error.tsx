'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center space-y-4">
            <div className="p-4 bg-destructive/10 rounded-full">
                <AlertCircle className="w-12 h-12 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">¡Ha ocurrido un error!</h2>
            <p className="text-muted-foreground max-w-sm">
                Lo sentimos, no pudimos cargar esta sección correctamente.
                {error.message && <span className="block mt-2 text-xs font-mono bg-muted p-2 rounded">{error.message}</span>}
            </p>
            <Button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
                variant="default"
            >
                Intentar de nuevo
            </Button>
        </div>
    )
}
