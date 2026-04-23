const express = require('express');
const router = express.Router();
const {
  getPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
  getPlacesByCategory
} = require('../controllers/placeController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(getPlaces)
  .post(protect, createPlace);

router.route('/category/:category')
  .get(getPlacesByCategory);

router.route('/:id')
  .get(getPlaceById)
  .put(protect, updatePlace)
  .delete(protect, deletePlace);

module.exports = router;