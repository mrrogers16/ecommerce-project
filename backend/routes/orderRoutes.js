const express = require('express');
const router = express.Router();
const pool = require('../config/dbConfig');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/orders', authenticateToken, async (req, res) => {
    const customerId = req.user.id;

    try {
        const cart = await pool.query(
            'SELECT * FROM carts WHERE customer_id = $1',
            [customerId]
        );

        if (cart.rows.length === 0) {
            return res.status(404).json({ error: 'Cart not found.' });
        }

        const cartId = cart.rows[0].id;

        const cartItems = await pool.query(
            `SELECT ci.*, s.price
             FROM cart_items ci
             JOIN shoes s ON ci.shoe_id = s.id
             WHERE ci.cart_id = $1`,
            [cartId]
        );

        if (cartItems.rows.length === 0) {
            return res.status(400).json({ error: 'Cart is empty.' });
        }

        let totalPrice = 0;
        cartItems.rows.forEach(item => {
            totalPrice += item.price * item.quantity;
        });

        const orderResult = await pool.query(
            `INSERT INTO orders (customer_id, total_price, status)
             VALUES ($1, $2, 'pending')
             RETURNING *`,
            [customerId, totalPrice]
        );

        const orderId = orderResult.rows[0].id;

        const orderItemsPromises = cartItems.rows.map(item => {
            return pool.query(
                `INSERT INTO order_items (order_id, shoe_id, quantity, price)
                 VALUES ($1, $2, $3, $4)`,
                [orderId, item.shoe_id, item.quantity, item.price]
            );
        });

        await Promise.all(orderItemsPromises);

        const updateStockPromises = cartItems.rows.map(item => {
            return pool.query(
                `UPDATE shoes
                 SET stock = stock - $1
                 WHERE id = $2 AND stock >= $1`,
                [item.quantity, item.shoe_id]
            );
        });

        await Promise.all(updateStockPromises);

        await pool.query(
            'DELETE FROM cart_items WHERE cart_id = $1',
            [cartId]
        );

        res.status(201).json({
            message: 'Order created successfully!',
            order: orderResult.rows[0]
        });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal server error - create order' });
    }
});

router.get('/orders', authenticateToken, async (req, res) => {
    const customerId = req.user.id;

    try {
        const orders = await pool.query(
            `SELECT * FROM orders
             WHERE customer_id = $1
             ORDER BY created_at DESC`,
            [customerId]
        );

        res.json(orders.rows);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal server error - fetch orders' });
    }
});

router.get('/orders/:order_id', authenticateToken, async (req, res) => {
    const customerId = req.user.id;
    const orderId = req.params.order_id;

    try {
        const order = await pool.query(
            `SELECT * FROM orders
             WHERE id = $1 AND customer_id = $2`,
            [orderId, customerId]
        );

        if (order.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found.' });
        }

        const orderItems = await pool.query(
            `SELECT oi.*, s.name, s.brand, s.image_url
             FROM order_items oi
             JOIN shoes s ON oi.shoe_id = s.id
             WHERE oi.order_id = $1`,
            [orderId]
        );

        res.json({
            order: order.rows[0],
            items: orderItems.rows
        });

    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ error: 'Internal server error - order details' });
    }
});

module.exports = router;