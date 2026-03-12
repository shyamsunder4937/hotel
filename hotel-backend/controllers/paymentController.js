import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import { sendPaymentVerificationEmail } from '../services/emailService.js';
import jwt from 'jsonwebtoken';

// POST /api/payments - Process payment
const processPayment = async (req, res) => {
  const { bookingId, method, transactionId } = req.body;
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Simulate payment validation
    const payment = await Payment.create({
      booking: bookingId,
      customer: req.user._id,
      amount: booking.totalAmount,
      method,
      transactionId: transactionId || 'TXN-' + Date.now(),
      status: 'success',
    });

    // Generate Verification Token
    const verificationToken = jwt.sign({ bookingId }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    // Construct frontend URL (or fallback)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const verificationLink = `${frontendUrl}/verify-booking?token=${verificationToken}`;

    // Send the Verification Email (non-blocking)
    try {
      await sendPaymentVerificationEmail({
        to: req.user.email,
        name: req.user.name,
        verificationLink
      });
    } catch (e) { console.log('Verification email skipped:', e.message); }

    res.status(201).json({ message: 'Payment successful, verification email sent', payment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/payments/my
const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ customer: req.user._id }).populate('booking');
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { processPayment, getMyPayments };