const fs = require('fs');
const { Pool } = require('pg');
require('dotenv').config();


// Connection Pool Configuration
export const pool = new Pool({
    // For security, dont hard code the connection data
    // To change the connection data, change the values in the .dotenv file
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    max: 10, // Maximum number of connections in the pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync("./ca.pem").toString(),
    },
});

// Test queries to check that the database has been connected to
const check_connection = async () => {
    try {
        // Acquires a client from the pool
        const client = await pool.connect();

        // Logs the Postgre version
        const versionResult = await client.query("SELECT VERSION()");
        console.log("PostgreSQL version:", versionResult.rows[0].version);

        // Releases the client back to the pool
        client.release();
    } catch (err) {
        console.error("Error during database connection:", err);
    } finally {
        // Optional: Close the pool when your application ends
        await pool.end();
    }
};

// Run the queries
check_connection();
