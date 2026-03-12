import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  customer:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room:          { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  checkIn:       { type: Date, required: true },
  checkOut:      { type: Date, required: true },
  totalAmount:   { type: Number, required: true },
  status:        { type: String, enum: ['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  confirmationCode: { type: String, unique: true },
}, { timestamps: true });

bookingSchema.pre('save', function(next) {
  if (!this.confirmationCode) {
    this.confirmationCode = 'BK-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
  }
  next();
});

export default mongoose.model('Booking', bookingSchema);