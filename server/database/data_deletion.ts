import { pool } from './pool_config.js';

const delete_data = async (table: string, condition: any) => {
    try {
        // Bulds a DELETE query dynamically
        const keys = Object.keys(condition).map((key, index) => `${key} = $${index + 1}`).join(" AND ");
        const values = Object.values(condition);

        const query = `DELETE FROM ${table} WHERE ${keys} RETURNING *`;

        // Executes the query using the pool
        const result = await pool.query(query, values);
        if (result.rows.length > 0) {
            console.log(`[SUCCESS]: Data deleted from table "${table}", data deleted: ${JSON.stringify(result.rows)}`);
        } else {
            console.log(`[INFO]: No matching data found in table "${table}" to delete.`);
        }

    } catch (err) {

        switch (err.code) {
            case "42703":   // Undefined column
                console.error(`[ERROR]: Column does not exist in table "${table}". Check the column names in your condition: ${Object.keys(condition).join(", ")}`);
                break;
            case "42P01":   // Undefined table
                console.error(`[ERROR]: Table "${table}" not found.`);
                break;
            default:
                console.error(`[ERROR]: Failed to delete data from table "${table}"`, err);
        }
    }
};

export default delete_data;
