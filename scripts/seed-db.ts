
import { sql } from '@vercel/postgres';
import { MOCK_PLANTS, MOCK_CLIENTS, MOCK_SELLERS, generateRandomOrders } from '@/lib/mock-data';
import { DEFAULT_AUTHORIZATION_TEMPLATE, DEFAULT_DELIVERY_TEMPLATE, DEFAULT_TRANSFER_GUIDE_TEMPLATE } from '@/lib/report-templates';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const INITIAL_DB = {
    active_orders: generateRandomOrders(5),
    report_templates: {
        authorization: DEFAULT_AUTHORIZATION_TEMPLATE,
        delivery: DEFAULT_DELIVERY_TEMPLATE,
        transfer_guide: DEFAULT_TRANSFER_GUIDE_TEMPLATE
    },
    report_config: {
        companyName: "CONSTRUFANB C.A",
        companyRif: "G-20010851-7",
        issuerName: "OMARIS ASTRID SANCHEZ",
        issuerRole: "GERENTE DE COMERCIALIZACIÓN",
        issuerId: "V-15.293.986",
        contactPhone: "04120527421"
    },
    clients_data: MOCK_CLIENTS,
    sellers_data: MOCK_SELLERS,
    plants_data: MOCK_PLANTS
};

async function seed() {
    try {
        console.log('Seeding database...');
        
        // Create table if not exists
        await sql`
            CREATE TABLE IF NOT EXISTS app_data (
                key VARCHAR(255) PRIMARY KEY,
                value JSONB
            );
        `;
        console.log('Created "app_data" table.');

        // Insert initial data
        // We iterate and upsert each key
        for (const [key, value] of Object.entries(INITIAL_DB)) {
            await sql`
                INSERT INTO app_data (key, value)
                VALUES (${key}, ${JSON.stringify(value)})
                ON CONFLICT (key) DO UPDATE SET value = ${JSON.stringify(value)};
            `;
            console.log(`Seeded collection: ${key}`);
        }

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

seed();
