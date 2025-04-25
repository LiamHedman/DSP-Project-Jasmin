import { pool } from './connection_pooling';

// CLEARS a WHOLE table
const clear_table = async (tableName: string): Promise<void> => {
    const query = `TRUNCATE TABLE ${tableName} RESTART IDENTITY CASCADE;`;
    await pool.query(query);
};

export default clear_table; 