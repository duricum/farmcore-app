const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Working route');
});

module.exports = router;

// No login needed for this one
async function loadListings() {
  try {
    const listings = await Marketplace.getListings();
    listings.forEach(item => {
      console.log(item.title, item.price);
    });
  } catch (error) {
    alert('Could not load listings: ' + error.message);
  }
}

loadListings();