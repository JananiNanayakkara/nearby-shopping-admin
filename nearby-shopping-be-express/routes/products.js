const express = require('express');
const router = express.Router();
const db = require('../config/database');
const verifyToken = require('../middleware/authMiddleware');

// Create a new product
router.post('/', (req, res) => {
	const { productName, description, price, isInStock, location, nearestCity } =
		req.body;
	const userId = req.userId; // Get user ID from JWT token

	db.run(
		'INSERT INTO products (productName, description, price, isInStock, location, nearestCity, userId) VALUES (?, ?, ?, ?, ?, ?, ?)',
		[productName, description, price, isInStock, location, nearestCity, userId],
		function (err) {
			if (err) {
				console.log('🚀 ~ router.post ~ err:', err);
				return res.status(500).json({ error: 'Error creating product' });
			}
			res.status(201).json({ message: 'Product created successfully' });
		}
	);
});

// Get all products
router.get('/', (req, res) => {
	db.all('SELECT * FROM products', (err, products) => {
		if (err) {
			return res.status(500).json({ error: 'Error retrieving products' });
		}
		res.json(products);
	});
});

// Get product by ID
router.get('/:id', (req, res) => {
	const productId = req.params.id;
	db.get('SELECT * FROM products WHERE id = ?', [productId], (err, product) => {
		if (err) {
			return res.status(500).json({ error: 'Error retrieving product' });
		}
		if (!product) {
			return res.status(404).json({ error: 'Product not found' });
		}
		res.json(product);
	});
});

// Update product by ID
router.put('/:id', (req, res) => {
	const productId = req.params.id;
	const { productName, description, price, isInStock, location, nearestCity } =
		req.body;

	db.run(
		'UPDATE products SET productName=?, description=?, price=?, isInStock=?, location=?, nearestCity=? WHERE id=?',
		[
			productName,
			description,
			price,
			isInStock,
			location,
			nearestCity,
			productId,
		],
		function (err) {
			if (err) {
				return res.status(500).json({ error: 'Error updating product' });
			}
			res.json({ message: 'Product updated successfully' });
		}
	);
});

// Delete product by ID
router.delete('/:id', (req, res) => {
	const productId = req.params.id;
	db.run('DELETE FROM products WHERE id = ?', [productId], function (err) {
		if (err) {
			return res.status(500).json({ error: 'Error deleting product' });
		}
		res.json({ message: 'Product deleted successfully' });
	});
});

module.exports = router;
