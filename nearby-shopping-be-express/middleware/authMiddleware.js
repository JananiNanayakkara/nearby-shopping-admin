const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
	const token = req.headers['Authorization'];

	if (!token) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	jwt.verify(token, 'ARGON2024', (err, decoded) => {
		if (err) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		req.userId = decoded.userId;
		next();
	});
}

module.exports = verifyToken;
