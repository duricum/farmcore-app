const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Working route');
});

module.exports = router;

async function moveToNegotiating(contactId) {
  try {
    await CRM.update(contactId, { pipeline_stage: 'Negotiating' });
    alert('Contact stage updated!');
  } catch (error) {
    alert('Update failed: ' + error.message);
  }
}
