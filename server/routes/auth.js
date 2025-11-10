const express = require('express');
const router = express.Router();
const { login, register, getMe, getAllUsers, deleteUser, updateUserStatus } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

router.post('/login', login);
router.post('/register', protect, authorize('admin'), register);
router.get('/me', protect, getMe);

// User Management Routes (Admin only)
router.get('/users', protect, authorize('admin'), getAllUsers);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);
router.put('/users/:id/status', protect, authorize('admin'), updateUserStatus);

module.exports = router;
