const express = require('express');
const router = express.Router();
require('dotenv').config();
const { connectToDatabase } = require('../lib/db');

router.get('/', async (req, res) => {
    // Setup CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    try {
        const { db } = await connectToDatabase();
        const urlRecordsCollection = db.collection('url_records');

        const results = await urlRecordsCollection.aggregate([
            {
                $lookup: {
                    from: 'keyword_data',
                    localField: '_id',
                    foreignField: 'url_record_id',
                    as: 'keywords',
                },
            },
            {
                $match: {
                    'keywords.0': { $exists: true },
                },
            },
            { $sort: { timestamp: -1 } },
        ]).toArray();

        res.status(200).json(results);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Failed to fetch saved URLs' });
    }
});

module.exports = router;
