import { pool } from './connection_pooling';

const delete_data = async (table: string, condition: any) => {
    try {


        // Bulds a DELETE query dynamically
        let query = `DELETE FROM ${table}`;
        let values: any[] = [];

        if (condition && Object.keys(condition).length > 0) {
            const keys = Object.keys(condition)
                .map((key, index) => `${key} = $${index + 1}`)
                .join(" AND ");
            values = Object.values(condition);
            query += ` WHERE ${keys}`;
        }

        query += " RETURNING *";

        // Executes the query using the pool
        const result = await pool.query(query, values);
        if (result.rows.length > 0) {
            // console.log(`[SUCCESS]: Data deleted from table "${table}", data deleted: ${JSON.stringify(result.rows)}`);
        } else {
            console.log(`[INFO]: No matching data found in table "${table}" to delete.`);
            console.log(`[INFO]: condition/criteria used:" ${JSON.stringify(condition)}".`);
        }

    } catch (err: any) {
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