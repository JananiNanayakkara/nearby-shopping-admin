// routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const supabase = require('../config/database');

// User registration route
router.post('/register', async (req, res) => {
	const { email, password } = req.body;

	try {
		// Register user with Supabase
		const { user, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo:
					'https://nearby-shopping-be-express.fly.dev/verify-email',
			},
		});
		console.log('🚀 ~ router.post ~ user:', user);

		if (error) {
			console.log('🚀 ~ router.post ~ error:', error);
			return res.status(500).json({ error: 'Error registering user' });
		}

		res.status(201).json({ message: 'User registered successfully', user });
	} catch (error) {
		console.error('Error registering user:', error.message);
		res.status(500).json({ error: 'Error registering user' });
	}
});

// User login route
router.post('/login', async (req, res) => {
	const { email, password } = req.body;

	try {
		// Login user with Supabase
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		const { user, session } = data;
		if (error || !session) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}

		const token = session.access_token;
		const { id } = user;

		res.json({ id, email, token });
	} catch (error) {
		console.error('Error logging in:', error.message);
		res.status(500).json({ error: 'Error logging in' });
	}
});

module.exports = router;
