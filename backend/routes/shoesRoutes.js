// routes/shoesRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../config/dbConfig');

// GET /api/shoes - Return all shoes from DB
router.get('/shoes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM shoes');
        // result.rows will be an array of shoe objects
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching shoes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/shoes/:id - Return single shoe by ID
router.get('/shoes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM shoes');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching shoes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;