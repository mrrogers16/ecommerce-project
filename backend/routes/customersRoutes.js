const express = require('express');
const router = express.Router();
const pool = require('../config/dbConfig');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//COME BACK HERE LATER
//COME BACK HERE LATER
// COME BACK HERE LATERRRRR
const JWT_SECRET = 'supersecretkey'; // Replace this and put it in .env for production 
// COME BACK HERE LATERRRRR
//COME BACK HERE LATER
//COME BACK HERE LATER

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
            { id: customer.id, email: customer.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error - login' });
    }
});

module.exports = router;