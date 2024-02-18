const express = require('express');
const router = express.Router();
const db = require('../config/database');
const verifyToken = require('../middleware/authMiddleware');

// Get user profile
router.get('/profile', (req, res) => {
	const userId = req.userId; // Get user ID from JWT token
	db.get(
		'SELECT id, username, email FROM users WHERE id = ?',
		[userId],
		(err, user) => {
			if (err) {
				return res.status(500).json({ error: 'Error retrieving user profile' });
			}
			if (!user) {
				return res.status(404).json({ error: 'User not found' });
			}
			res.json(user);
		}
	);
});

// Update user profile
router.put('/profile', (req, res) => {
	const userId = req.userId; // Get user ID from JWT token
	const { username, email } = req.body;

	db.run(
		'UPDATE users SET username=?, email=? WHERE id=?',
		[username, email, userId],
		function (err) {
			if (err) {
				return res.status(500).json({ error: 'Error updating user profile' });
			}
			res.json({ message: 'User profile updated successfully' });
		}
	);
});

module.exports = router;
