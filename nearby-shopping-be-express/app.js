const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRouter = require('./routes/auth');
const productRouter = require('./routes/products');
const reviewRouter = require('./routes/reviews');
const orderRouter = require('./routes/orders');
const userRouter = require('./routes/users');

const verifyToken = require('./middleware/authMiddleware');

const app = express();
app.use(cors());

// Middleware
app.use(bodyParser.json());

// Routes
// TODO: Add verifyToken middleware to protect routes
app.use('/auth', authRouter);
app.use('/products', productRouter);
app.use('/reviews', reviewRouter);
app.use('/orders', orderRouter);
app.use('/user', userRouter);

app.get('/', (req, res) => {
	res.send('Welcome to nearby shopping API');
});

app.get('/verify-email', (req, res) => {
	res.send('Email verified successfully');
});

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
