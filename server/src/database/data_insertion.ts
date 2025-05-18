import { pool } from './connection_pooling';
import { encrypt } from '../encryption/db_encryption';

const insert_data = async (table: string, data: any, sensitiveFields: string[] = []) => {
    try {
        const encryptedData: { [key: string]: any } = {};

        // Only encrypt fields listed in sensitiveFields
        for (const key in data) {
            if (sensitiveFields.includes(key) && typeof data[key] === "string") {
                encryptedData[key] = encrypt(data[key]);
            } else {
                encryptedData[key] = data[key];
            }
        }

        const keys = Object.keys(encryptedData);
        const values = Object.values(encryptedData);
        const value_placeholders = values.map((_, index) => `$${index + 1}`).join(", ");

        const query = `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${value_placeholders}) RETURNING *`;

        const result = await pool.query(query, values);
        console.log(`[SUCCESS]: Data inserted into table "${table}", data inserted: ${JSON.stringify(result.rows[0])}`);

    } catch (err: any) {
        switch (err.code) {
            case "42703":
                console.error(`[ERROR]: Column does not exist in table "${table}". Check the column names: ${Object.keys(data).join(", ")}`);
                break;
            case "42P01":
                console.error(`[ERROR]: Table "${table}" not found`);
                break;
            default:
                console.error(`[ERROR]: Failed to insert data into table ${table}`, err);
        }
    }
};

export default insert_data;