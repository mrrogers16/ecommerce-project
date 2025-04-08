const express = require('express');
const router = express.Router();
const pool = require('../config/dbConfig');
const authenticateToken = require('../middleware/authenticateToken');

// Get current user's cart (Authenticated user)
router.get('/cart', authenticateToken, async (req, res) => {
    const customerId = req.user.id;

    try {
        // Get or create the user's cart
        let cart = await pool.query(
            'SELECT * FROM carts WHERE customer_id = $1',
            [customerId]
        );

        if (cart.rows.length === 0) {
            // Create a new cart if none exists
            cart = await pool.query(
                'INSERT INTO carts (customer_id) VALUES ($1) RETURNING *',
                [customerId]
            );
        }

        // Get the cart items
        const cartItems = await pool.query(
            `SELECT ci.id AS cart_item_id, s.id AS shoe_id, s.name, s.brand, s.price, ci.quantity, ci.selected_size
             FROM cart_items ci
             JOIN shoes s ON ci.shoe_id = s.id
             WHERE ci.cart_id = $1`,
            [cart.rows[0].id]
        );

        res.json({
            cart_id: cart.rows[0].id,
            items: cartItems.rows
        });

    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ error: 'Internal server error - fetch cart' });
    }
});

// Add shoe to cart - (Authenticated user)
router.post('/cart', authenticateToken, async (req, res) => {
    const customerId = req.user.id;
    const { shoe_id, quantity, selectedSize } = req.body;

    if (!shoe_id || !quantity || !selectedSize) {
        return res.status(400).json({ error: 'shoe_id, quantity, and size are required.' });
    }

    try {
        // Get or create the user's cart
        let cart = await pool.query(
            'SELECT * FROM carts WHERE customer_id = $1',
            [customerId]
        );

        if (cart.rows.length === 0) {
            cart = await pool.query(
                'INSERT INTO carts (customer_id) VALUES ($1) RETURNING *',
                [customerId]
            );
        }

        const cartId = cart.rows[0].id;

        // Check if the item already exists in the cart
        const existingItem = await pool.query(
            'SELECT * FROM cart_items WHERE cart_id = $1 AND shoe_id = $2',
            [cartId, shoe_id]
        );

        if (existingItem.rows.length > 0) {
            // Update the quantity
            const updatedItem = await pool.query(
                'UPDATE cart_items SET quantity = quantity + $1 WHERE id = $2 RETURNING *',
                [quantity, existingItem.rows[0].id]
            );
            return res.json(updatedItem.rows[0]);
        } else {
            // Insert new item
            const newItem = await pool.query(
                `INSERT INTO cart_items (cart_id, shoe_id, quantity, selected_size)
                 VALUES ($1, $2, $3, $4) RETURNING *`,
                [cartId, shoe_id, quantity, selectedSize]
            );
            return res.status(201).json(newItem.rows[0]);
        }

    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ error: 'Internal server error - add to cart' });
    }
});

// Delete item from cart - (Authenticated user)
router.delete('/cart/:item_id', authenticateToken, async (req, res) => {
    const customerId = req.user.id;
    const cartItemId = req.params.item_id;

    try {
        // Get the user's cart
        const cart = await pool.query(
            'SELECT * FROM carts WHERE customer_id = $1',
            [customerId]
        );

        if (cart.rows.length === 0) {
            return res.status(404).json({ error: 'Cart not found.' });
        }

        const cartId = cart.rows[0].id;

        // Verify the cart item belongs to the user's cart
        const item = await pool.query(
            'SELECT * FROM cart_items WHERE id = $1 AND cart_id = $2',
            [cartItemId, cartId]
        );

        if (item.rows.length === 0) {
            return res.status(404).json({ error: 'Cart item not found.' });
        }

        await pool.query(
            'DELETE FROM cart_items WHERE id = $1',
            [cartItemId]
        );

        res.json({ message: 'Item removed from cart.' });

    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ error: 'Internal server error - remove from cart' });
    }
});

module.exports = router;
