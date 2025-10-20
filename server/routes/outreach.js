const express = require('express');
const router = express.Router();
const {
  createOutreach,
  getOutreachRecords,
  getOutreachByClient
} = require('../controllers/outreachController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getOutreachRecords)
  .post(createOutreach);

router.get('/client/:clientId', getOutreachByClient);

module.exports = router;
