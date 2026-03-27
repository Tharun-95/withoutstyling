const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserDashboard,
  getAdminDashboard
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected user route
router.get('/dashboard', protect, authorize('user', 'admin'), getUserDashboard);

// Protected admin route
router.get('/admin/dashboard', protect, authorize('admin'), getAdminDashboard);

module.exports = router;
