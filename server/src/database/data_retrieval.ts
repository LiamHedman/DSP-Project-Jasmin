import { decrypt } from '../encryption/db_encryption';
import { pool } from './connection_pooling';

const retrieve_data = async (table: string, conditions: any = {}, sensitiveFields: string[] = []) => {
    try {
        const keys = Object.keys(conditions);
        const values = Object.values(conditions);
        const where_clause = keys.length
            ? `WHERE ${keys.map((key, index) => `${key} = $${index + 1}`).join(' AND ')}`
            : '';

        const query = `SELECT * FROM ${table} ${where_clause}`;
        console.log(`res query`, query);
        const result = await pool.query(query, values);
        console.log(`res result length`, result.rows.length);

        if (result.rows.length > 0) {
            // Decrypt only the specified fields
            result.rows.forEach((row: { [key: string]: any }) => {
                sensitiveFields.forEach(field => {
                    if (row[field] && typeof row[field] === "string" && row[field].includes(":")) {
                        try {
                            row[field] = decrypt(row[field]);
                        } catch (err) {
                            console.warn(`[WARN]: Failed to decrypt field "${field}" in row. Leaving it as is.`);
                        }
                    }
                });
            });

            console.log(`[SUCCESS]: Retrieved and decrypted data from "${table}".`);
        } else {
            console.log(`[INFO]: No matching data found in table "${table}".`);
        }

        return result.rows;
    } catch (err: any) {
        switch (err.code) {
            case "42P01":
                console.error(`[ERROR]: Table "${table}" not found.`);
                break;
            default:
                console.error(`[ERROR]: Failed to retrieve data from table "${table}".`, err);
        }
    }
};

export default retrieve_data;
