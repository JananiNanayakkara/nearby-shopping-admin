const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// User registration route
router.post('/register', async (req, res) => {
	const { username, email, password } = req.body;

	// Hash password
	const hashedPassword = await bcrypt.hash(password, 10);

	// Insert user into database
	db.run(
		'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
		[username, email, hashedPassword],
		function (err) {
			if (err) {
				console.log('🚀 ~ router.post ~ err:', err);
				return res.status(500).json({ error: 'Error registering user' });
			}
			res.status(201).json({ message: 'User registered successfully' });
		}
	);
});

// User login route
router.post('/login', async (req, res) => {
	const { email, password } = req.body;

	// Find user by email
	db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
		if (err) {
			return res.status(500).json({ error: 'Error logging in' });
		}

		if (!user) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}

		// Compare passwords
		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}

		// Generate JWT token
		const token = jwt.sign(
			{ userId: user.id, email: user.email },
			'ARGON2024',
			{ expiresIn: '8h' }
		);

		res.json({ token });
	});
});

module.exports = router;
