const express = require('express');
const router = express.Router();
const pool = require('../config/dbConfig');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');

// POST a review for a shoe
router.post('/', authenticateToken, async (req, res) => {
    const { shoe_id, rating, comment } = req.body;
    const customer_id = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO reviews (customer_id, shoe_id, rating, review_text)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [customer_id, shoe_id, rating, comment]
        );

        res.status(201).json({ message: 'Review posted', review: result.rows[0] });
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ error: 'Internal server error - POST /reviews/:shoeId' });
    }
});

// GET reviews for a specific shoe
router.get('/:shoeId', async (req, res) => {
    const { shoeId } = req.params;

    try {
        const result = await pool.query(
            `SELECT r.*, u.username
             FROM reviews r
             JOIN customers u ON r.customer_id = u.id
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

// Mark Review as helpful
router.post('/:id/helpful', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `UPDATE reviews SET helpful_count = helpful_count + 1
             WHERE id = $1 RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Review not found' });
        }

        res.json({ message: 'Marked as helpful!', review: result.rows[0] });
    } catch (error) {
        console.error('Error updating helpful votes:', error);
        res.status(500).json({ error: 'Internal server error - update helpful votes' });
    }
});

// Delete review - Customer or Admin can delete
router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const review = await pool.query(`SELECT * FROM reviews WHERE id = $1`, [id]);
        if (review.rows.length === 0) {
            return res.status(404).json({ error: 'Review not found' });
        }

        const reviewOwnerId = review.rows[0].customer_id;
        // Only allow deletion if user is owner or admin
        if (reviewOwnerId != userId && req.user.role != 'admin') {
            return res.status(403).json({ error: 'Unauthorized to delete' });
        }

        await pool.query(`DELETE FROM reviews WHERE id = $1`, [id]);
        res.json({ message: 'Review deleted successfully!' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ error: 'Internal server error - delete review' });
    }
});

//Admin Get all reviews
router.get('/admin/reviews', authenticateToken,authorizeRole('admin'),async(req,res) =>{
    try{
        const result = await pool.query('SELECT * FROM reviews');
        res.json(result.rows);
    } catch(error){
        console.error('Error fetching reviews for admin',error);
        res.status(500).json({error: 'Internal server error - GET /admin/reviews'});
    }

});

module.exports = router;
