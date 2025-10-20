const PrEP = require('../models/PrEP');
const Client = require('../models/Client');
const Inventory = require('../models/Inventory');
const FollowUp = require('../models/FollowUp');

// @desc    Create PrEP initiation record
// @route   POST /api/prep
// @access  Private
exports.createPrEP = async (req, res) => {
  try {
    // Auto-assign doctor if not provided (use current user)
    if (!req.body.doctor) {
      req.body.doctor = req.user.id;
    }

    const prep = await PrEP.create(req.body);

    // Update client PrEP status
    await Client.findByIdAndUpdate(req.body.client, {
      prepStatus: 'Active',
      artRegistrationNumber: req.body.artRegistrationNumber
    });

    // Update inventory - deduct dispensed medication
    if (req.body.medicineName && req.body.quantityDispensed) {
      const inventoryItem = await Inventory.findOne({
        itemName: req.body.medicineName
      });

      if (inventoryItem) {
        const newQuantity = inventoryItem.quantity - req.body.quantityDispensed;

        inventoryItem.transactions.push({
          type: 'Dispensed',
          quantity: -req.body.quantityDispensed,
          balanceAfter: newQuantity,
          clientID: (await Client.findById(req.body.client)).clientID,
          staff: req.user.id,
          purpose: 'PrEP Initiation'
        });

        inventoryItem.quantity = newQuantity;
        await inventoryItem.save();
      }
    }

    // Create follow-up reminder
    if (req.body.nextFollowUpDate) {
      await FollowUp.create({
        client: req.body.client,
        dueDate: req.body.nextFollowUpDate,
        type: 'Adherence Check',
        counsellor: req.user.id
      });
    }

    await prep.populate('client doctor', 'clientID name');

    res.status(201).json({ success: true, data: prep });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all PrEP records
// @route   GET /api/prep
// @access  Private
exports.getPrEPRecords = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let query = {};
    if (status) query.status = status;

    const prepRecords = await PrEP.find(query)
      .populate('client', 'clientID name')
      .populate('doctor', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ prepInitiationDate: -1 });

    const count = await PrEP.countDocuments(query);

    res.status(200).json({
      success: true,
      data: prepRecords,
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

// @desc    Get PrEP by client
// @route   GET /api/prep/client/:clientId
// @access  Private
exports.getPrEPByClient = async (req, res) => {
  try {
    const prep = await PrEP.findOne({ client: req.params.clientId })
      .populate('doctor', 'name');

    if (!prep) {
      return res.status(404).json({ success: false, message: 'PrEP record not found' });
    }

    res.status(200).json({ success: true, data: prep });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add PrEP follow-up
// @route   PUT /api/prep/:id/followup
// @access  Private
exports.addFollowUp = async (req, res) => {
  try {
    const prep = await PrEP.findById(req.params.id);

    if (!prep) {
      return res.status(404).json({ success: false, message: 'PrEP record not found' });
    }

    prep.followUps.push({
      ...req.body,
      counsellor: req.user.id
    });

    await prep.save();

    res.status(200).json({ success: true, data: prep });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
