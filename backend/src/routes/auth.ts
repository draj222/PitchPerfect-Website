import express from 'express';
import { body } from 'express-validator';
import { register, login, getMe, updateProfile } from '../controllers/auth.ts';
import { protect } from '../middleware/auth.ts';

const router = express.Router();

// Register route with validation
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('role')
      .optional()
      .isIn(['founder', 'engineer', 'both'])
      .withMessage('Role must be founder, engineer, or both'),
  ],
  register
);

// Login route with validation
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').exists().withMessage('Password is required'),
  ],
  login
);

// Get current user route (protected)
router.get('/me', protect, getMe);

// Update profile route (protected) with validation
router.put(
  '/updateprofile',
  protect,
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('bio').optional(),
    body('location').optional(),
    body('skills').optional().isArray().withMessage('Skills must be an array'),
    body('businessExpertise').optional().isArray().withMessage('Business expertise must be an array'),
    body('interests').optional().isArray().withMessage('Interests must be an array'),
    body('linkedInUrl').optional().isURL().withMessage('LinkedIn URL must be valid'),
    body('githubUrl').optional().isURL().withMessage('GitHub URL must be valid'),
    body('professionalHistory').optional().isArray().withMessage('Professional history must be an array'),
    body('education').optional().isArray().withMessage('Education must be an array'),
    body('achievements').optional().isArray().withMessage('Achievements must be an array'),
    body('matchingPreferences').optional().isObject().withMessage('Matching preferences must be an object'),
  ],
  updateProfile
);

export default router; 