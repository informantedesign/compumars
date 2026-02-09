import { sql } from '@vercel/postgres';
import { MOCK_PLANTS, MOCK_CLIENTS, MOCK_SELLERS, generateRandomOrders } from '@/lib/mock-data';
import { DEFAULT_AUTHORIZATION_TEMPLATE, DEFAULT_DELIVERY_TEMPLATE, DEFAULT_TRANSFER_GUIDE_TEMPLATE } from '@/lib/report-templates';

export type CollectionName =
    | 'active_orders'
    | 'report_templates'
    | 'report_config'
    | 'clients_data'
    | 'sellers_data'
    | 'plants_data';

interface DatabaseSchema {
    active_orders: any[];
    report_templates: any;
    report_config: any;
    clients_data: any[];
    sellers_data: any[];
    plants_data: any[];
}

const INITIAL_DB: DatabaseSchema = {
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

export const db = {
    // We keep 'read' but it's now async and fetches everything (careful with performance)
    // For better performance, use getCollection directly.
    read: async (): Promise<DatabaseSchema> => {
        try {
            const { rows } = await sql`SELECT key, value FROM app_data`;
            const data: any = {};
            rows.forEach(row => {
                data[row.key] = row.value;
            });
            // Merge with initial db to ensure all keys exist
            return { ...INITIAL_DB, ...data };
        } catch (error) {
            console.error("Error reading DB from Postgres:", error);
            return INITIAL_DB;
        }
    },

    // 'write' is also async now
    write: async (data: DatabaseSchema) => {
        try {
            for (const [key, value] of Object.entries(data)) {
                await sql`
                    INSERT INTO app_data (key, value)
                    VALUES (${key}, ${JSON.stringify(value)})
                    ON CONFLICT (key) DO UPDATE SET value = ${JSON.stringify(value)};
                `;
            }
        } catch (error) {
            console.error("Error writing DB to Postgres:", error);
        }
    },

    getCollection: async (collection: CollectionName) => {
        try {
            const { rows } = await sql`SELECT value FROM app_data WHERE key = ${collection}`;
            if (rows.length > 0) {
                return rows[0].value;
            }
            return INITIAL_DB[collection as keyof DatabaseSchema];
        } catch (error) {
            console.error(`Error getting collection ${collection}:`, error);
            return INITIAL_DB[collection as keyof DatabaseSchema];
        }
    },

    saveCollection: async (collection: CollectionName, items: any) => {
        try {
            await sql`
                INSERT INTO app_data (key, value)
                VALUES (${collection}, ${JSON.stringify(items)})
                ON CONFLICT (key) DO UPDATE SET value = ${JSON.stringify(items)};
            `;
            return items;
        } catch (error) {
            console.error(`Error saving collection ${collection}:`, error);
            return items;
        }
    }
};
