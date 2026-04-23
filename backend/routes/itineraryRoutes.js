const express = require('express');
const router = express.Router();
const Itinerary = require('../models/Itinerary');
const { protect } = require('../middleware/auth');

// Get all itineraries
router.get('/', async (req, res) => {
  try {
    const itineraries = await Itinerary.find()
      .populate('places.placeId')
      .sort({ createdAt: -1 });
    res.json(itineraries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create itinerary (admin only)
router.post('/', protect, async (req, res) => {
  try {
    const itinerary = new Itinerary(req.body);
    const savedItinerary = await itinerary.save();
    res.status(201).json(savedItinerary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;