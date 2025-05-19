const { Client } = require('pg');
require('dotenv').config();

// Create a new client instance
const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const connectDb = async () => {
    try {
        // Establish connection to the database
        await client.connect();
        console.log('Connected to PostgreSQL database');
    } catch (err) {
        console.error('Database connection error', err.stack);
    }
};

// Call the connection function
connectDb();

// Export the client so it can be used in other parts of the application
module.exports = client;
