import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Load environment variables
dotenv.config();

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

// Simple health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Basic routes
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to ConnectUp API' });
});

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

// Start the server first
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Try to connect to MongoDB
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((error) => {
      console.error('MongoDB connection error - app will run without database:', error.message);
    });
});