require('dotenv').config();
console.log('DEBUG ENV:', {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT
});

//const { Pool } = require('pg');

const express = require('express');
const app = express();

const homePage = "http://ecommerce-static-0130.s3-website.us-east-2.amazonaws.com"

app.get('/', (req, res) => {
    res.redirect(homePage);
});

app.use(express.json());

// const authRoutes = require('./routes/authRoutes');
// app.use('/auth', authRoutes);

const shoesRoutes = require('./backend/routes/shoesRoutes');
app.use('/api', shoesRoutes);

// Start Server

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});

const cors = require('cors');

app.use(cors({
    origin: ['https://fly-feet.com', 'https://www.fly-feet.com'], //Frontend Domains
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


//testtest