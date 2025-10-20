const Inventory = require('../models/Inventory');

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Private
exports.getInventory = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;

    let query = {};

    if (category) query.category = category;
    if (search) query.itemName = new RegExp(search, 'i');

    const inventoryItems = await Inventory.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ itemName: 1 });

    const count = await Inventory.countDocuments(query);

    res.status(200).json({
      success: true,
      data: inventoryItems,
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

// @desc    Get single inventory item
// @route   GET /api/inventory/:id
// @access  Private
exports.getInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id).populate('transactions.staff', 'name');

    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create inventory item
// @route   POST /api/inventory
// @access  Private/Admin
exports.createInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.create(req.body);

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update inventory item
// @route   PUT /api/inventory/:id
// @access  Private/Admin
exports.updateInventoryItem = async (req, res) => {
  try {
    // Only allow specific fields to be updated (prevent mass assignment)
    const allowedUpdates = ['itemName', 'category', 'quantity', 'unit', 'reorderLevel', 'supplier', 'batchNumber', 'expiryDate', 'unitPrice', 'location', 'notes'];
    const updates = {};

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const item = await Inventory.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add inventory transaction
// @route   POST /api/inventory/:id/transaction
// @access  Private
exports.addTransaction = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    const newQuantity = item.quantity + req.body.quantity;

    item.transactions.push({
      ...req.body,
      balanceAfter: newQuantity,
      staff: req.user.id
    });

    item.quantity = newQuantity;
    await item.save();

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete inventory item
// @route   DELETE /api/inventory/:id
// @access  Private/Admin
exports.deleteInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    await Inventory.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Inventory item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get low stock items
// @route   GET /api/inventory/alerts/low-stock
// @access  Private
exports.getLowStockItems = async (req, res) => {
  try {
    const lowStockItems = await Inventory.find({
      $expr: { $lte: ['$quantity', '$reorderLevel'] }
    });

    res.status(200).json({ success: true, data: lowStockItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
