import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  itemName:  { type: String, required: true },
  category:  { type: String, enum: ['linen', 'toiletries', 'food', 'maintenance', 'other'] },
  quantity:  { type: Number, required: true, default: 0 },
  threshold: { type: Number, default: 10 }, // alert if below this
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Inventory', inventorySchema);