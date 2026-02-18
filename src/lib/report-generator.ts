import { api } from '@/lib/api';

// You might need to import html2pdf if accessible, or use window.html2pdf if loaded via CDN
// Since we installed html2pdf.js, we can try importing it.
// dynamic import is better for client-side libraries in Next.js
// but here we are in a utility file. 

export async function generatePDF(templateId: string, data: any, filename: string = 'document.pdf') {
    try {
        // 1. Fetch Template
        // We assume we have an API to get a single template or we search in the list
        // Ideally we have GET /api/report-templates/:id
        const response = await fetch(`/api/report-templates/${templateId}`);
        if (!response.ok) throw new Error('Failed to fetch template');
        const template = await response.json();

        if (!template || !template.html_content) {
            throw new Error('Template has no content');
        }

        // 2. Variable Replacement
        let html = template.html_content;

        // Standardize data keys to match {{variable}} format if needed, 
        // but we assume data keys match what's in the dictionary or we map them here.
        // The dictionary used {{driver_name}}, {{chuto_plate}}, etc.
        // The actual data object from the app might have different keys (e.g. driver.name).
        // This mapping function is crucial. For now, we assume flattened data or we helper function.

        // Simple recursive flatten or just replacement if data is already flat/mapped.
        for (const [key, value] of Object.entries(data)) {
            // Replace {{key}} case-insensitive? usually case-sensitive is safer.
            const regex = new RegExp(`{{${key}}}`, 'g');
            const valStr = value !== null && value !== undefined ? String(value) : '';
            html = html.replace(regex, valStr);
        }

        // 3. HTML to PDF
        // We need to render this HTML into a hidden container or pass it to html2pdf
        if (typeof window !== 'undefined') {
            const html2pdf = (await import('html2pdf.js')).default;
            const opt = {
                margin: 10,
                filename: filename,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
            };

            // Create a temporary container
            const element = document.createElement('div');
            element.innerHTML = html;
            element.style.width = '210mm'; // A4 width
            // element.style.padding = '20px';
            // element.className = 'pdf-content'; // Add any global print styles if needed

            // We probably need to append it to body to ensure styles load if they are external, 
            // but for inline styles it's fine.
            // html2pdf can take a string or element. Element is safer.

            await html2pdf().set(opt).from(element).save();
        }

    } catch (error) {
        console.error('PDF Generation Error:', error);
        alert('Error generando el PDF. Verifique la consola.');
    }
}
