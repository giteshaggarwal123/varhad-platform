const Client = require('../models/Client');
const Outreach = require('../models/Outreach');
const HIVTest = require('../models/HIVTest');
const PrEP = require('../models/PrEP');

// @desc    Get all clients
// @route   GET /api/clients
// @access  Private
exports.getClients = async (req, res) => {
  try {
    const { search, hivStatus, prepStatus, district, counsellor, contactNumber, page = 1, limit = 10 } = req.query;

    let query = {};

    // Build query
    if (search) {
      query.$or = [
        { clientID: new RegExp(search, 'i') },
        { name: new RegExp(search, 'i') },
        { contactNumber: new RegExp(search, 'i') }
      ];
    }
    if (contactNumber) {
      query.contactNumber = contactNumber;
    }
    if (hivStatus) query.hivStatus = hivStatus;
    if (prepStatus) query.prepStatus = prepStatus;
    if (district) query.district = district;
    if (counsellor) query.counsellor = counsellor;

    const clients = await Client.find(query)
      .populate('counsellor', 'name username')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Client.countDocuments(query);

    res.status(200).json({
      success: true,
      data: clients,
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

// @desc    Get single client
// @route   GET /api/clients/:id
// @access  Private
exports.getClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate('counsellor', 'name username role');

    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    res.status(200).json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new client
// @route   POST /api/clients
// @access  Private
exports.createClient = async (req, res) => {
  try {
    req.body.counsellor = req.user.id;

    const client = await Client.create(req.body);

    res.status(201).json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private
exports.updateClient = async (req, res) => {
  try {
    // Only allow specific fields to be updated (prevent mass assignment)
    const allowedUpdates = ['name', 'age', 'gender', 'contactNumber', 'alternatePhone', 'email', 'preferredContactMethod', 'maritalStatus', 'district', 'specialNeeds', 'typology'];
    const updates = {};

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const client = await Client.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    res.status(200).json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get client complete profile
// @route   GET /api/clients/:id/profile
// @access  Private
exports.getClientProfile = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).populate('counsellor', 'name');

    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    const outreach = await Outreach.findOne({ client: req.params.id }).populate('counsellor', 'name');
    const hivTest = await HIVTest.findOne({ client: req.params.id }).populate('counsellor', 'name');
    const prep = await PrEP.findOne({ client: req.params.id }).populate('doctor counsellor', 'name');

    res.status(200).json({
      success: true,
      data: {
        client,
        outreach,
        hivTest,
        prep
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get client statistics
// @route   GET /api/clients/stats
// @access  Private
exports.getClientStats = async (req, res) => {
  try {
    const totalClients = await Client.countDocuments();
    const activeOnPrep = await Client.countDocuments({ prepStatus: 'Active' });
    const hivPositive = await Client.countDocuments({ hivStatus: 'Positive' });
    const thisMonth = await Client.countDocuments({
      createdAt: { $gte: new Date(new Date().setDate(1)) }
    });

    res.status(200).json({
      success: true,
      data: {
        totalClients,
        activeOnPrep,
        hivPositive,
        newThisMonth: thisMonth
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get monthly client registration trend (last 6 months)
// @route   GET /api/clients/chart/monthly
// @access  Private
exports.getMonthlyTrend = async (req, res) => {
  try {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

      const count = await Client.countDocuments({
        createdAt: { $gte: startOfMonth, $lte: endOfMonth }
      });

      monthlyData.push({
        label: monthNames[date.getMonth()],
        value: count,
        color: '#667eea'
      });
    }

    res.status(200).json({
      success: true,
      data: monthlyData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get PrEP status distribution
// @route   GET /api/clients/chart/prep-status
// @access  Private
exports.getPrepStatusDistribution = async (req, res) => {
  try {
    const active = await Client.countDocuments({ prepStatus: 'Active' });
    const inactive = await Client.countDocuments({ prepStatus: 'Inactive' });
    const completed = await Client.countDocuments({ prepStatus: 'Completed' });
    const referred = await Client.countDocuments({ prepStatus: 'Referred' });

    const data = [
      { label: 'Active', value: active, color: '#10b981' },
      { label: 'Inactive', value: inactive, color: '#f59e0b' },
      { label: 'Completed', value: completed, color: '#3b82f6' },
      { label: 'Referred', value: referred, color: '#ef4444' }
    ];

    res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get district distribution
// @route   GET /api/clients/chart/districts
// @access  Private
exports.getDistrictDistribution = async (req, res) => {
  try {
    const districts = await Client.aggregate([
      {
        $group: {
          _id: '$district',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    const colors = ['#667eea', '#764ba2', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#6366f1', '#8b5cf6'];

    const data = districts.map((d, index) => ({
      label: d._id || 'Not Specified',
      value: d.count,
      color: colors[index % colors.length]
    }));

    res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
