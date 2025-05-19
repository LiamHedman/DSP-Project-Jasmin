import { pool } from './connection_pooling';

const add_owner_name_column = async (table: string) => {
    try {
        const query = `
            ALTER TABLE ${table}
            ADD COLUMN IF NOT EXISTS owner_name TEXT;
        `;

        await pool.query(query);
        console.log(`[SUCCESS]: Column 'owner_name' added to table "${table}" (or already exists).`);
        
    } catch (err: any) {
        switch (err.code) {
            case "42P01": // Undefined table
                console.error(`[ERROR]: Table "${table}" not found.`);
                break;
            case "42701": // Duplicate column
                console.error(`[ERROR]: Column 'owner_name' already exists in "${table}".`);
                break;
            default:
                console.error(`[ERROR]: Failed to alter table "${table}"`, err);
        }
    }
};

export default add_owner_name_column;