// config/database.js
const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite database (if it doesn't exist, it will be created)
const db = new sqlite3.Database('./config/data.db', (err) => {
	if (err) {
		console.error('Error connecting to SQLite database:', err.message);
	} else {
		console.log('Connected to SQLite database.');
	}
});

module.exports = db;
