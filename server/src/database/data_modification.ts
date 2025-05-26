import { pool } from './connection_pooling';
import { encrypt } from '../encryption/db_encryption';

const allowedTables = ['active_users', 'products', 'orders']; // Exempel

const modify_data = async (
    table: string,
    data: Record<string, any>,
    condition: Record<string, any>,
    sensitiveFields: string[] = []
): Promise<any> => {
    try {
        if (!allowedTables.includes(table)) {
            throw new Error(`Invalid table name: ${table}`);
        }

        if (Object.keys(data).length === 0) throw new Error("No fields provided to update.");
        if (Object.keys(condition).length === 0) throw new Error("No condition provided for update.");

        const encryptedData: Record<string, any> = {};

        for (const key in data) {
            if (sensitiveFields.includes(key) && typeof data[key] === 'string') {
                encryptedData[key] = encrypt(data[key]);
            } else {
                encryptedData[key] = data[key];
            }
        }

        const keys = Object.keys(encryptedData);
        const values = Object.values(encryptedData);
        const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");

        const conditionKeys = Object.keys(condition);
        const conditionValues = Object.values(condition);
        const conditionClause = conditionKeys
            .map((key, index) => `${key} = $${keys.length + index + 1}`)
            .join(" AND ");

        const query = `UPDATE ${table} SET ${setClause} WHERE ${conditionClause} RETURNING *`;
        const result = await pool.query(query, [...values, ...conditionValues]);

        console.log(`[SUCCESS]: Updated table "${table}" with keys: ${keys.join(", ")}`);
        return result.rows[0];

    } catch (err: any) {
        switch (err.code) {
            case "42703":
                console.error(`[ERROR]: Column does not exist in table "${table}". Check column names.`);
                break;
            case "42P01":
                console.error(`[ERROR]: Table "${table}" not found.`);
                break;
            default:
                console.error(`[ERROR]: Failed to update data in table "${table}"`, err);
        }
        throw err;
    }
};

export default modify_data;
