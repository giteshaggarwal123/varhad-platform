const express = require('express');
const router = express.Router();
const {
  createARTReferral,
  getARTReferrals,
  getARTReferralById,
  getARTReferralByClient,
  updateARTReferral,
  getARTReferralStats
} = require('../controllers/artReferralController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getARTReferrals)
  .post(createARTReferral);

router.get('/stats', getARTReferralStats);

router.route('/:id')
  .get(getARTReferralById)
  .put(updateARTReferral);

router.get('/client/:clientId', getARTReferralByClient);

module.exports = router;
