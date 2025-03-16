// config/dbConfig.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  ssl: {
        require: true,
        rejectUnauthorized: false
    }
});

module.exports = pool;
