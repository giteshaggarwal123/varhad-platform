const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getAuditLogs } = require('../middleware/auditLog');
const User = require('../models/User');

// All security routes require admin access
router.use(protect, authorize('admin'));

// @desc    Get audit logs
// @route   GET /api/security/audit-logs
// @access  Private/Admin
router.get('/audit-logs', async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];

    const logs = getAuditLogs(targetDate);

    res.status(200).json({
      success: true,
      date: targetDate,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get security dashboard stats
// @route   GET /api/security/stats
// @access  Private/Admin
router.get('/stats', async (req, res) => {
  try {
    // Get locked accounts
    const lockedAccounts = await User.countDocuments({
      lockUntil: { $gt: Date.now() }
    });

    // Get inactive accounts
    const inactiveAccounts = await User.countDocuments({
      isActive: false
    });

    // Get accounts with recent failed attempts
    const accountsWithFailedAttempts = await User.countDocuments({
      loginAttempts: { $gt: 0 }
    });

    // Get today's audit logs
    const today = new Date().toISOString().split('T')[0];
    const todayLogs = getAuditLogs(today);

    // Count failed login attempts today
    const failedLogins = todayLogs.filter(log =>
      log.operation.includes('/api/auth/login') && !log.success
    ).length;

    res.status(200).json({
      success: true,
      data: {
        lockedAccounts,
        inactiveAccounts,
        accountsWithFailedAttempts,
        todayLogs: todayLogs.length,
        failedLoginsToday: failedLogins,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get locked accounts
// @route   GET /api/security/locked-accounts
// @access  Private/Admin
router.get('/locked-accounts', async (req, res) => {
  try {
    const lockedAccounts = await User.find({
      lockUntil: { $gt: Date.now() }
    }).select('username name role lockUntil loginAttempts email');

    res.status(200).json({
      success: true,
      count: lockedAccounts.length,
      data: lockedAccounts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Unlock account
// @route   POST /api/security/unlock/:userId
// @access  Private/Admin
router.post('/unlock/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.resetLoginAttempts();

    res.status(200).json({
      success: true,
      message: `Account unlocked for user: ${user.username}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get failed login attempts
// @route   GET /api/security/failed-logins
// @access  Private/Admin
router.get('/failed-logins', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const failedAttempts = [];

    // Get logs for the past N days
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      try {
        const logs = getAuditLogs(dateStr);
        const failed = logs.filter(log =>
          log.operation.includes('/api/auth/login') && !log.success
        );
        failedAttempts.push(...failed);
      } catch (err) {
        // Log file doesn't exist for this date
        continue;
      }
    }

    res.status(200).json({
      success: true,
      count: failedAttempts.length,
      data: failedAttempts.slice(0, 100) // Limit to 100 most recent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
