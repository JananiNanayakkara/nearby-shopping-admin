const express = require('express');
const router = express.Router();
const db = require('../config/database');
const verifyToken = require('../middleware/authMiddleware');

// Create a new review
router.post('/', (req, res) => {
	const { userId, productId, rating, review } = req.body;

	db.run(
		'INSERT INTO reviews (userId, productId, rating, review) VALUES (?, ?, ?, ?)',
		[userId, productId, rating, review],
		function (err) {
			if (err) {
				return res.status(500).json({ error: 'Error creating review' });
			}
			res.status(201).json({ message: 'Review created successfully' });
		}
	);
});

// Get all reviews for a product
router.get('/product/:productId', (req, res) => {
	const productId = req.params.productId;
	db.all(
		'SELECT * FROM reviews WHERE productId = ?',
		[productId],
		(err, reviews) => {
			if (err) {
				return res.status(500).json({ error: 'Error retrieving reviews' });
			}
			res.json(reviews);
		}
	);
});

// Get all reviews by a user
router.get('/user/:userId', (req, res) => {
	const userId = req.params.userId;
	db.all('SELECT * FROM reviews WHERE userId = ?', [userId], (err, reviews) => {
		if (err) {
			return res.status(500).json({ error: 'Error retrieving reviews' });
		}
		res.json(reviews);
	});
});

// Update a review by ID
router.put('/:id', (req, res) => {
	const reviewId = req.params.id;
	const { rating, review } = req.body;

	db.run(
		'UPDATE reviews SET rating=?, review=? WHERE id=?',
		[rating, review, reviewId],
		function (err) {
			if (err) {
				return res.status(500).json({ error: 'Error updating review' });
			}
			res.json({ message: 'Review updated successfully' });
		}
	);
});

// Delete a review by ID
router.delete('/:id', (req, res) => {
	const reviewId = req.params.id;
	db.run('DELETE FROM reviews WHERE id = ?', [reviewId], function (err) {
		if (err) {
			return res.status(500).json({ error: 'Error deleting review' });
		}
		res.json({ message: 'Review deleted successfully' });
	});
});

module.exports = router;
