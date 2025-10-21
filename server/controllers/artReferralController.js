const ARTReferral = require('../models/ARTReferral');
const Client = require('../models/Client');

// @desc    Create ART referral record
// @route   POST /api/art-referrals
// @access  Private
exports.createARTReferral = async (req, res) => {
  try {
    req.body.counsellor = req.user.id;

    const artReferral = await ARTReferral.create(req.body);

    // Update client HIV status to Positive (since they're being referred to ART)
    await Client.findByIdAndUpdate(req.body.client, {
      hivStatus: 'Positive'
    });

    await artReferral.populate('client counsellor', 'clientID name');

    res.status(201).json({ success: true, data: artReferral });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all ART referral records
// @route   GET /api/art-referrals
// @access  Private
exports.getARTReferrals = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const artReferrals = await ARTReferral.find()
      .populate('client', 'clientID name age gender district contactNumber')
      .populate('counsellor', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ referralDate: -1 });

    const count = await ARTReferral.countDocuments();

    res.status(200).json({
      success: true,
      data: artReferrals,
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

// @desc    Get ART referral by ID
// @route   GET /api/art-referrals/:id
// @access  Private
exports.getARTReferralById = async (req, res) => {
  try {
    const artReferral = await ARTReferral.findById(req.params.id)
      .populate('client', 'clientID name age gender district contactNumber')
      .populate('counsellor', 'name');

    if (!artReferral) {
      return res.status(404).json({ success: false, message: 'ART referral not found' });
    }

    res.status(200).json({ success: true, data: artReferral });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get ART referral by client
// @route   GET /api/art-referrals/client/:clientId
// @access  Private
exports.getARTReferralByClient = async (req, res) => {
  try {
    const artReferral = await ARTReferral.findOne({ client: req.params.clientId })
      .populate('counsellor', 'name');

    if (!artReferral) {
      return res.status(404).json({ success: false, message: 'ART referral not found for this client' });
    }

    res.status(200).json({ success: true, data: artReferral });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update ART referral
// @route   PUT /api/art-referrals/:id
// @access  Private
exports.updateARTReferral = async (req, res) => {
  try {
    const artReferral = await ARTReferral.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('client counsellor', 'clientID name');

    if (!artReferral) {
      return res.status(404).json({ success: false, message: 'ART referral not found' });
    }

    res.status(200).json({ success: true, data: artReferral });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get ART referral stats
// @route   GET /api/art-referrals/stats
// @access  Private
exports.getARTReferralStats = async (req, res) => {
  try {
    const total = await ARTReferral.countDocuments();

    const thisMonth = await ARTReferral.countDocuments({
      referralDate: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    });

    const linkageCompleted = await ARTReferral.countDocuments({
      referredToART: true,
      artRegistrationNumber: { $exists: true, $ne: '' }
    });

    const pendingLinkage = await ARTReferral.countDocuments({
      referredToART: true,
      artRegistrationNumber: { $exists: false }
    });

    res.status(200).json({
      success: true,
      data: {
        total,
        thisMonth,
        linkageCompleted,
        pendingLinkage
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
