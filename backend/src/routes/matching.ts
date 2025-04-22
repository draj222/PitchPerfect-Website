import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.ts';
import {
  createJobMatches,
  createUserMatches,
  getJobMatches,
  getUserMatches,
  updateMatchStatus,
  getMatchDetails,
} from '../controllers/matching.ts';

const router = express.Router();

// Protect all routes
router.use(protect);

// User match routes
router.post('/user', createUserMatches);
router.get('/user', getUserMatches);

// Job match routes
router.post('/job/:jobId', createJobMatches);
router.get('/job/:jobId', getJobMatches);

// Match detail and update routes
router.get('/:matchId', getMatchDetails);
router.put(
  '/:matchId',
  [
    body('status')
      .isIn(['pending', 'accepted', 'rejected', 'archived'])
      .withMessage('Invalid status'),
    body('notes').optional().isString().withMessage('Notes must be a string'),
  ],
  updateMatchStatus
);

export default router; 