const HIVTest = require('../models/HIVTest');
const Client = require('../models/Client');
const ARTReferral = require('../models/ARTReferral');

// @desc    Create HIV test record
// @route   POST /api/hiv-tests
// @access  Private
exports.createHIVTest = async (req, res) => {
  try {
    req.body.counsellor = req.user.id;

    const hivTest = await HIVTest.create(req.body);

    // Update client HIV status
    await Client.findByIdAndUpdate(req.body.client, {
      hivStatus: req.body.testResult
    });

    await hivTest.populate('client counsellor', 'clientID name');

    res.status(201).json({ success: true, data: hivTest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all HIV test records
// @route   GET /api/hiv-tests
// @access  Private
exports.getHIVTests = async (req, res) => {
  try {
    const { testResult, startDate, endDate, page = 1, limit = 10 } = req.query;

    let query = {};

    if (testResult) query.testResult = testResult;
    if (startDate && endDate) {
      query.testDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const hivTests = await HIVTest.find(query)
      .populate('client', 'clientID name')
      .populate('counsellor', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ testDate: -1 });

    const count = await HIVTest.countDocuments(query);

    res.status(200).json({
      success: true,
      data: hivTests,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get HIV test by client
// @route   GET /api/hiv-tests/client/:clientId
// @access  Private
exports.getHIVTestByClient = async (req, res) => {
  try {
    const hivTest = await HIVTest.findOne({ client: req.params.clientId })
      .populate('counsellor', 'name');

    if (!hivTest) {
      return res.status(404).json({ success: false, message: 'HIV test record not found' });
    }

    res.status(200).json({ success: true, data: hivTest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
