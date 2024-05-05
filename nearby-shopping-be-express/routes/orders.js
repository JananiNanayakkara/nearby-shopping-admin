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
			.insert([{ status, total_price, userId }])
			.select();

		const orderId = data[0].id;

		// Insert order items into Supabase
		const orderItems = productIds.map((orderItem) => {
			return {
				orderId,
				productId: orderItem.productId,
				quantity: orderItem.qty,
			};
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
			console.log('🚀 ~ router.get ~ error:', error);
			return res.status(500).json({ error: 'Error retrieving orders' });
		}

		// Add order items to the response
		for (const order of data) {
			const { data: orders, error: orderItemsError } = await supabase
				.from('order_products')
				.select('productId, quantity')
				.eq('orderId', order.id);

			if (orderItemsError) {
				console.log('🚀 ~ router.get ~ orderItemsError:', orderItemsError);
				return res.status(500).json({ error: 'Error retrieving order items' });
			}

			const orderItems = await supabase
				.from('products')
				.select('*')
				.in(
					'id',
					orders.map((item) => item.productId)
				);

			order.items = orderItems.data.map((item) => {
				const orderItem = orders.find((order) => order.productId === item.id);
				return {
					...item,
					quantity: orderItem.quantity,
				};
			});
		}

		res.json(data);
	} catch (error) {
		console.log('🚀 ~ router.get ~ error:', error);
		console.error('Error retrieving orders:', error.message);
		res.status(500).json({ error: 'Error retrieving orders' });
	}
});

// Get all orders where user is the seller
router.get('/seller/:userId', async (req, res) => {
	const userId = req.params.userId;
	try {
		// Find orders where products has userId
		const { data: products, error: productsError } = await supabase
			.from('products')
			.select('*')
			.eq('userId', userId);

		if (productsError) {
			return res.status(500).json({ error: 'Error retrieving products' });
		}

		const productIds = products.map((product) => product.id);

		// Retrieve all orders for a user from Supabase
		const { data, error } = await supabase
			.from('order_products')
			.select('orderId')
			.in('productId', productIds);

		if (error) {
			return res.status(500).json({ error: 'Error retrieving orders' });
		}

		const orderIds = data.map((order) => order.orderId);
		const { data: orders, error: ordersError } = await supabase
			.from('orders')
			.select('*')
			.in('id', orderIds);

		if (ordersError) {
			return res.status(500).json({ error: 'Error retrieving orders' });
		}

		// Retrieve buyer's address from the users table
		const { data: users, error: usersError } = await supabase
			.from('users')
			.select('id, address, phone')
			.in(
				'user_id',
				orders.map((order) => order.userId)
			);
		console.log('🚀 ~ router.get ~ users:', users);

		if (usersError) {
			return res.status(500).json({ error: 'Error retrieving user addresses' });
		}

		// Add buyer's address to the response
		for (const order of orders) {
			const user = users[0];
			if (user) {
				order.buyerAddress = user.address;
				order.buyerPhone = user.phone;
			}
		}

		// Add order items to the response
		for (const order of orders) {
			const { data: orderItems, error: orderItemsError } = await supabase
				.from('order_products')
				.select('productId')
				.eq('orderId', order.id);

			if (orderItemsError) {
				return res.status(500).json({ error: 'Error retrieving order items' });
			}

			order.items = products.filter((product) =>
				orderItems.find((item) => item.productId === product.id)
			);
		}

		res.json(orders);
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

// Update order status by ID
router.put('/:id/status', async (req, res) => {
	const orderId = req.params.id;
	const { status } = req.body;

	try {
		// Update order status in Supabase
		const { data, error } = await supabase
			.from('orders')
			.update({ status })
			.eq('id', orderId);

		if (error || !data) {
			return res.status(500).json({ error: 'Error updating order status' });
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
		console.error('Error updating order status:', error.message);
		res.status(500).json({ error: 'Error updating order status' });
	}
});

// Get all orders
router.get('/', async (req, res) => {
	try {
		// Retrieve all orders from Supabase
		const { data, error } = await supabase.from('orders').select('*');

		if (error) {
			return res.status(500).json({ error: 'Error retrieving orders' });
		}

		// Add order items to the response
		for (const order of data) {
			const { data: productIds, error: orderItemsError } = await supabase
				.from('order_products')
				.select('productId')
				.eq('orderId', order.id);

			if (orderItemsError) {
				return res.status(500).json({ error: 'Error retrieving order items' });
			}

			const orderItems = await supabase
				.from('products')
				.select('*')
				.in(
					'id',
					productIds.map((item) => item.productId)
				);

			const userInfo = await supabase
				.from('users')
				.select('email')
				.eq('user_id', order.userId);

			order.items = orderItems;
			order.userInfo = userInfo.data[0];
		}

		res.json(data);
	} catch (error) {
		console.error('Error retrieving orders:', error.message);
		res.status(500).json({ error: 'Error retrieving orders' });
	}
});

module.exports = router;
