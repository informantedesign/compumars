
import { sql } from '@vercel/postgres';
import { hash } from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function migrate() {
    try {
        console.log('Starting V2.0 Migration...');

        // 1. Create Users Table
        console.log('Creating "users" table...');
        await sql`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'Viewer',
                status VARCHAR(50) DEFAULT 'Active',
                permissions JSONB DEFAULT '[]',
                created_at TIMESTAMP DEFAULT NOW()
            );
        `;

        // 2. Create Rate History Table
        console.log('Creating "rate_history" table...');
        await sql`
            CREATE TABLE IF NOT EXISTS rate_history (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                date TIMESTAMP DEFAULT NOW(),
                rate DECIMAL(10, 4) NOT NULL,
                user_id VARCHAR(255) -- Who updated it
            );
        `;

        // 3. Create Default Admin User
        const email = 'admin@sgl.com';
        const password = 'admin123';
        const hashedPassword = await hash(password, 10);

        console.log('Seeding default Admin user...');
        await sql`
            INSERT INTO users (email, password_hash, name, role, permissions)
            VALUES (${email}, ${hashedPassword}, 'SGL Admin', 'SuperAdmin', ${JSON.stringify(['dashboard', 'orders', 'fleet', 'clients', 'products', 'users', 'reports', 'finance'])})
            ON CONFLICT (email) DO NOTHING;
        `;

        // 4. Initialize System Settings
        console.log('Initializing System Settings...');
        const initialSettings = {
            current_exchange_rate: 40.00,
            company_name: "SGL-Venezuela",
            rif: "J-00000000-0",
            address: "Zona Industrial",
            logo_url: ""
        };

        await sql`
            INSERT INTO app_data (key, value)
            VALUES ('system_settings', ${JSON.stringify(initialSettings)})
            ON CONFLICT (key) DO UPDATE SET value = ${JSON.stringify(initialSettings)}
            WHERE app_data.key = 'system_settings' AND app_data.value IS NULL; 
        `;
        // Note: The above ON CONFLICT only updates if it doesn't exist or is null, trying to preserve if already set, but here we just want to ensure it exists.
        // Actually, the requirement asks to "Add system_settings", so let's just ensure it exists with default if not. 
        // A simpler upsert for key-value store:
        // Checking if exists first might be better to avoiding overwriting if we ran this multiple times and user changed settings?
        // But for V2 upgrade effectively initializing it, safety is good.

        // Let's safe-insert:
        const { rowCount } = await sql`SELECT 1 FROM app_data WHERE key = 'system_settings'`;
        if (rowCount === 0) {
            await sql`
                INSERT INTO app_data (key, value)
                VALUES ('system_settings', ${JSON.stringify(initialSettings)});
            `;
            console.log('Inserted default system_settings.');
        } else {
            console.log('system_settings already exist, skipping override.');
        }

        console.log('Migration V2.0 completed successfully!');
    } catch (error) {
        console.error('Error during migration:', error);
        process.exit(1);
    }
}

migrate();
