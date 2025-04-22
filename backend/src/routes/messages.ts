import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.ts';
import {
  sendMessage,
  getMessages,
  getUnreadCount,
  getConversations,
} from '../controllers/messages.ts';

const router = express.Router();

// Protect all routes
router.use(protect);

// Send a message
router.post(
  '/',
  [
    body('matchId').notEmpty().withMessage('Match ID is required'),
    body('content').notEmpty().withMessage('Message content is required'),
  ],
  sendMessage
);

// Get messages for a match
router.get('/:matchId', getMessages);

// Get unread messages count
router.get('/unread/count', getUnreadCount);

// Get user's conversations
router.get('/conversations', getConversations);

export default router; 