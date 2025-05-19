// pdfModel.js
const { Pool } = require('pg');
const dotenv = require('dotenv');


dotenv.config();

// Configure PostgreSQL connection using environment variables
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
});

// Function to create users table
const createUsersTable = async () => {
    try {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                isAdmin BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await pool.query(createTableQuery);
        console.log('Users table created successfully or already exists');
    } catch (error) {
        console.error('Error creating users table:', error.stack);
    }
};

const checkConnection = async () => {
    try {
        await pool.query('SELECT NOW()'); // Simple query to check the connection
        console.log('Database connected successfully');
        // Create users table after successful connection
        await createUsersTable();
    } catch (error) {
        console.error('Database connection error:', error.stack);
    }
};

// Call the checkConnection function
checkConnection();

// Existing savePdf and getPdf functions...
module.exports = { pool, checkConnection, createUsersTable };
