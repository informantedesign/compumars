import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { rows } = await sql`SELECT * FROM report_templates WHERE id = ${id}`;

        if (rows.length === 0) {
            return NextResponse.json({ error: 'Template not found' }, { status: 404 });
        }

        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json({ error: 'Failed to fetch template' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, type, html_content } = body;

        const { rows } = await sql`
      UPDATE report_templates
      SET 
        name = ${name}, 
        type = ${type}, 
        html_content = ${html_content}, 
        category = ${body.category || 'OTRO'},
        preview_image_url = ${body.preview_image_url || null},
        is_active = ${body.is_active !== undefined ? body.is_active : true},
        is_system_default = ${body.is_system_default || false},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

        if (rows.length === 0) {
            return NextResponse.json({ error: 'Template not found' }, { status: 404 });
        }

        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json({ error: 'Failed to update template' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { rows } = await sql`
      DELETE FROM report_templates
      WHERE id = ${id}
      RETURNING *
    `;

        if (rows.length === 0) {
            return NextResponse.json({ error: 'Template not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Template deleted successfully' });
    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 });
    }
}
