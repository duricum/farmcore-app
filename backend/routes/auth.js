/* const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Working route');
});

module.exports = router;

// When user clicks the Login button
document.getElementById('loginBtn').addEventListener('click', async () => {
  const email    = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const result = await Auth.login(email, password);
    alert('Welcome, ' + result.user.name);
    window.location.href = 'dashboard.html'; // redirect after login
  } catch (error) {
    alert('Login failed: ' + error.message);
  }
}); */

const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
    [name, email, hashedPassword]
  );

  res.json(result.rows[0]);
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

  if (user.rows.length === 0) {
    return res.status(400).json({ message: "User not found" });
  }

  const validPassword = await bcrypt.compare(password, user.rows[0].password);

  if (!validPassword) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const token = jwt.sign(
    { id: user.rows[0].id, role: user.rows[0].role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ token });
});

module.exports = router;