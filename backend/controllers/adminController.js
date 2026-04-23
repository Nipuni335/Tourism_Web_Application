const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// @desc    Register admin
// @route   POST /api/admin/register
const registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const adminExists = await Admin.findOne({ $or: [{ email }, { username }] });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const admin = await Admin.create({ username, email, password });
    
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

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

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

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

module.exports = { registerAdmin, loginAdmin };