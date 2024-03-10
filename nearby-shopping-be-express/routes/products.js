const express = require('express');
const router = express.Router();
const supabase = require('../config/database');

// Create a new product
router.post('/', async (req, res) => {
	const {
		productName,
		description,
		price,
		isInStock,
		location,
		nearestCity,
		userId,
		type,
	} = req.body;

	try {
		// Insert product into Supabase
		const { data, error } = await supabase.from('products').insert([
			{
				productName,
				description,
				price,
				isInStock,
				location,
				nearestCity,
				userId,
				type,
			},
		]);

		if (error) {
			console.log('🚀 ~ router.post ~ error:', error);
			return res.status(500).json({ error: 'Error creating product' });
		}

		res.status(201).json({ message: 'Product created successfully', data });
	} catch (error) {
		console.error('Error creating product:', error.message);
		res.status(500).json({ error: 'Error creating product' });
	}
});

// Get products by user ID
router.get('/user/:userId', async (req, res) => {
	const userId = req.params.userId;

	try {
		// Retrieve all products for a user from Supabase
		const { data, error } = await supabase
			.from('products')
			.select('*')
			.eq('userId', userId);

		if (error) {
			return res.status(500).json({ error: 'Error retrieving products' });
		}

		res.json(data);
	} catch (error) {
		console.error('Error retrieving products:', error.message);
		res.status(500).json({ error: 'Error retrieving products' });
	}
});

// Get all products
router.get('/', async (req, res) => {
	try {
		// Retrieve all products from Supabase
		const { data, error } = await supabase.from('products').select('*');

		if (error) {
			return res.status(500).json({ error: 'Error retrieving products' });
		}

		res.json(data);
	} catch (error) {
		console.error('Error retrieving products:', error.message);
		res.status(500).json({ error: 'Error retrieving products' });
	}
});

// Get product by ID
router.get('/:id', async (req, res) => {
	const productId = req.params.id;

	try {
		// Retrieve product by ID from Supabase
		const { data, error } = await supabase
			.from('products')
			.select('*')
			.eq('id', productId)
			.single();

		if (error || !data) {
			return res.status(404).json({ error: 'Product not found' });
		}

		res.json(data);
	} catch (error) {
		console.error('Error retrieving product:', error.message);
		res.status(500).json({ error: 'Error retrieving product' });
	}
});

// Update product by ID
router.put('/:id', async (req, res) => {
	const productId = req.params.id;
	const { productName, description, price, isInStock, location, nearestCity } =
		req.body;

	try {
		// Update product in Supabase
		const { data, error } = await supabase
			.from('products')
			.update({
				productName,
				description,
				price,
				isInStock,
				location,
				nearestCity,
			})
			.eq('id', productId);

		if (error || !data) {
			return res.status(500).json({ error: 'Error updating product' });
		}

		res.json({ message: 'Product updated successfully' });
	} catch (error) {
		console.error('Error updating product:', error.message);
		res.status(500).json({ error: 'Error updating product' });
	}
});

// Delete product by ID
router.delete('/:id', async (req, res) => {
	const productId = req.params.id;

	try {
		// Delete product from Supabase
		const { error } = await supabase
			.from('products')
			.delete()
			.eq('id', productId);

		if (error) {
			return res.status(500).json({ error: 'Error deleting product' });
		}

		res.json({ message: 'Product deleted successfully' });
	} catch (error) {
		console.error('Error deleting product:', error.message);
		res.status(500).json({ error: 'Error deleting product' });
	}
});

module.exports = router;
