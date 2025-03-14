// routes/shoesRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); // Check here if it breaks

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
router.get('/shoes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Parameterized query to prevent injection
        const result = await pool.query('SELECT * FROM shoes WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Shoe not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching she by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;