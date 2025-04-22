import express from 'express';
import { protect } from '../middleware/auth.ts';
import { getUsers, getUser, getUserStats, searchUsers } from '../controllers/users.ts';

const router = express.Router();

// Protect all routes
router.use(protect);

// User routes
router.get('/', getUsers);
router.get('/stats', getUserStats);
router.get('/search', searchUsers);
router.get('/:id', getUser);

export default router; 