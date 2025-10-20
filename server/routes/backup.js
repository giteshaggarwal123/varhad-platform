const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const backup = require('../utils/backup');

/**
 * @route   POST /api/backup/create
 * @desc    Create manual database backup
 * @access  Private (Admin only)
 */
router.post('/create', protect, authorize('Admin'), async (req, res) => {
  try {
    const result = await backup.backupDatabase();
    
    res.status(200).json({
      success: true,
      message: 'Database backup created successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating backup',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/backup/restore
 * @desc    Restore database from backup
 * @access  Private (Admin only)
 */
router.post('/restore', protect, authorize('Admin'), async (req, res) => {
  try {
    const { backupPath } = req.body;
    
    if (!backupPath) {
      return res.status(400).json({
        success: false,
        message: 'Backup path is required'
      });
    }
    
    const result = await backup.restoreDatabase(backupPath);
    
    res.status(200).json({
      success: true,
      message: 'Database restored successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error restoring backup',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/backup/export
 * @desc    Export encrypted data
 * @access  Private (Admin only)
 */
router.post('/export', protect, authorize('Admin'), async (req, res) => {
  try {
    const { data, filename } = req.body;
    
    if (!data || !filename) {
      return res.status(400).json({
        success: false,
        message: 'Data and filename are required'
      });
    }
    
    const result = await backup.exportEncryptedData(data, filename);
    
    res.status(200).json({
      success: true,
      message: 'Data exported and encrypted successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error exporting data',
      error: error.message
    });
  }
});

module.exports = router;
