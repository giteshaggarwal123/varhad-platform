const express = require('express');
const router = express.Router();
const {
  createPrEP,
  getPrEPRecords,
  getPrEPByClient,
  addFollowUp
} = require('../controllers/prepController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getPrEPRecords)
  .post(createPrEP);

router.get('/client/:clientId', getPrEPByClient);
router.put('/:id/followup', addFollowUp);

module.exports = router;
