// routes/feedbackRoutes.js
import express from 'express';
import Feedback from '../models/Feedback.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Customer: submit feedback
router.post('/', protect, authorize('customer'), async (req, res) => {
  try {
    const fb = await Feedback.create({ ...req.body, customer: req.user._id });
    res.status(201).json(fb);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Manager: view all feedback
router.get('/', protect, authorize('manager'), async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate('customer', 'name email');
    res.json(feedbacks);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;