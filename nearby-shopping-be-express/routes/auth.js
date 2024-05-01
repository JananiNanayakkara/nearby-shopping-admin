// routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const supabase = require('../config/database');

// User registration route
router.post('/register', async (req, res) => {
	const { email, password, address, phone } = req.body;

	try {
		// Register user with Supabase
		const { data: userData, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo:
					'https://nearby-shopping-be-express.fly.dev/verify-email',
			},
		});

		console.log('🚀 ~ router.post ~ user:', userData);

		const { data, error: createUserError } = await supabase
			.from('users')
			.insert([{ user_id: userData.user.id, email, address, phone }])
			.select();

		console.log('🚀 ~ router.post ~ data:', data);

		if (createUserError) {
			console.log('🚀 ~ router.post ~ error:', createUserError);
			return res.status(500).json({ error: 'Error creating user profile' });
		}

		if (error) {
			console.log('🚀 ~ router.post ~ error:', error);
			return res.status(500).json({ error: 'Error registering user' });
		}

		res.status(201).json({ message: 'User registered successfully', data });
	} catch (error) {
		console.log('🚀 ~ router.post ~ error:', error);
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

router.post('/admin-login', async (req, res) => {
	const { email, password } = req.body;

	try {
		// Login user with Supabase
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		const { user, session } = data;

		if (user) {
			const { data, error } = await supabase
				.from('users')
				.select()
				.eq('user_id', user.id);

			if (data[0].role !== 'admin') {
				return res.status(401).json({ error: 'Invalid credentials' });
			}

			if (error || !data) {
				return res.status(401).json({ error: 'Invalid credentials' });
			}
		}

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
