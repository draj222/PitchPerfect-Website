import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User.ts';
import { AppError } from '../middleware/error.ts';
import { createTokenResponse } from '../utils/token.ts';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('User already exists with this email', 400));
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'engineer', // Default to engineer if not specified
    });

    // Return token
    return res.status(201).json(createTokenResponse(user));
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new AppError('Invalid credentials', 401));
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new AppError('Invalid credentials', 401));
    }

    // Return token
    return res.status(200).json(createTokenResponse(user));
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user!._id);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/updateprofile
// @access  Private
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Fields to update
    const {
      name,
      bio,
      location,
      skills,
      businessExpertise,
      interests,
      linkedInUrl,
      githubUrl,
      professionalHistory,
      education,
      achievements,
      matchingPreferences
    } = req.body;

    // Find and update user
    const user = await User.findByIdAndUpdate(
      req.user!._id,
      {
        name,
        bio,
        location,
        skills,
        businessExpertise,
        interests,
        linkedInUrl,
        githubUrl,
        ...(professionalHistory && { professionalHistory }),
        ...(education && { education }),
        ...(achievements && { achievements }),
        ...(matchingPreferences && { matchingPreferences }),
        profileCompleted: true
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}; 