// routes/roomServiceRoutes.js
import express from 'express';
import RoomService from '../models/RoomService.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('customer'), async (req, res) => {
  const service = await RoomService.create({ ...req.body, customer: req.user._id });
  res.status(201).json(service);
});
router.get('/', protect, authorize('housekeeping', 'manager'), async (req, res) => {
  const services = await RoomService.find().populate('customer', 'name');
  res.json(services);
});
router.put('/:id/status', protect, authorize('housekeeping', 'manager'), async (req, res) => {
  const service = await RoomService.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(service);
});

export default router;