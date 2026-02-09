import { NextResponse } from 'next/server';
import { db, CollectionName } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const collection = searchParams.get('collection') as CollectionName;

    if (!collection) {
        // Return full DB if no collection specified (careful with size)
        return NextResponse.json(await db.read());
    }

    const data = await db.getCollection(collection);
    return NextResponse.json(data || []);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { collection, data } = body;

        if (!collection || !data) {
            return NextResponse.json({ error: 'Missing collection or data' }, { status: 400 });
        }

        await db.saveCollection(collection as CollectionName, data);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
