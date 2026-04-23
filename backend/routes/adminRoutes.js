const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
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

// Public routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Protected routes (require admin token)
router.get('/profile', protect, getAdminProfile);
router.get('/stats', protect, getDashboardStats);
router.get('/places', protect, getAdminPlaces);
router.post('/places', protect, createPlace);
router.put('/places/:id', protect, updatePlace);
router.delete('/places/:id', protect, deletePlace);

module.exports = router;