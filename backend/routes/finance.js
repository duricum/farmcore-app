const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Working route');
});

module.exports = router;
async function logFeedPurchase() {
  try {
    await Finance.create({
      description: '50 bags of maize feed',
      category: 'Feed',
      amount: 125000,
      type: 'expense',
      transaction_date: '2025-04-14',
    });
    alert('Transaction saved!');
  } catch (error) {
    alert('Could not save transaction: ' + error.message);
  }
}