const supabase = require('../config/database');

const verifyToken = async (req, res, next) => {
	const accessToken = req.headers.authorization;
	console.log('🚀 ~ verifyToken ~ accessToken:', accessToken);

	if (!accessToken) {
		return res.status(401).json({ error: 'Access token is missing' });
	}

	try {
		// Verify token with Supabase
		const { data, error } = await supabase.auth.getUser(accessToken);
		console.log('🚀 ~ verifyToken ~ data:', data);
		console.log('🚀 ~ verifyToken ~ error:', error);

		if (error || !data) {
			return res.status(401).json({ error: 'Invalid access token' });
		}

		req.user = data; // Attach user data to request object
		next(); // Call next middleware
	} catch (error) {
		console.error('Error verifying access token:', error.message);
		res.status(500).json({ error: 'Internal server error' });
	}
};

module.exports = verifyToken;
