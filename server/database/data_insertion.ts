import { pool } from './pool_config.js';

const insert_data = async (table: string, data: any) => {
    try {
        // Bulds a query dynamically

        // Builds the list of columns for the INSERT query
        const keys = Object.keys(data).join(", ");
        // Retrieves the data
        const values = Object.values(data);
        // Builds the value placeholders for the query
        const value_placeholders = values.map((_, index) => `$${index + 1}`).join(", ");

        const query = `INSERT INTO ${table} (${keys}) VALUES (${value_placeholders}) RETURNING *`;

        // Executes the query using the pool
        const result = await pool.query(query, values);
        console.log(`[SUCCESS]: Data inserted into table "${table}", data inserted: ${JSON.stringify(result.rows[0])}`);

    } catch (err) {

        switch (err) {
            case "42703":   // undefined_column
                console.error(`[ERROR]: Column does not exist in table "${table}". Check the column names: ${Object.keys(data).join(", ")}`);
                break;
            case "42P01":   // Undefined table
                console.error(`[ERROR]: table "${table}" not found`);
                break;
            default:
                console.error(`[ERROR]: Failed to insert data into table ${table}`, err);
        }
    }
};

export default insert_data;
