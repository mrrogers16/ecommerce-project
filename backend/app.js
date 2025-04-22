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
    origin: ['https://fly-feet.com', 'https://www.fly-feet.com', 'http://127.0.0.1:5500'], //Frontend Domains -- Remove 127.0.0.1 string later
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
const path = require('path');

// Serve static assets like .css, .js, images
app.use(express.static(path.join(__dirname, 'static_pages')));

// Serve the actual homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static_pages', 'index.html'));
});

const shoesRoutes = require('./backend/routes/shoesRoutes');
app.use('/api', shoesRoutes);

const customersRoutes = require('./backend/routes/customersRoutes');
app.use('/api', customersRoutes);

const cartRoutes = require('./backend/routes/cartRoutes');
app.use('/api', cartRoutes);

const orderRoutes = require('./backend/routes/orderRoutes');
app.use('/api', orderRoutes);

const discountRoutes = require('./backend/routes/discountRoutes.js');
app.use('/api', discountRoutes);

const contactRoutes = require('./backend/routes/contactRoutes');
app.use('/api', contactRoutes);  

// Start Server
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});



