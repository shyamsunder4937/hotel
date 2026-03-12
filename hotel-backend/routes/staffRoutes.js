// routes/staffRoutes.js
import express from 'express';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, authorize('manager'), async (req, res) => {
  const staff = await User.find({ role: { $ne: 'customer' } }).select('-password');
  res.json(staff);
});
router.delete('/:id', protect, authorize('manager'), async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'Staff removed' });
});

export default router;