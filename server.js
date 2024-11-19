const express = require('express');
const path = require('path');
const app = express();
const dotenv = require('dotenv');
const { connectToDatabase } = require('./lib/db'); // Ensure this file exists and is correct
dotenv.config();

// Define the port for local development; Vercel will override this
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files for frontend (if needed)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/saved', require('./api/saved/[id]')); // Handle saved details by ID
app.use('/api/analyze', require('./api/analyze')); // Analyze a site
app.use('/api/rapidAPI', require('./api/rapidAPI')); // RapidAPI handler
app.use('/api/save', require('./api/save')); // Save analysis results
app.use('/api/saved_urls', require('./api/saved_urls')); // Get all saved URLs

// Root route for serving the frontend (if applicable)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        const { db } = await connectToDatabase();
        const status = db ? 'Database connected' : 'Database not connected';
        res.status(200).json({ status: 'API is running!', database: status });
    } catch (error) {
        res.status(500).json({ status: 'API is running!', database: 'Error connecting to database' });
    }
});

// 404 fallback for undefined routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start the server for local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running locally at http://localhost:${PORT}`);
    });
}

// Export the app for Vercel
module.exports = app;
