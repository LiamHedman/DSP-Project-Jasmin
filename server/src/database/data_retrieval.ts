import { pool } from './connection_pooling';


const retrieve_data = async (table: string, conditions: any = {}) => {
    try {
        // Builds a query dynamically

        // Builds the list of columns for the SELECT query
        const keys = Object.keys(conditions);
        // Retrieves the conditions
        const values = Object.values(conditions);
        // Dynamically builds a WHERE clause based on provided conditions.
        const where_clause = keys.length
            ? `WHERE ${keys.map((key, index) => `${key} = $${index + 1}`).join(' AND ')}`
            : '';

        const query = `SELECT * FROM ${table} ${where_clause}`;
        
        // Executes the query using the pool
        const result = await pool.query(query, values);

        if (result.rows.length > 0) {
            //console.log(`[SUCCESS]: Data retrieved from table "${table}": ${JSON.stringify(result.rows)}`);
        } else {
            console.log(`[INFO]: No matching data found in table "${table}" with given conditions.`);
        }

        // Returns ALL matching rows
        return result.rows;
    } catch (err: any) {
        switch (err.code) {
            case "42P01":   // Undefined table
                console.error(`[ERROR]: Table "${table}" not found.`);
                break;
            default:
                console.error(`[ERROR]: Failed to retrieve data from table "${table}".`, err);
        }
    }
};

export default retrieve_data;
