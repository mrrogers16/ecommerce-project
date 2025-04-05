const express = require('express');
const router = express.Router();
const pool = require('../config/dbConfig');
const authenticateToken = require('../middleware/authenticateToken');

// POST a review for a shoe
router.post('/reviews/:shoeId', authenticateToken, async (req, res) => {
    const { shoeId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO reviews (user_id, shoe_id, rating, comment)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [userId, shoeId, rating, comment]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ error: 'Internal server error - POST /reviews/:shoeId' });
    }
});

// GET reviews for a specific shoe
router.get('/reviews/:shoeId', async (req, res) => {
    const { shoeId } = req.params;

    try {
        const result = await pool.query(
            `SELECT r.*, u.username
             FROM reviews r
             JOIN users u ON r.user_id = u.id
             WHERE r.shoe_id = $1
             ORDER BY r.created_at DESC`,
            [shoeId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Internal server error - GET /reviews/:shoeId' });
    }
});

//Mark Review as helpful 
router.post('/reviews/:id/helpful',authenticateToken,async(req,res) => {
    const { id } = req.params;

    try{
        const result = await pool.query(
            `UPDATE reviews SET helpful_votes = helpful_votes + 1 WHERE id = $1 RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Review not found '});
        }
        
        res.json({ message: 'Marked as helpful!', review: result.rows[0] });
    } catch (error){
        console.error('Error updating helpful votes:',error);
        res.status(500).json({error: 'Internal server error - update helpful votes'});
    }
});

//Delete review
router.delete('/reviews/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.userId;

    try {
        const review = await pool.query(`SELECT * FROM reviews WHERE id = $1`, [id]);

        if (review.rows.length === 0) {
            return res.status(404).json({ error: 'Review not found' });
        }

        // Only allow deletion if user is owner or admin
        if (review.rows[0].user_id !== user_id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await pool.query(`DELETE FROM reviews WHERE id = $1`, [id]);
        res.json({ message: 'Review deleted successfully!' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ error: 'Internal server error - delete review' });
    }
});
