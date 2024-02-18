// config/tables.js
// const supabase = require('./database');

// const userSchema = {
// 	tableName: 'users',
// 	columns: [
// 		{ name: 'id', type: 'integer', primaryKey: true, autoIncrement: true },
// 		{ name: 'username', type: 'text' },
// 		{ name: 'password', type: 'text' },
// 		{ name: 'email', type: 'text' },
// 		{ name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
// 		{ name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
// 	],
// 	constraints: [{ constraintType: 'unique', columns: ['username', 'email'] }],
// };

// Create tables if they don't exist
// Create table
// async function createTable() {
// 	try {
// 		const { data, error } = await supabase.createTable(userSchema);
// 		if (error) {
// 			console.error('Error creating table:', error.message);
// 			return;
// 		}
// 		console.log('Table created:', data);
// 	} catch (error) {
// 		console.error('Error creating table:', error.message);
// 	}
// }

// // Call the function to create table
// createTable();

// db.serialize(() => {
// 	db.run(`CREATE TABLE IF NOT EXISTS users (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     username TEXT,
//     password TEXT,
//     email TEXT,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     UNIQUE(username, email)
// )`);

// 	db.run(`CREATE TABLE IF NOT EXISTS products (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     userId INTEGER,
//     productName TEXT,
//     description TEXT,
//     price REAL,
//     isInStock BOOLEAN,
//     location TEXT,
//     nearestCity TEXT,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY(userId) REFERENCES users(id)
// )`);

// 	db.run(`CREATE TABLE IF NOT EXISTS orders (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     userId INTEGER,
//     productId INTEGER,
//     quantity INTEGER,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY(userId) REFERENCES users(id),
//     FOREIGN KEY(productId) REFERENCES products(id)
// )`);

// 	db.run(`CREATE TABLE IF NOT EXISTS reviews (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     userId INTEGER,
//     productId INTEGER,
//     rating INTEGER,
//     review TEXT,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY(userId) REFERENCES users(id),
//     FOREIGN KEY(productId) REFERENCES products(id)
// )`);
// 	console.log('Tables created or already exist.');
// });
