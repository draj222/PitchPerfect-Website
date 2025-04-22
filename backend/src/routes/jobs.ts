import express from 'express';
import { body } from 'express-validator';
import { createJob, getJobs, getJob, updateJob, deleteJob, getMyJobs } from '../controllers/jobs.ts';
import { protect, restrictTo } from '../middleware/auth.ts';

const router = express.Router();

// Protect all routes
router.use(protect);

// Get user's jobs
router.get('/myjobs', getMyJobs);

// Job routes
router
  .route('/')
  .get(getJobs)
  .post(
    restrictTo('founder', 'both'),
    [
      body('title').notEmpty().withMessage('Title is required'),
      body('description').notEmpty().withMessage('Description is required'),
      body('companyName').notEmpty().withMessage('Company name is required'),
      body('companyStage')
        .notEmpty()
        .withMessage('Company stage is required')
        .isIn(['idea', 'pre-seed', 'seed', 'series-a', 'series-b', 'growth', 'established'])
        .withMessage('Invalid company stage'),
      body('role')
        .notEmpty()
        .withMessage('Role is required')
        .isIn(['CTO', 'CoFounder', 'LeadEngineer', 'Other'])
        .withMessage('Invalid role'),
      body('skills')
        .isArray()
        .withMessage('Skills must be an array')
        .notEmpty()
        .withMessage('At least one skill is required'),
      body('industry')
        .isArray()
        .withMessage('Industry must be an array')
        .notEmpty()
        .withMessage('At least one industry is required'),
      body('remote').isBoolean().withMessage('Remote must be a boolean'),
      body('compensation').isObject().withMessage('Compensation must be an object'),
    ],
    createJob
  );

router
  .route('/:id')
  .get(getJob)
  .put(
    [
      body('title').optional().notEmpty().withMessage('Title cannot be empty'),
      body('description').optional().notEmpty().withMessage('Description cannot be empty'),
      body('companyName').optional().notEmpty().withMessage('Company name cannot be empty'),
      body('companyStage')
        .optional()
        .isIn(['idea', 'pre-seed', 'seed', 'series-a', 'series-b', 'growth', 'established'])
        .withMessage('Invalid company stage'),
      body('role')
        .optional()
        .isIn(['CTO', 'CoFounder', 'LeadEngineer', 'Other'])
        .withMessage('Invalid role'),
      body('skills')
        .optional()
        .isArray()
        .withMessage('Skills must be an array'),
      body('industry')
        .optional()
        .isArray()
        .withMessage('Industry must be an array'),
      body('remote').optional().isBoolean().withMessage('Remote must be a boolean'),
      body('compensation').optional().isObject().withMessage('Compensation must be an object'),
    ],
    updateJob
  )
  .delete(deleteJob);

export default router; 