const express = require('express');
const router = express.Router();
const supabase = require('../config/database');

// Create a new order
router.post('/', async (req, res) => {
	const { userId, productId, quantity } = req.body;

	try {
		// Insert order into Supabase
		const { data, error } = await supabase
			.from('orders')
			.insert([{ userId, productId, quantity }]);

		if (error) {
			return res.status(500).json({ error: 'Error creating order' });
		}

		res.status(201).json({ message: 'Order created successfully', data });
	} catch (error) {
		console.error('Error creating order:', error.message);
		res.status(500).json({ error: 'Error creating order' });
	}
});

// Get all orders for a user
router.get('/user/:userId', async (req, res) => {
	const userId = req.params.userId;

	try {
		// Retrieve all orders for a user from Supabase
		const { data, error } = await supabase
			.from('orders')
			.select('*')
			.eq('userId', userId);

		if (error) {
			return res.status(500).json({ error: 'Error retrieving orders' });
		}

		res.json(data);
	} catch (error) {
		console.error('Error retrieving orders:', error.message);
		res.status(500).json({ error: 'Error retrieving orders' });
	}
});

// Get all orders for a product
router.get('/product/:productId', async (req, res) => {
	const productId = req.params.productId;

	try {
		// Retrieve all orders for a product from Supabase
		const { data, error } = await supabase
			.from('orders')
			.select('*')
			.eq('productId', productId);

		if (error) {
			return res.status(500).json({ error: 'Error retrieving orders' });
		}

		res.json(data);
	} catch (error) {
		console.error('Error retrieving orders:', error.message);
		res.status(500).json({ error: 'Error retrieving orders' });
	}
});

// Update an order by ID
router.put('/:id', async (req, res) => {
	const orderId = req.params.id;
	const { quantity } = req.body;

	try {
		// Update order in Supabase
		const { data, error } = await supabase
			.from('orders')
			.update({ quantity })
			.eq('id', orderId);

		if (error || !data) {
			return res.status(500).json({ error: 'Error updating order' });
		}

		res.json({ message: 'Order updated successfully' });
	} catch (error) {
		console.error('Error updating order:', error.message);
		res.status(500).json({ error: 'Error updating order' });
	}
});

// Delete an order by ID
router.delete('/:id', async (req, res) => {
	const orderId = req.params.id;

	try {
		// Delete order from Supabase
		const { error } = await supabase.from('orders').delete().eq('id', orderId);

		if (error) {
			return res.status(500).json({ error: 'Error deleting order' });
		}

		res.json({ message: 'Order deleted successfully' });
	} catch (error) {
		console.error('Error deleting order:', error.message);
		res.status(500).json({ error: 'Error deleting order' });
	}
});

module.exports = router;
