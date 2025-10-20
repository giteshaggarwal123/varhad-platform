const express = require('express');
const router = express.Router();
const {
  getClients,
  getClient,
  createClient,
  updateClient,
  getClientProfile,
  getClientStats,
  getMonthlyTrend,
  getPrepStatusDistribution,
  getDistrictDistribution
} = require('../controllers/clientController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getClients)
  .post(createClient);

router.get('/stats', getClientStats);
router.get('/chart/monthly', getMonthlyTrend);
router.get('/chart/prep-status', getPrepStatusDistribution);
router.get('/chart/districts', getDistrictDistribution);

router.route('/:id')
  .get(getClient)
  .put(updateClient);

router.get('/:id/profile', getClientProfile);

module.exports = router;
