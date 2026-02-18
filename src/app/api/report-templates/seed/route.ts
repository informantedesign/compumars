import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { DEFAULT_AUTHORIZATION_TEMPLATE, DEFAULT_DELIVERY_TEMPLATE, DEFAULT_TRANSFER_GUIDE_TEMPLATE } from '@/lib/report-templates';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Create table if not exists (Migration fallback)
        await sql`
      CREATE TABLE IF NOT EXISTS report_templates (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN ('ORDER', 'REGUIA', 'INVOICE', 'AUTHORIZATION', 'DELIVERY', 'TRANSFER', 'COMBINED')),
        html_content TEXT NOT NULL,
        category VARCHAR(50) DEFAULT 'OTRO',
        preview_image_url VARCHAR(500),
        is_active BOOLEAN DEFAULT true,
        is_system_default BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

        // TRUNCATE TABLE (User requested fresh start)
        await sql`TRUNCATE TABLE report_templates`;

        // Array of defaults to seed
        const defaults = [
            {
                name: "AUTORIZACIÓN DE CARGA",
                type: "AUTHORIZATION",
                category: "FORMATO_LEGAL",
                content: DEFAULT_AUTHORIZATION_TEMPLATE
            },
            {
                name: "NOTA DE ENTREGA",
                type: "DELIVERY",
                category: "FORMATO_LEGAL",
                content: DEFAULT_DELIVERY_TEMPLATE
            },
            {
                name: "GUÍA DE TRASLADO",
                type: "TRANSFER",
                category: "FORMATO_LEGAL",
                content: DEFAULT_TRANSFER_GUIDE_TEMPLATE
            }
        ];

        let seededCount = 0;

        for (const tmpl of defaults) {
            await sql`
                INSERT INTO report_templates (name, type, category, html_content, is_system_default, is_active)
                VALUES (${tmpl.name}, ${tmpl.type}, ${tmpl.category}, ${tmpl.content}, true, true)
            `;
            seededCount++;
        }

        return NextResponse.json({ message: `Database checked. Seeded ${seededCount} new default templates.` });
    } catch (error) {
        console.error('Seed Error:', error);
        return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
    }
}
