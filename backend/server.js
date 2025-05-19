// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const client = require('./db'); // Importing the db connection
const authenticateJWT = require('./middleware/auth'); // Importing the authentication middleware

// Importing route files
const fileRoute = require('./route/fileroutes');
const folderRoute = require('./route/folderroute'); 
const authRoute = require('./route/authroute');
const faq  = require('./route/faqroute');

const app = express();

// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

// Other middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// Using the routes
app.use('/api/files', fileRoute);      // Route for file operations
app.use('/api/folders', folderRoute);  // Route for folder operations
app.use('/api/auth', authRoute);       // Route for authentication
app.use('/api/faq', faq);             // Route for FAQ operations

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('=================================');
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📁 File operations enabled`);
    console.log(`📂 Folder management active`);
    console.log(`❓ FAQ system initialized`);
    console.log('=================================');
});
