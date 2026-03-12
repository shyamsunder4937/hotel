import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  booking:  { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  rating:   { type: Number, min: 1, max: 5, required: true },
  comment:  { type: String },
}, { timestamps: true });

export default mongoose.model('Feedback', feedbackSchema);