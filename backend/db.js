require('dotenv').config();

const { Pool } = require('pg');

// Create a new Pool instance for our database
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// Test connections 
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error testing DB connection:', err);
    } else {
        console.log('Success, DB connection test returned:', res.rows[0]);
    }
});

module.exports = pool;