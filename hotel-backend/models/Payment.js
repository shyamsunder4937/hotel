import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  booking:       { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  customer:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount:        { type: Number, required: true },
  method:        { type: String, enum: ['card', 'cash', 'upi', 'netbanking'], required: true },
  transactionId: String,
  status:        { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);