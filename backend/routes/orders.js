const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Working route');
});

module.exports = router;
async function markAsDelivered(orderId) {
  try {
    await Orders.updateStatus(orderId, 'completed');
    alert('Order marked as completed!');
  } catch (error) {
    alert('Update failed: ' + error.message);
  }
}

// Call it from a button
markAsDelivered(5); // pass the order ID