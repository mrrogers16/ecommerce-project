// routes/shoesRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../config/dbConfig');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');

// GET /api/shoes - Return all shoes from DB (Public)
router.get('/shoes', async (req, res) => {
    try {
        const { brand, size, priceMin, priceMax, category, page = 1, limit = 10, sort = 'created_at', order = 'desc' } = req.query;

        const sortableFields = ['created_at', 'price', 'name'];
        const sortBy = sortableFields.includes(sort) ? sort : 'created_at';
        const orderBy = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

        const pageNumber = Math.max(parseInt(page) || 1, 1);
        const pageSize = Math.max(parseInt(limit) || 10, 1);
        const offset = (pageNumber - 1) * pageSize;

        const conditions = [];
        const values = [];

        if (brand) {
            values.push(brand);
            conditions.push(`brand ILIKE $${values.length}`);
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

        if (category) {
            values.push(category);
            conditions.push(`category = $${values.length}`);
        }

        let query = `SELECT * FROM shoes`;
        let countQuery = `SELECT COUNT(*) FROM shoes`;

        if (conditions.length > 0) {
            const whereClause = ` WHERE ${conditions.join(' AND ')}`;
            query += whereClause;
            countQuery += whereClause;
        }

        query += ` ORDER BY ${sortBy} ${orderBy} LIMIT ${pageSize} OFFSET ${offset}`;

        console.log('Executing query:', query, values);

        const [shoesResult, countResult] = await Promise.all([
            pool.query(query, values),
            pool.query(countQuery, values)
        ]);

        const totalCount = parseInt(countResult.rows[0].count, 10);
        const totalPages = Math.ceil(totalCount / pageSize);

        res.json({
            page: pageNumber,
            limit: pageSize,
            totalPages,
            totalCount,
            results: shoesResult.rows
        });

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
    const { name, brand, price, stock, sizes, image_url, category } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO shoes (name, brand, price, stock, sizes, image_url, category)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 RETURNING *`,
            [name, brand, price, stock, sizes, image_url, category]
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
    const { name, brand, price, stock, sizes, image_url, category } = req.body;

    try {
        const result = await pool.query(
            `UPDATE shoes
                 SET name = $1,
                     brand = $2,
                     price = $3,
                     stock = $4,
                     sizes = $5,
                     image_url = $6,
                     category = $7
                 WHERE id = $8
                 RETURNING *`,
            [name, brand, price, stock, sizes, image_url, category, id]
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

//PUT /api/shoes - Update multiple shoes at once(Admin Only)
router.put('/shoes', authenticateToken, authorizeRole('admin'), async (req, res) => {
    const { shoes } = req.body;

    if (!Array.isArray(shoes) || shoes.length === 0) {
        return res.status(400).json({ error: 'Invalid input: Provide an array of shoes to update' });
    }

    const updateShoes = [];

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        for (const shoe of shoes) {
            const { id, ...fieldsToUpdate } = shoe;

            if (!id) {
                throw new Error('Each shoe must have an ID');
            }

            const keys = Object.keys(fieldsToUpdate);
            if (keys.length == 0) {
                continue; // No fields to update
            }

            const setClauses = keys.map((key, includes) => `${key} = $${index + 1}`);
            const values = keys.map(key => fieldsToUpdate[key]);

            const query = `
            UPDATE shoes
            SET ${setClauses.join(', ')}
            WHERE id = $${keys.length + 1}
            RETURNING *;
            `;

            const result = await client.query(query, [...values, id]);
            if (result.rows.length > 0) {
                updatedShoes.push(result.rows[0]);
            }
        }

        await client.query('COMMIT');

        res.json({
            message: `${updatedShoes.length} shoes update successfully`,
            updateShoes
        });
    }

    catch (error) {
        await client.query('ROLLBACK');
        console.error('Update error', error);
        res.status(500).json({ error: 'Internal server error - bulk update' });
    }

    finally {
        client.release()
    }

    // try {
    //     const ids = [];
    //     const names = [];
    //     const brands = [];
    //     const prices = [];
    //     const stocks = [];
    //     const sizes = [];
    //     const imageUrls = [];

    //     shoes.forEach(shoe => {
    //         ids.push(shoe.id);
    //         names.push(shoe.name);
    //         brands.push(shoe.brand);
    //         prices.push(shoe.price);
    //         stocks.push(shoe.stock);
    //         sizes.push(shoe.sizes);
    //         imageUrls.push(shoe.image_url);
    //     });

    //     const query = `
    //         UPDATE shoes 
    //         SET name = data.name, 
    //             brand = data.brand, 
    //             price = data.price, 
    //             stock = data.stock, 
    //             sizes = data.sizes, 
    //             image_url = data.image_url
    //         FROM (SELECT
    //                 UNNEST($1::int[]) AS id,
    //                 UNNEST($2::text[]) AS name, 
    //                 UNNEST($3::text[]) AS brand, 
    //                 UNNEST($4::numeric[]) AS price, 
    //                 UNNEST($5::int[]) AS stock, 
    //                 UNNEST($6::integer[][]) AS sizes, 
    //                 UNNEST($7::text[]) AS image_url
    //               ) AS data
    //         WHERE shoes.id = data.id
    //         RETURNING shoes.*;
    //     `;

    //     const result = await pool.query(query, [ids, names, brands, prices, stocks, sizes, imageUrls]);

    //     res.json({
    //         message: `Shoes updated successfully`,
    //         updatedShoes: result.rows
    //     });

    // } catch (error) {
    //     console.error(`Error updating multile shoes:`, error);
    //     res.status(500).json({ error: `Internal error - PUT /shoes (bulk update)` });
    // }
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
