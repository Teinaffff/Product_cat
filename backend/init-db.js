const fs = require('fs');
const path = require('path');
const client = require('./db');

async function initializeDatabase() {
    try {
        // Read and execute the FAQ table migration
        const faqMigration = fs.readFileSync(
            path.join(__dirname, 'migrations', 'create_faq_table.sql'),
            'utf8'
        );
        
        await client.query(faqMigration);
        console.log('FAQ table created successfully');

        // Add some initial FAQ entries
        const initialFaqs = [
            {
                question: "What is the purpose of this knowledge management system?",
                answer: "This system helps organize and manage sector-specific knowledge and documents in a structured way, making it easier to access and share information."
            },
            {
                question: "How do I create a new folder?",
                answer: "You can create a new folder by clicking the 'Create Folder' button in the folders section and providing a name for the folder."
            },
            {
                question: "Can I organize files into subfolders?",
                answer: "Yes, you can create a hierarchical structure by creating subfolders within existing folders to better organize your content."
            }
        ];

        // Insert initial FAQs
        for (const faq of initialFaqs) {
            await client.query(
                'INSERT INTO faq (question, answer) VALUES ($1, $2) ON CONFLICT DO NOTHING',
                [faq.question, faq.answer]
            );
        }
        console.log('Initial FAQ entries added successfully');

    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

// Run the initialization
initializeDatabase().then(() => {
    console.log('Database initialization completed');
    process.exit(0);
}); 