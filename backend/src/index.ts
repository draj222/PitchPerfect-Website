import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.ts';
import userRoutes from './routes/users.ts';
import jobRoutes from './routes/jobs.ts';
import matchingRoutes from './routes/matching.ts';
import messageRoutes from './routes/messages.ts';

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/connectup';

// Create HTTP server and socket.io instance
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/messages', messageRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Demo mode route - for running without MongoDB
app.get('/api/demo', (req, res) => {
  res.status(200).json({ 
    message: 'Running in demo mode without MongoDB',
    setup: 'Please install MongoDB to use full functionality'
  });
});

// Production mode - serve static frontend files
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React frontend app
  const frontendBuildPath = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendBuildPath));

  // Handle any requests that don't match the ones above
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
  
  console.log('Serving frontend from:', frontendBuildPath);
}

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle joining a chat room
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  // Handle sending messages
  socket.on('send_message', (data) => {
    io.to(data.roomId).emit('receive_message', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Try to connect to MongoDB, but start server regardless
console.log('Attempting to connect to MongoDB...');
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    startServer();
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    console.log('Starting server in demo mode without MongoDB...');
    startServer();
  });

// Function to start the server
function startServer() {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}