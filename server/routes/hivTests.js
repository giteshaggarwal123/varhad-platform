const express = require('express');
const router = express.Router();
const {
  createHIVTest,
  getHIVTests,
  getHIVTestByClient
} = require('../controllers/hivTestController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getHIVTests)
  .post(createHIVTest);

router.get('/client/:clientId', getHIVTestByClient);

module.exports = router;
