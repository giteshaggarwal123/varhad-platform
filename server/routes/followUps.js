const express = require('express');
const router = express.Router();
const {
  getFollowUps,
  createFollowUp,
  updateFollowUp,
  getFollowUpStats
} = require('../controllers/followUpController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/stats', getFollowUpStats);

router.route('/')
  .get(getFollowUps)
  .post(createFollowUp);

router.put('/:id', updateFollowUp);

module.exports = router;
