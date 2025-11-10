const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  createPrEP,
  getPrEPRecords,
  getPrEPByClient,
  addFollowUp
} = require('../controllers/prepController');
const { protect } = require('../middleware/auth');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/prep-documents/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /pdf|jpg|jpeg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, JPG, JPEG, and PNG files are allowed'));
    }
  }
});

router.use(protect);

router.route('/')
  .get(getPrEPRecords)
  .post(upload.fields([
    { name: 'testReport', maxCount: 1 },
    { name: 'prescription', maxCount: 1 },
    { name: 'consentForm', maxCount: 1 },
    { name: 'paymentScreenshot', maxCount: 1 }
  ]), createPrEP);

router.get('/client/:clientId', getPrEPByClient);
router.put('/:id/followup', addFollowUp);

module.exports = router;
