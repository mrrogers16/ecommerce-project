require('dotenv').config();

const express = require('express');
const app = express();

const homePage = "http://ecommerce-static-0130.s3-website.us-east-2.amazonaws.com"

app.get('/', (req, res) => {
    res.redirect(homePage);
});

app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const userModel = require('./models/userModel'); // To be used in protected route

app.use('/auth', authRoutes);

const shoesRoutes = require('.routes/shoesRoutes');
app.use('/api', shoesRoutes);

// Start Server

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});