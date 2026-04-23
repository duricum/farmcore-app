const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Working route');
});

module.exports = router;

// Runs automatically when the livestock page loads
async function loadAnimals() {
  try {
    const animals = await Livestock.getAll();         // get all
    // const cattle = await Livestock.getAll({ type: 'Cattle' }); // filtered

    animals.forEach(animal => {
      console.log(animal.tag_id, animal.type, animal.status);
      // use this data to build your table rows
    });
  } catch (error) {
    alert('Could not load animals: ' + error.message);
  }
}

loadAnimals(); // call it immediately