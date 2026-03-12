// routes/reportRoutes.js
import express from 'express';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Manager: generate summary report
router.get('/summary', protect, authorize('manager'), async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const revenue = await Payment.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    res.json({ totalBookings, confirmedBookings, revenue: revenue[0]?.total || 0 });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;