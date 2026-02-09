import fs from 'fs';
import path from 'path';
import { MOCK_PLANTS, MOCK_CLIENTS, MOCK_SELLERS, generateRandomOrders } from '@/lib/mock-data';
import { DEFAULT_AUTHORIZATION_TEMPLATE, DEFAULT_DELIVERY_TEMPLATE, DEFAULT_TRANSFER_GUIDE_TEMPLATE } from '@/lib/report-templates';

const DB_PATH = path.join(process.cwd(), 'data.json');

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

// Ensure DB file exists
function ensureDb() {
    if (!fs.existsSync(DB_PATH)) {
        try {
            fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_DB, null, 2));
            console.log("Database initialized with mock data.");
        } catch (error) {
            console.error("Error creating database file:", error);
        }
    }
}

export const db = {
    read: (): DatabaseSchema => {
        ensureDb();
        try {
            const data = fs.readFileSync(DB_PATH, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error("Error reading DB:", error);
            return INITIAL_DB;
        }
    },

    write: (data: DatabaseSchema) => {
        ensureDb();
        try {
            fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error("Error writing DB:", error);
        }
    },

    getCollection: (collection: CollectionName) => {
        const data = db.read();
        return data[collection] || INITIAL_DB[collection as keyof DatabaseSchema];
    },

    saveCollection: (collection: CollectionName, items: any) => {
        const data = db.read();
        // @ts-ignore
        data[collection] = items;
        db.write(data);
        return items;
    }
};
