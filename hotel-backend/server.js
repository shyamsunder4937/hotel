import dotenv from 'dotenv';
dotenv.config(); // MUST be before other imports so env vars are available when mailer.js loads

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import roomServiceRoutes from './routes/roomServiceRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth',      authRoutes);
app.use('/api/rooms',     roomRoutes);
app.use('/api/bookings',  bookingRoutes);
app.use('/api/payments',  paymentRoutes);
app.use('/api/services',  roomServiceRoutes);
app.use('/api/feedback',  feedbackRoutes);
app.use('/api/staff',     staffRoutes);
app.use('/api/reports',   reportRoutes);
app.use('/api/inventory', inventoryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));