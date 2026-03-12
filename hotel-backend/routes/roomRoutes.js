import express from 'express';
import { searchRooms, getAllRooms, addRoom, updateRoomStatus, setRoomPrice } from '../controllers/roomController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', searchRooms);                                                  // Customer: search available rooms
router.get('/all', protect, authorize('receptionist', 'manager'), getAllRooms);         // Staff: view all rooms
router.post('/', protect, authorize('manager'), addRoom);                               // Manager: add room
router.put('/:id/status', protect, authorize('housekeeping', 'manager'), updateRoomStatus); // Housekeeping: update status
router.put('/:id/price', protect, authorize('manager'), setRoomPrice);                 // Manager: set pricing

export default router;