const Admin = require('../models/Admin');
const Place = require('../models/Place');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// @desc    Register admin
// @route   POST /api/admin/register
const registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const adminExists = await Admin.findOne({
      $or: [{ email }, { username }]
    });

    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const admin = await Admin.create({ username, email, password });
    const token = generateToken(admin._id);

    res.status(201).json({
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      token
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Login admin
// @route   POST /api/admin/login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordMatch = await admin.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(admin._id);

    res.json({
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      token
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get admin profile
// @route   GET /api/admin/profile
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
const getDashboardStats = async (req, res) => {
  try {
    const totalPlaces = await Place.countDocuments();
    const trendingPlaces = await Place.countDocuments({ trending: true });
    const placesByCategory = await Place.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({
      totalPlaces,
      trendingPlaces,
      placesByCategory
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all places (admin)
// @route   GET /api/admin/places
const getAdminPlaces = async (req, res) => {
  try {
    const places = await Place.find().sort({ createdAt: -1 });
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create place (admin)
// @route   POST /api/admin/places
const createPlace = async (req, res) => {
  try {
    console.log('📝 Creating new place...');
    console.log('Received data:', req.body);

    const place = new Place(req.body);
    const savedPlace = await place.save();

    console.log('✅ Place created:', savedPlace.name);
    res.status(201).json(savedPlace);
  } catch (error) {
    console.error('❌ Error creating place:', error.message);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update place (admin)
// @route   PUT /api/admin/places/:id
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

// @desc    Delete place (admin)
// @route   DELETE /api/admin/places/:id
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

module.exports = {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  getDashboardStats,
  getAdminPlaces,
  createPlace,
  updatePlace,
  deletePlace
};