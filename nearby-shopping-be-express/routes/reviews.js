const express = require('express');
const router = express.Router();
const supabase = require('../config/database');

// Create a new review
router.post('/', async (req, res) => {
	const { userId, productId, rating, feedback } = req.body;

	try {
		// Insert review into Supabase
		const { data, error } = await supabase
			.from('reviews')
			.insert([{ userId, productId, rating, feedback }]);
		if (error) {
			return res.status(500).json({ error: 'Error creating review' });
		}

		res.status(201).json({ message: 'Review created successfully', data });
	} catch (error) {
		console.error('Error creating review:', error.message);
		res.status(500).json({ error: 'Error creating review' });
	}
});

// Get all reviews for a product
router.get('/product/:productId', async (req, res) => {
	const productId = req.params.productId;

	try {
		// Retrieve all reviews for a product from Supabase
		const { data, error } = await supabase
			.from('reviews')
			.select('*')
			.eq('productId', productId);

		if (error) {
			console.log('🚀 ~ router.get ~ error:', error);
			return res.status(500).json({ error: 'Error retrieving reviews' });
		}

		res.json(data);
	} catch (error) {
		console.error('Error retrieving reviews:', error.message);
		res.status(500).json({ error: 'Error retrieving reviews' });
	}
});

// Get all reviews by a user
router.get('/user/:userId', async (req, res) => {
	const userId = req.params.userId;

	try {
		// Retrieve all reviews by a user from Supabase
		const { data, error } = await supabase
			.from('reviews')
			.select('*')
			.eq('userId', userId);

		if (error) {
			return res.status(500).json({ error: 'Error retrieving reviews' });
		}

		res.json(data);
	} catch (error) {
		console.error('Error retrieving reviews:', error.message);
		res.status(500).json({ error: 'Error retrieving reviews' });
	}
});

// Update a review by ID
router.put('/:id', async (req, res) => {
	const reviewId = req.params.id;
	const { rating, review } = req.body;

	try {
		// Update review in Supabase
		const { data, error } = await supabase
			.from('reviews')
			.update({ rating, review })
			.eq('id', reviewId);

		if (error || !data) {
			return res.status(500).json({ error: 'Error updating review' });
		}

		res.json({ message: 'Review updated successfully' });
	} catch (error) {
		console.error('Error updating review:', error.message);
		res.status(500).json({ error: 'Error updating review' });
	}
});

// Delete a review by ID
router.delete('/:id', async (req, res) => {
	const reviewId = req.params.id;

	try {
		// Delete review from Supabase
		const { error } = await supabase
			.from('reviews')
			.delete()
			.eq('id', reviewId);

		if (error) {
			return res.status(500).json({ error: 'Error deleting review' });
		}

		res.json({ message: 'Review deleted successfully' });
	} catch (error) {
		console.error('Error deleting review:', error.message);
		res.status(500).json({ error: 'Error deleting review' });
	}
});

module.exports = router;
