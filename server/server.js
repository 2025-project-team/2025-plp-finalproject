import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes imports
import authRoutes from './routes/auth.js';
import emergencyRoutes from './routes/emergencies.js';
import userRoutes from './routes/users.js';
import aiRoutes from './routes/ai.js';

dotenv.config();
console.log('Loaded Stripe key:', process.env.STRIPE_SECRET_KEY ? 'Yes' : 'No');
import paymentRoutes from './routes/payment.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/emergency-health')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Socket.io for real-time features
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);
  
  // Join emergency room for real-time updates
  socket.on('join-emergency', (emergencyId) => {
    socket.join(emergencyId);
    console.log(`User ${socket.id} joined emergency ${emergencyId}`);
  });
  
  // Handle new emergency reports
  socket.on('emergency-reported', (emergencyData) => {
    socket.broadcast.emit('new-emergency', emergencyData);
    console.log('🚨 New emergency reported:', emergencyData);
  });
  
  // Handle emergency status updates
  socket.on('emergency-updated', (data) => {
    io.to(data.emergencyId).emit('emergency-status-changed', data);
  });
  
  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

// Make io available to routes
app.set('io', io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/payment', paymentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: '🚑 Emergency Health API Running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend: ${process.env.FRONTEND_URL}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});