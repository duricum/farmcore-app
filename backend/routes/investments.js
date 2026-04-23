const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Working route');
});

module.exports = router;
async function loadInvestmentSummary() {
  try {
    const summary = await Investments.getSummary();
    document.getElementById('totalCapital').textContent = summary.total_capital;
    document.getElementById('avgROI').textContent       = summary.avg_roi + '%';
    document.getElementById('totalPaid').textContent    = summary.total_paid;
  } catch (error) {
    alert('Could not load summary: ' + error.message);
  }
}

loadInvestmentSummary();