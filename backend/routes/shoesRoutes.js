// routes/shoesRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../config/dbConfig');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');

// GET /api/shoes - Return all shoes from DB (Public)
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

// GET /api/shoes/:id - Return single shoe by ID (Public)
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

// POST /api/shoes - Create a new shoe (Admin only)
router.post('/shoes', authenticateToken, authorizeRole('admin'), async (req, res) => {
    const { name, brand, price, stock, sizes, image_url } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO shoes (name, brand, price, stock, sizes, image_url)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING *`,
            [name, brand, price, stock, sizes, image_url]
        );

        res.status(201).json({
            message: 'Shoe created successfully',
            shoe: result.rows[0]
        });
    }
    catch (error) {
        console.error('Error creating shoe:', error);
        res.status(500).json({ error: 'Internal server error - POST /shoes' });
    }
});

// PUT /api/shoes/:id - Update an existing shoe (Admin only)
router.put('/shoes/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
    const { id } = req.params;
    const { name, brand, price, stock, sizes, image_url } = req.body;

    try {
        const result = await pool.query(
            `UPDATE shoes
                 SET name = $1,
                     brand = $2,
                     price = $3,
                     stock = $4,
                     sizes = $5,
                     image_url = $6
                 WHERE id = $7
                 RETURNING *`,
            [name, brand, price, stock, sizes, image_url, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Shoe not found' });
        }

        res.json({
            message: 'Shoe updated successfully',
            shoe: result.rows[0]
        });
    }
    catch (error) {
        console.error('Error updating shoe:', error);
        res.status(500).json({ error: 'Internal server error - PUT /shoes/:id' });
    }
});

// DELETE /api/shoes/:id - Delete an existing shoe (Admin only)

router.delete('/shoes/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM shoes WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Shoe not found' });
        }

        res.json({
            message: 'Shoe deleted successfully',
            shoe: result.rows[0]
        });
    }
    catch (error) {
        console.error('Error deleting shoe:', error);
        res.status(500).json({ error: 'Internal server error - DELETE /shoes/:id' });
    }
});

module.exports = router;