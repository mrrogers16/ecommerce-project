// require('dotenv').config();

// const dbConfig = {
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_NAME,
//     port: process.env.DB_PORT
// };

// console.log("Database Host:", dbConfig.host);

// // app.js
// const express = require('express');
// const app = express();
// const port = process.env.PORT || 3000;
const homePage = "http://ecommerce-static-0130.s3-website.us-east-2.amazonaws.com"

app.get('/', (req, res) => {
    res.redirect(homePage);
});

// app.listen(port, () => {
//     console.log(`Backend running on http://localhost:${port}`);
//     console.log(`Frontend available at : ${homePage}`);
// });


require('dotenv').config();

const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const userModel = require('./models/userModel'); // To be used in protected route

app.use(express.json());

app.use('/auth', authRoutes);

// Start server

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});