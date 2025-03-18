const express = require('express');
const router = express.Router();
const pool = require('../config/dbConfig');
// const authenticateAdmin = require('../middleware/authenticateAdmin'); // For admin-only later

// Get all active discount codes (For administrators) sorted by creation date
router.get('/discount-codes', async (req, res) => {
    try {
        const discounts = await pool.query(
            `SELECT * FROM discount_codes
             ORDER BY created_at DESC`
        );
        res.json(discounts.rows);
    } catch (error) {
        console.error('Error fetching discount codes:', error);
        res.status(500).json({ error: 'Internal server error - fetch discount codes' });
    }
});

// Create a new discount code (admin only later)
router.post('/discount-codes', async (req, res) => {
    const { code, discount_type, discount_value, min_order_total, expires_at, usage_limit } = req.body;

    if (!code || !discount_type || !discount_value) {
        return res.status(400).json({ error: 'Required fields: code, discount_type, discount_value' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO discount_codes (code, discount_type, discount_value, min_order_total, expires_at, usage_limit)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [code, discount_type, discount_value, min_order_total || 0, expires_at || null, usage_limit || 0]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating discount code:', error);
        res.status(500).json({ error: 'Internal server error - create discount code' });
    }
});

// Validate discount code for checkout
router.post('/discount-codes/validate', async (req, res) => {
    const { code, cartTotal } = req.body;

    try {
        const result = await pool.query(
            `SELECT * FROM discount_codes
             WHERE code = $1
             AND active = true
             AND (expires_at IS NULL OR expires_at > NOW())`,
            [code]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid or expired discount code' });
        }

        const discount = result.rows[0];

        if (cartTotal < discount.min_order_total) {
            return res.status(400).json({ error: `Minimum order total of $${discount.min_order_total} required` });
        }

        res.json({
            message: 'Discount code valid!',
            discount
        });
    } catch (error) {
        console.error('Error validating discount code:', error);
        res.status(500).json({ error: 'Internal server error - validate discount code' });
    }
});

module.exports = router;
