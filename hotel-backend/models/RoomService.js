import mongoose from 'mongoose';

const roomServiceSchema = new mongoose.Schema({
  customer:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  booking:     { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  serviceType: { type: String, enum: ['food', 'laundry', 'cleaning', 'maintenance', 'other'], required: true },
  description: String,
  status:      { type: String, enum: ['requested', 'in-progress', 'completed'], default: 'requested' },
}, { timestamps: true });

export default mongoose.model('RoomService', roomServiceSchema);