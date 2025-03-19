const express = require('express');
const router = express.Router();
const pool = require('../config/dbConfig');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');

// Create order from cart - (Public)
router.post('/orders', authenticateToken, async (req, res) => {
    const customerId = req.user.id;
    const { discount_code } = req.body;

    try {
        // Grab the customers cart
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

        // Calculate subtotal for order
        let subtotal = 0;
        
        cartItems.rows.forEach(item => {
            subtotal += item.price * item.quantity;
        });

        let discount = null;

        if (discount_code) {
            const discountResult = await pool.query(
                `SELECT * FROM discount_codes
                WHERE code = $1
                AND active = true
                AND (expires_at IS NULL OR expires_at > NOW())
                AND (usage_limit = 0 OR times_used < usage_limit)`,
                [discount_code]
            );

            if (discountResult.rows.length === 0) {
                return res.status(400).json({ error: 'Invalid or expired discount code' });
            }

            discount = discountResult.rows[0];

            // Minimum order enforcment
            if (subtotal < discount.min_order_total) {
                return res.status(400).json({
                    error: `Minimum order total of $${discount.min_order_total} required to use this discount.`
                });
            }

            // Apply discount to subtotal
            if (discount.discount_type === 'percent') {
                const percentOff = (discount.discount_value / 100) * subtotal;
                subtotal -= percentOff;
            } else if (discount.discount_type === 'fixed') {
                subtotal -= discount.discount_value;
            }

            if (subtotal < 0) {
                subtotal = 0;
            }
            // Increment times_used for the discount code
            await pool.query(
                `UPDATE discount_codes
                SET times_used = times_used + 1
                WHERE id = $1`,
                [discount.id]
            );
        }

        // Calculate tax
        const taxRate = 0.0825;
        const tax = parseFloat((subtotal * taxRate).toFixed(2));

        // Final total
        let totalPrice = subtotal + tax;

        // Create the order
        const orderResult = await pool.query(
            `INSERT INTO orders (customer_id, total_price, tax, status, discount_code_id)
             VALUES ($1, $2, $3, 'pending', $4)
             RETURNING *`,
            [customerId, totalPrice, tax, discount ? discount.id : null]
        );

        const orderId = orderResult.rows[0].id;

        // Log order creation in audit_logs table
        await pool.query(
            `INSERT INTO audit_logs (user_id, action, target_table, target_id, details)
            VALUES ($1, $2, $3, $4, $5)`,
            [
                customerId,
                'order_created',
                'orders',
                orderId,
                JSON.stringify({
                    subtotal: subtotal,
                    tax: tax,
                    total_price: totalPrice,
                    discount_code: discount ? discount.code : null
                })
            ]
        );

        // Insert order items
        const orderItemsPromises = cartItems.rows.map(item => {
            return pool.query(
                `INSERT INTO order_items (order_id, shoe_id, quantity, price)
                 VALUES ($1, $2, $3, $4)`,
                [orderId, item.shoe_id, item.quantity, item.price]
            );
        });

        await Promise.all(orderItemsPromises);

        // Update shoe stock
        const updateStockPromises = cartItems.rows.map(item => {
            return pool.query(
                `UPDATE shoes
                 SET stock = stock - $1
                 WHERE id = $2 AND stock >= $1`,
                [item.quantity, item.shoe_id]
            );
        });

        await Promise.all(updateStockPromises);
        // Clear user's cart
        await pool.query(
            'DELETE FROM cart_items WHERE cart_id = $1',
            [cartId]
        );
        // Return order confirmation + summary
        res.status(201).json({
            message: 'Order created successfully!',
            order: orderResult.rows[0],
            summary: {
                subtotal: subtotal,
                tax: tax,
                total: totalPrice
            }
        });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal server error - create order' });
    }
});

// Get users orders - (Public)
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
// Get all orders (Admin only)
router.get('/orders/all', authenticateToken, authorizeRole('admin'), async (req, res) => {
    try {
        const { sort, order, status, customer_id, page = 1, limit = 10 } = req.query;

        // Validate sort columns
        const sortableFields = ['created_at', 'total_price'];
        const sortBy = sortableFields.includes(sort) ? sort : 'created_at';

        // Validate order direction
        const orderBy = order === 'asc' ? 'ASC' : 'DESC';

        const pageNumber = Math.max(parseInt(page) || 1, 1);
        const pageSize = Math.max(parseInt(limit) || 10, 1);

        const offset = (pageNumber - 1) * pageSize;

        // Build WHERE conditions dynamically
        const conditions = [];
        const values = [];

        if (status) {
            values.push(status);
            conditions.push(`status = $${values.length}`);
        }

        if (customer_id) {
            values.push(customer_id);
            conditions.push(`customer_id = $${values.length}`);
        }

        // Assemble query
        let query = `SELECT * FROM orders`;

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        query += ` ORDER BY ${sortBy} ${orderBy}`;
        query += ` LIMIT ${pageSize} OFFSET ${offset}`;

        console.log('Executing query:', query, values);

        const orders = await pool.query(query, values);

        res.json({
            page: pageNumber,
            limit: pageSize,
            results: orders.rows
        });

    } catch (error) {
        console.error('Error fetching sorted/filtered orders (admin):', error);
        res.status(500).json({ error: 'Internal server error - fetch sorted/filtered orders' });
    }
});

// Get user order details - (Public)
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

// Get any order by id - (Admin only)
router.get('/orders/manage/:order_id', authenticateToken, authorizeRole('admin'), async (req, res) => {
    const orderId = req.params.order_id;

    try {
        const order = await pool.query(
            `SELECT * FROM orders
             WHERE id = $1`,
            [orderId]
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
        console.error('Error fetching order (admin):', error);
        res.status(500).json({ error: 'Internal server error - admin get order' });
    }

    await pool.query(
        `INSERT INTO audit_logs (user_id, action, target_table, target_id, details)
         VALUES($1, $2, $3, $4, $5)`,
        [
            req.user.id,
            'admin_view_order',
            'orders',
            orderId,
            JSON.stringify({ message: 'Admin viewed order details' })
        ]
    );
});

// Update any order status - (Admin only)
router.put('/orders/manage/:order_id/status', authenticateToken, authorizeRole('admin'), async (req, res) => {
    const orderId = req.params.order_id;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'canceled'];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    try {
        const result = await pool.query(
            `UPDATE orders
             SET status = $1
             WHERE id = $2
             RETURNING *`,
            [status, orderId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found.' });
        }

        // Log admin status update in audit_logs
        await pool.query(
            `INSERT INTO audit_logs (user_id, action, target_table, target_id, details)
            VALUES($1, $2, $3, $4, $5)`,
            [
                req.user.id,
                'order_status_updated',
                'orders',
                orderId,
                JSON.stringify({ new_status: status })
            ]
        );

        res.json({
            message: 'Order status updated successfully!',
            order: result.rows[0]
        });

    } catch (error) {
        console.error('Error updating order status (admin):', error);
        res.status(500).json({ error: 'Internal server error - update order status' });
    }
});

module.exports = router;