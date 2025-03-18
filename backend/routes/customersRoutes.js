const express = require('express');
const router = express.Router();
const pool = require('../config/dbConfig');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'default-fallback-secret';

const authenticateToken = require('../middleware/authenticateToken');


// Register a new customer
router.post('/customers', async (req, res) => {
    const { first_name, last_name, email, password, phone, address } = req.body;

    try {
        // Check if email already exists
        const existingUser = await pool.query('SELECT * FROM customers WHERE email = $1', [email]);

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert the new customer
        const result = await pool.query(
            `INSERT INTO customers (first_name, last_name, email, password_hash, phone, address)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, first_name, last_name, email, phone, address`,
            [first_name, last_name, email, hashedPassword, phone, address]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error registering customers:', error);
        res.status(500).json({ error: 'Internal server error - register' });
    }
});

router.get('/test', (req, res) => {
    res.json({ message: 'Customers route is working!' });
});







// Login customer
router.post('/customers/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await pool.query(
            'SELECT * FROM customers WHERE email = $1',
            [email]
        );

        if (user.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const customer = user.rows[0];

        const validPassword = await bcrypt.compare(password, customer.password_hash);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: customer.id, email: customer.email, role: customer.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error - login' });
    }
});







// Get customer profile by ID (protected route)
router.get('/customers/:id', authenticateToken, async (req, res) => {
    const customerId = req.params.id;

    try {
        // Ensure user can only acces their own profile
        if (req.user.id !== customerId) {
            return res.status(403).json({ error: 'Access denied.' });
        }

        const result = await pool.query(
            'SELECT id, first_name, last_name, email, phone, address FROM customers WHERE id = $1',
            [customerId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error('Error fetching customer profile:', error);
        res.status(500).json({ error: 'Internal server error - profile' });
    }
});

router.put('/customers/:id', authenticateToken, async (req, res) => {
    const customerId = req.params.id;
    const { first_name, last_name, phone, address } = req.body;

    try {
        // Ensure user only updates their own profile
        if (req.user.id !== customerId) {
            return res.status(403).json({ error: 'Access denied.' });
        }

        const result = await pool.query(
            `UPDATE customers
            SET first_name = $1,
            last_name = $2,
            phone = $3,
            address = $4
            WHERE id = $5
            RETURNING id, first_name, last_name, email, phone, address`,
            [first_name, last_name, phone, address, customerId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating customer profile:', error);
        res.status(500).json({ error: 'Internal server error - update profile' });
    }
});

router.delete('/customers/:id', authenticateToken, async (req, res) => {
    const customerId = req.params.id;

    try {
        // Ensure user can only delete their own account
        if (req.user.id !== customerId) {
            return res.status(403).json({ error: 'Access denied.' });
        }

        const result = await pool.query(
            'DELETE FROM customers WHERE id = $1 RETURNING id, first_name, last_name, email',
            [customerId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        res.json({ message: 'Account successfully deleted', customer: result.rows[0] });
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({ error: 'Internal server error - delete profile' });
    }
});

module.exports = router;