const Outreach = require('../models/Outreach');
const Client = require('../models/Client');

// @desc    Create outreach record
// @route   POST /api/outreach
// @access  Private
exports.createOutreach = async (req, res) => {
  try {
    req.body.counsellor = req.user.id;

    const outreach = await Outreach.create(req.body);
    await outreach.populate('client counsellor', 'clientID name');

    res.status(201).json({ success: true, data: outreach });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all outreach records
// @route   GET /api/outreach
// @access  Private
exports.getOutreachRecords = async (req, res) => {
  try {
    const { startDate, endDate, district, page = 1, limit = 10 } = req.query;

    let query = {};

    if (startDate && endDate) {
      query.outreachDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (district) query.district = district;

    const outreachRecords = await Outreach.find(query)
      .populate('client', 'clientID name')
      .populate('counsellor', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ outreachDate: -1 });

    const count = await Outreach.countDocuments(query);

    res.status(200).json({
      success: true,
      data: outreachRecords,
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

// @desc    Get outreach by client
// @route   GET /api/outreach/client/:clientId
// @access  Private
exports.getOutreachByClient = async (req, res) => {
  try {
    const outreach = await Outreach.findOne({ client: req.params.clientId })
      .populate('counsellor', 'name');

    if (!outreach) {
      return res.status(404).json({ success: false, message: 'Outreach record not found' });
    }

    res.status(200).json({ success: true, data: outreach });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
