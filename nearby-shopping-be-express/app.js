const express = require('express');
const bodyParser = require('body-parser');

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const authRouter = require('./routes/auth');
const productRouter = require('./routes/products');
const reviewRouter = require('./routes/reviews');
const orderRouter = require('./routes/orders');

const verifyToken = require('./middleware/authMiddleware');

const app = express();

const swaggerOptions = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Express API with Swagger',
			version: '1.0.0',
		},
	},
	apis: ['./routes/*.js'], // files containing annotations as above
};

// Middleware
app.use(bodyParser.json());

// Routes
// TODO: Add verifyToken middleware to protect routes
app.use('/auth', authRouter);
app.use('/products', productRouter);
app.use('/reviews', reviewRouter);
app.use('/orders', orderRouter);

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
