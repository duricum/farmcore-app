/* const { Pool } = require('pg');
require('dotenv').config();

//Create a Connection Pool (reusuable database connections)

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.connect()
  .then(() => console.log("✅ Database connected Successfully"))
  .catch(err => console.error("❌ DB connection failed:", err));

module.exports = pool; */
