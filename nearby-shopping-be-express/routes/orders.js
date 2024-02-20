const express = require('express');
const router = express.Router();
const supabase = require('../config/database');

// Create a new order
router.post('/', async (req, res) => {
	const { userId, productIds, status, total_price } = req.body;

	try {
		// Insert order into Supabase
		const { data, error } = await supabase
			.from('orders')
			.insert([{ status, total_price }]);

		const orderId = data[0].id;

		// Insert order items into Supabase
		const orderItems = productIds.map((productId) => {
			return { orderId, productId };
		});

		const { error: error2 } = await supabase
			.from('order_products')
			.insert(orderItems);

		if (error || error2) {
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

		// Add order items to the response
		for (const order of data) {
			const { data: orderItems, error: orderItemsError } = await supabase
				.from('order_products')
				.select('productId')
				.eq('orderId', order.id);

			if (orderItemsError) {
				return res.status(500).json({ error: 'Error retrieving order items' });
			}

			order.items = orderItems;
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

		// Add order items to the response
		for (const order of data) {
			const { data: orderItems, error: orderItemsError } = await supabase
				.from('order_products')
				.select('productId')
				.eq('orderId', order.id);

			if (orderItemsError) {
				return res.status(500).json({ error: 'Error retrieving order items' });
			}

			order.items = orderItems;
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

		// Retrieve the updated order from Supabase
		const { data: updatedOrder, error: updatedOrderError } = await supabase
			.from('orders')
			.select('*')
			.eq('id', orderId);

		if (updatedOrderError) {
			return res.status(500).json({ error: 'Error retrieving updated order' });
		}

		// Add order items to the response
		const { data: orderItems, error: orderItemsError } = await supabase
			.from('order_products')
			.select('productId')
			.eq('orderId', orderId);

		if (orderItemsError) {
			return res.status(500).json({ error: 'Error retrieving order items' });
		}

		updatedOrder[0].items = orderItems;

		res.json(updatedOrder[0]);
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

		// Delete order items associated with the order
		const { error: deleteItemsError } = await supabase
			.from('order_products')
			.delete()
			.eq('orderId', orderId);

		if (deleteItemsError) {
			return res.status(500).json({ error: 'Error deleting order items' });
		}

		res.json({ message: 'Order deleted successfully' });
	} catch (error) {
		console.error('Error deleting order:', error.message);
		res.status(500).json({ error: 'Error deleting order' });
	}
});

module.exports = router;
