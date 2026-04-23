const Place = require('../models/Place');

// @desc    Get all places
// @route   GET /api/places
const getPlaces = async (req, res) => {
  try {
    const { category, trending, search } = req.query;
    let query = {};

    if (category) query.category = category;
    if (trending === 'true') query.trending = true;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const places = await Place.find(query).sort({ createdAt: -1 });
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single place
// @route   GET /api/places/:id
const getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }
    res.json(place);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a place
// @route   POST /api/places
const createPlace = async (req, res) => {
  try {
    const place = new Place(req.body);
    const savedPlace = await place.save();
    res.status(201).json(savedPlace);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a place
// @route   PUT /api/places/:id
const updatePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    const updatedPlace = await Place.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    res.json(updatedPlace);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a place
// @route   DELETE /api/places/:id
const deletePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }
    await place.deleteOne();
    res.json({ message: 'Place deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get places by category
// @route   GET /api/places/category/:category
const getPlacesByCategory = async (req, res) => {
  try {
    const places = await Place.find({ category: req.params.category });
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
  getPlacesByCategory
};