const express = require('express');
const router = express.Router();
const {
  getInventory,
  getInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  addTransaction,
  getLowStockItems
} = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/alerts/low-stock', getLowStockItems);

router.route('/')
  .get(getInventory)
  .post(authorize('admin'), createInventoryItem);

router.route('/:id')
  .get(getInventoryItem)
  .put(authorize('admin'), updateInventoryItem)
  .delete(authorize('admin'), deleteInventoryItem);

router.post('/:id/transaction', addTransaction);

module.exports = router;
