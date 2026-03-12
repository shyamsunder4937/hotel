import Room from '../models/Room.js';

// GET /api/rooms?type=suite&checkIn=...&checkOut=...
const searchRooms = async (req, res) => {
  const { type, minPrice, maxPrice } = req.query;
  const filter = { status: 'available' };
  if (type) filter.type = type;
  if (minPrice || maxPrice) filter.price = {};
  if (minPrice) filter.price.$gte = Number(minPrice);
  if (maxPrice) filter.price.$lte = Number(maxPrice);

  try {
    const rooms = await Room.find(filter);
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/rooms/all  (manager/receptionist)
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/rooms  (manager only)
const addRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/rooms/:id/status  (housekeeping/manager)
const updateRoomStatus = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/rooms/:id/price  (manager only)
const setRoomPrice = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, { price: req.body.price }, { new: true });
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { searchRooms, getAllRooms, addRoom, updateRoomStatus, setRoomPrice };