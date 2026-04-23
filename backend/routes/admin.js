const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Working route');
});

module.exports = router;

async function loadUsers() {
  try {
    const users = await Admin.getUsers();
    users.forEach(user => {
      console.log(user.name, user.role, user.status);
    });
  } catch (error) {
    alert('Access denied or failed: ' + error.message);
  }
}

loadUsers();