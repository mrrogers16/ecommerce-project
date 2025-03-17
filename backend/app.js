require('dotenv').config();

// Remove console.log when finished
console.log('DEBUG ENV:', {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT,
    JWT_SECRET: process.env.JWT_SECRET
});

const express = require('express');
const cors = require('cors');
const app = express();
const homePage = "http://ecommerce-static-0130.s3-website.us-east-2.amazonaws.com"

// Middleware always goes first
app.use(cors({
    origin: ['https://fly-feet.com', 'https://www.fly-feet.com'], //Frontend Domains
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.redirect(homePage);
});

const shoesRoutes = require('./backend/routes/shoesRoutes');
app.use('/api', shoesRoutes);

const customersRoutes = require('./backend/routes/customersRoutes');
app.use('/api', customersRoutes);

const cartRoutes = require('./backend/routes/cartRoutes');
app.use('/api', cartRoutes);

// Start Server

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});



