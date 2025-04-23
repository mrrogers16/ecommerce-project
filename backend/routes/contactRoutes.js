const express = require('express');
const router = express.Router();
const pool = require('../config/dbConfig');
const xss = require('xss');


// POST /api/contact
router.post('/contact', async (req, res) => 
{
    try 
    {
        let { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message)
        {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Sanitize
        name = xss(name.trim());
        email = xss(email.trim());
        subject = xss(subject.trim());
        message = xss(message.trim());

        // Email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email))
        {
            return res.status(400).json({ error: 'Invalid email format.' });
        }

        const result = await pool.query(
            `INSERT INTO contact_messages (name, email, subject, message)
            VALUES ($1, $2, $3, $4)
            RETURNING id, created_at`,
            [name, email, subject, message]
        );

        res.status(201).json({
            message: 'Thank you for contacting us! We will get back to you soon.',
            ticket_id: result.rows[0].id,
            timestamp: result.rows[0].created_at
        });
    }
    catch (error)
    {
        console.error('Error handling contact form:', error);
        res.status(500).json({ error: 'Internal server error - contact form' });
    }
});

module.exports = router;

