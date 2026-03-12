// routes/bookingRoutes.js
import express from 'express';
import { createBooking, getAllBookings, getMyBookings, confirmBooking, checkOut, verifyBooking, resendEmail } from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.post('/verify', verifyBooking);
router.get('/', protect, authorize('receptionist', 'manager'), getAllBookings);
router.get('/my', protect, getMyBookings);
router.put('/:id/confirm', protect, authorize('receptionist', 'manager'), confirmBooking);
router.put('/:id/checkout', protect, authorize('receptionist', 'manager', 'customer'), checkOut);
router.post('/:id/resend-email', protect, authorize('manager'), resendEmail);

export default router;