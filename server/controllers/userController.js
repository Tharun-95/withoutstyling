const Userlogin = require('../models/Userlogin');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/user/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await Userlogin.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await Userlogin.create({
      username,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/user/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Userlogin.findOne({ email });

    if (!user) {
      console.log(`[LOGIN DEBUG] No user found with email: ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log(`[LOGIN DEBUG] Found user: ${user.email}. Password length in DB: ${user.password ? user.password.length : 0}`);
    
    // Check if the password lacks the bcrypt prefix, which usually means it's plain text.
    if (user.password && !user.password.startsWith('$2')) {
      console.log(`[LOGIN DEBUG] WARNING: User ${user.email} has a plain text password in the database! Bcrypt comparison will fail.`);
    }

    const isMatch = await user.matchPassword(password);
    console.log(`[LOGIN DEBUG] Password match result: ${isMatch}`);

    if (isMatch) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      console.log(`[LOGIN DEBUG] Invalid password entered for ${user.email}`);
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user dashboard data
// @route   GET /api/user/dashboard
// @access  Private/User
const getUserDashboard = async (req, res) => {
  res.json({
    message: 'Welcome to the user dashboard',
    user: req.user
  });
};

// @desc    Get admin dashboard data
// @route   GET /api/user/admin/dashboard
// @access  Private/Admin
const getAdminDashboard = async (req, res) => {
  res.json({
    message: 'Welcome to the admin dashboard',
    admin: req.user
  });
};

module.exports = {
  registerUser,
  loginUser,
  getUserDashboard,
  getAdminDashboard
};
