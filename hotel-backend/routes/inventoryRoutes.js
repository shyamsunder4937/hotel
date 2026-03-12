// routes/inventoryRoutes.js
import express from 'express';
import Inventory from '../models/Inventory.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, authorize('housekeeping', 'manager'), async (req, res) => {
  const items = await Inventory.find();
  res.json(items);
});
router.post('/', protect, authorize('housekeeping', 'manager'), async (req, res) => {
  const item = await Inventory.create({ ...req.body, updatedBy: req.user._id });
  res.status(201).json(item);
});
router.put('/:id', protect, authorize('housekeeping', 'manager'), async (req, res) => {
  const item = await Inventory.findByIdAndUpdate(req.params.id, { ...req.body, updatedBy: req.user._id }, { new: true });
  res.json(item);
});

export default router;