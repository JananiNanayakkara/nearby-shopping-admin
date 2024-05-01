const express = require('express');
const router = express.Router();
const supabase = require('../config/database');

// get all users
router.get('/', async (req, res) => {
	try {
		const { data, error } = await supabase.from('users').select('*');

		if (error) {
			return res.status(500).json({ error: 'Error retrieving users' });
		}

		res.json(data);
	} catch (error) {
		console.error('Error retrieving users:', error.message);
		res.status(500).json({ error: 'Error retrieving users' });
	}
});

// get user by ID
router.get('/:id', async (req, res) => {
	const userId = req.params.id;

	try {
		const { data, error } = await supabase
			.from('users')
			.select('*')
			.eq('user_id', userId)
			.single();

		if (error || !data) {
			return res.status(404).json({ error: 'User not found' });
		}

		res.json(data);
	} catch (error) {
		console.error('Error retrieving user:', error.message);
		res.status(500).json({ error: 'Error retrieving user' });
	}
});

// delete user by ID
router.delete('/:id', async (req, res) => {
	const userId = req.params.id;

	try {
		const { error } = await supabase.from('users').delete().eq('id', userId);

		if (error) {
			return res.status(500).json({ error: 'Error deleting user' });
		}

		res.json({ message: 'User deleted successfully' });
	} catch (error) {
		console.error('Error deleting user:', error.message);
		res.status(500).json({ error: 'Error deleting user' });
	}
});

// update user
router.put('/:id', async (req, res) => {
	const userId = req.params.id;
	const { address, username, phone } = req.body;

	try {
		const { data, error } = await supabase
			.from('users')
			.update({ address, username, phone })
			.eq('user_id', userId);

		if (error || !data) {
			return res.status(500).json({ error: 'Error updating user' });
		}

		res.json({ message: 'User updated successfully' });
	} catch (error) {
		console.error('Error updating user:', error.message);
		res.status(500).json({ error: 'Error updating user' });
	}
});

module.exports = router;
