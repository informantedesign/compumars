import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const result = await sql`SELECT * FROM report_templates ORDER BY updated_at DESC, created_at DESC`;
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Database Error in GET /api/report-templates:', error);
        return NextResponse.json({ error: 'Failed to fetch templates', details: String(error) }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, type, html_content } = body;

        if (!name || !type || !html_content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { rows } = await sql`
      INSERT INTO report_templates (name, type, html_content, category, preview_image_url, is_active, is_system_default)
      VALUES (
        ${name}, 
        ${type}, 
        ${html_content}, 
        ${body.category || 'OTRO'}, 
        ${body.preview_image_url || null}, 
        ${body.is_active !== undefined ? body.is_active : true},
        ${body.is_system_default || false}
      )
      RETURNING *
    `;
        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
    }
}
