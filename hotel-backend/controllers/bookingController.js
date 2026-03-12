import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import { sendBookingConfirmation } from '../services/emailService.js';
import jwt from 'jsonwebtoken';

// POST /api/bookings - Create booking
const createBooking = async (req, res) => {
  const { roomId, checkIn, checkOut } = req.body;
  try {
    const room = await Room.findById(roomId);
    if (!room || room.status !== 'available')
      return res.status(400).json({ message: 'Room not available' });

    const nights = Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)));
    const totalAmount = Math.abs(room.price * nights);

    const booking = await Booking.create({
      customer: req.user._id,
      room: roomId,
      checkIn,
      checkOut,
      totalAmount,
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/bookings - Get all bookings (receptionist/manager)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('customer', 'name email').populate('room', 'roomNumber type');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/bookings/my - Customer's own bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id }).populate('room', 'roomNumber type price');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/bookings/:id/confirm - Confirm booking after payment & send email
const confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('room').populate('customer');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = 'confirmed';
    booking.paymentStatus = 'paid';
    await booking.save();

    // Mark room as occupied
    await Room.findByIdAndUpdate(booking.room._id, { status: 'occupied' });

    // Send confirmation email (non-blocking)
    try {
      await sendBookingConfirmation({
        to: booking.customer.email,
        name: booking.customer.name,
        booking,
        room: booking.room,
      });
    } catch (e) { console.log('Confirmation email skipped:', e.message); }

    res.json({ message: 'Booking confirmed and email sent', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/bookings/:id/checkout - Customer/Receptionist checkout
const checkOut = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    booking.status = 'checked-out';
    await booking.save();
    await Room.findByIdAndUpdate(booking.room, { status: 'available' });
    res.json({ message: 'Checked out successfully', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/bookings/verify - Verify booking via email token
const verifyBooking = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: 'Token is required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the booking
    const booking = await Booking.findById(decoded.bookingId).populate('room').populate('customer');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.status === 'confirmed') {
      return res.status(400).json({ message: 'Booking is already confirmed' });
    }

    // Update status to confirmed
    booking.status = 'confirmed';
    booking.paymentStatus = 'paid';
    await booking.save();

    // Mark room as occupied
    await Room.findByIdAndUpdate(booking.room._id, { status: 'occupied' });

    // Construct view link
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const viewLink = `${frontendUrl}/my-bookings`;

    // Send final confirmation email (non-blocking)
    try {
      await sendBookingConfirmation({
        to: booking.customer.email,
        name: booking.customer.name,
        booking,
        room: booking.room,
        viewLink
      });
    } catch (e) { console.log('Verification confirmation email skipped:', e.message); }

    res.json({ message: 'Booking verified and successfully confirmed', booking });
  } catch (err) {
    if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token is invalid or has expired' });
    }
    res.status(500).json({ message: err.message });
  }
};

// POST /api/bookings/:id/resend-email - Resend booking confirmation email (manager)
const resendEmail = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('room', 'roomNumber type');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const viewLink = `${frontendUrl}/my-stay`;

    await sendBookingConfirmation({
      to: booking.customer.email,
      name: booking.customer.name,
      booking,
      room: booking.room,
      viewLink
    });

    res.json({ message: 'Confirmation email resent successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { createBooking, getAllBookings, getMyBookings, confirmBooking, checkOut, verifyBooking, resendEmail };