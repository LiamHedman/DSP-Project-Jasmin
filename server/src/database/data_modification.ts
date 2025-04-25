import { pool } from './connection_pooling';

const modify_data = async (table: string, data: any, condition: any) => {
    try {
        // Build SET part of the query dynamically
        const keys = Object.keys(data);
        const values = Object.values(data);

        const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");

        // Build WHERE part dynamically
        const conditionKeys = Object.keys(condition);
        const conditionValues = Object.values(condition);

        const conditionClause = conditionKeys
            .map((key, index) => `${key} = $${keys.length + index + 1}`)
            .join(" AND ");

        const query = `UPDATE ${table} SET ${setClause} WHERE ${conditionClause} RETURNING *`;

        const result = await pool.query(query, [...values, ...conditionValues]);

        console.log(`[SUCCESS]: Data updated in table "${table}", updated data: ${JSON.stringify(result.rows[0])}`);

    } catch (err: any) {
        switch (err.code) {
            case "42703":   // undefined_column
                console.error(`[ERROR]: Column does not exist in table "${table}". Check the column names: ${Object.keys(data).join(", ")}`);
                break;
            case "42P01":   // undefined_table
                console.error(`[ERROR]: Table "${table}" not found`);
                break;
            default:
                console.error(`[ERROR]: Failed to update data in table "${table}"`, err);
        }
    }
};

export default modify_data;