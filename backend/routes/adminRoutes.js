const express = require('express');
const router = express.Router();

const {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  getDashboardStats,
  getAdminPlaces,
  createPlace,
  updatePlace,
  deletePlace
} = require('../controllers/adminController');

const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Protected admin routes
router.get('/profile', protect, getAdminProfile);
router.get('/stats', protect, getDashboardStats);
router.get('/places', protect, getAdminPlaces);
router.post('/places', protect, createPlace);
router.put('/places/:id', protect, updatePlace);
router.delete('/places/:id', protect, deletePlace);

module.exports = router;