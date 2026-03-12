import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomNumber:  { type: String, required: true, unique: true },
  type:        { type: String, enum: ['single', 'double', 'suite', 'deluxe'], required: true },
  price:       { type: Number, required: true },
  status:      { type: String, enum: ['available', 'occupied', 'cleaning', 'maintenance'], default: 'available' },
  amenities:   [String],
  description: String,
  images:      [String],
}, { timestamps: true });

export default mongoose.model('Room', roomSchema);