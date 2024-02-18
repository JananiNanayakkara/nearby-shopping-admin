const express = require('express');
const router = express.Router();
const db = require('../config/database');
const verifyToken = require('../middleware/authMiddleware');

// Create a new order
router.post('/', (req, res) => {
	const { userId, productId, quantity } = req.body;

	db.run(
		'INSERT INTO orders (userId, productId, quantity) VALUES (?, ?, ?)',
		[userId, productId, quantity],
		function (err) {
			if (err) {
				return res.status(500).json({ error: 'Error creating order' });
			}
			res.status(201).json({ message: 'Order created successfully' });
		}
	);
});

// Get all orders for a user
router.get('/user/:userId', (req, res) => {
	const userId = req.params.userId;
	db.all('SELECT * FROM orders WHERE userId = ?', [userId], (err, orders) => {
		if (err) {
			return res.status(500).json({ error: 'Error retrieving orders' });
		}
		res.json(orders);
	});
});

// Get all orders for a product
router.get('/product/:productId', (req, res) => {
	const productId = req.params.productId;
	db.all(
		'SELECT * FROM orders WHERE productId = ?',
		[productId],
		(err, orders) => {
			if (err) {
				return res.status(500).json({ error: 'Error retrieving orders' });
			}
			res.json(orders);
		}
	);
});

// Update an order by ID
router.put('/:id', (req, res) => {
	const orderId = req.params.id;
	const { quantity } = req.body;

	db.run(
		'UPDATE orders SET quantity=? WHERE id=?',
		[quantity, orderId],
		function (err) {
			if (err) {
				return res.status(500).json({ error: 'Error updating order' });
			}
			res.json({ message: 'Order updated successfully' });
		}
	);
});

// Delete an order by ID
router.delete('/:id', (req, res) => {
	const orderId = req.params.id;
	db.run('DELETE FROM orders WHERE id = ?', [orderId], function (err) {
		if (err) {
			return res.status(500).json({ error: 'Error deleting order' });
		}
		res.json({ message: 'Order deleted successfully' });
	});
});

module.exports = router;
