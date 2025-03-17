// routes/shoesRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../config/dbConfig');

// GET /api/shoes - Return all shoes from DB
router.get('/shoes', async (req, res) => {
    try {

        const { brand, size, priceMin, priceMax } = req.query;

        //Base query
        let query = 'SELECT * FROM shoes';
        const conditions = [];
        const values = [];

        if (brand) {
            values.push(brand);
            conditions.push(`brand ILIKE $${values.length}`); // Case insensitive
        }

        if (size) {
            values.push(size);
            conditions.push(`$${values.length} = ANY (sizes)`);
        }

        if (priceMin) {
            values.push(priceMin);
            conditions.push(`price >= $${values.length}`);
        }

        if (priceMax) {
            values.push(priceMax);
            conditions.push(`price <= $${values.length}`);
        }

        // Combine conditions
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        console.log('Executing query:', query, values);

        // Run it
        const result = await pool.query(query, values);

        res.json(result.rows);

    } catch (error) {
        console.error('Error fetching shoes:', error);
        res.status(500).json({ error: 'Internal server error - /shoes' });
    }
});

// GET /api/shoes/:id - Return single shoe by ID
router.get('/shoes/:id', async (req, res) => {

    const { id } = req.params; // Grab the id from the URL

    try {
        const result = await pool.query('SELECT * FROM shoes WHERE id = $1', [id]);

        // If none found return 404
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Shoe not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching shoes:', error);
        res.status(500).json({ error: 'Internal server error - /shoes/:id' });
    }
});

module.exports = router;