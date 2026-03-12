// routes/paymentRoutes.js
import express from 'express';
import { processPayment, getMyPayments } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, processPayment);
router.get('/my', protect, getMyPayments);

export default router;