const fs = require('fs');
const { Pool } = require('pg');
require('dotenv').config();
//import path from "path";
const path = require("path");

// resolves the path the the certificate (ca.pem)
const caPath = path.resolve(__dirname, "../../src/database/config/ca.pem");

export const table_name_supply_posts = "active_supply_posts";
export const table_name_demand_posts = "active_demand_posts";
export const table_name_users = "active_users";

// Connection Pool Configuration
export const pool = new Pool({
    // For security, dont hard code the connection data
    // To change the connection data, change the values in the .env file
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
        ca: fs.readFileSync(caPath).toString(),
    },
});


// TODO: Move this out into a separate file

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
//check_connection();