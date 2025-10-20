const FollowUp = require('../models/FollowUp');

// @desc    Get all follow-ups
// @route   GET /api/followups
// @access  Private
exports.getFollowUps = async (req, res) => {
  try {
    const { status, type, counsellor, startDate, endDate, page = 1, limit = 20 } = req.query;

    let query = {};

    if (status) query.status = status;
    if (type) query.type = type;
    if (counsellor) query.counsellor = counsellor;
    if (startDate && endDate) {
      query.dueDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const followUps = await FollowUp.find(query)
      .populate('client', 'clientID name contactNumber')
      .populate('counsellor', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ dueDate: 1 });

    const count = await FollowUp.countDocuments(query);

    res.status(200).json({
      success: true,
      data: followUps,
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

// @desc    Create follow-up
// @route   POST /api/followups
// @access  Private
exports.createFollowUp = async (req, res) => {
  try {
    req.body.counsellor = req.user.id;

    const followUp = await FollowUp.create(req.body);
    await followUp.populate('client counsellor', 'clientID name');

    res.status(201).json({ success: true, data: followUp });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update follow-up
// @route   PUT /api/followups/:id
// @access  Private
exports.updateFollowUp = async (req, res) => {
  try {
    // Only allow specific fields to be updated (prevent mass assignment)
    const allowedUpdates = ['dueDate', 'type', 'status', 'adherenceRate', 'completionDate', 'notes', 'outcome'];
    const updates = {};

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const followUp = await FollowUp.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    }).populate('client counsellor', 'clientID name');

    if (!followUp) {
      return res.status(404).json({ success: false, message: 'Follow-up not found' });
    }

    res.status(200).json({ success: true, data: followUp });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get follow-up statistics
// @route   GET /api/followups/stats
// @access  Private
exports.getFollowUpStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const pendingToday = await FollowUp.countDocuments({
      dueDate: { $gte: today, $lt: new Date(today.getTime() + 24*60*60*1000) },
      status: 'Pending'
    });

    const thisWeek = await FollowUp.countDocuments({
      dueDate: { $gte: today, $lt: nextWeek },
      status: 'Pending'
    });

    const overdue = await FollowUp.countDocuments({
      dueDate: { $lt: today },
      status: { $ne: 'Completed' }
    });

    res.status(200).json({
      success: true,
      data: {
        pendingToday,
        thisWeek,
        overdue
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
