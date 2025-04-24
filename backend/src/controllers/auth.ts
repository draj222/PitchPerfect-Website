import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

// Mock user data for demo
const mockUsers = [
  {
    _id: '1',
    name: 'Demo Founder',
    email: 'founder@example.com',
    role: 'founder',
    profileCompleted: true
  },
  {
    _id: '2',
    name: 'Demo Engineer',
    email: 'engineer@example.com',
    role: 'engineer',
    profileCompleted: true
  }
];

// Helper to generate JWT token - simplified for demo
const generateToken = (id: string): string => {
  // For demo purposes, we'll just create a simple token without JWT
  return `demo-token-${id}-${Date.now()}`;
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = (req: Request, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password, role = 'engineer' } = req.body;

    // Simple check if user already exists
    const userExists = mockUsers.find(user => user.email === email);
    if (userExists) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    // In a demo, we'll just create a mock user object
    const user = {
      _id: (mockUsers.length + 1).toString(),
      name,
      email,
      role,
      profileCompleted: false
    };

    // Add to mock users
    mockUsers.push(user);

    // Generate token
    const token = generateToken(user._id);

    // Return token and user info
    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileCompleted: user.profileCompleted
        }
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = (req: Request, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = mockUsers.find(user => user.email === email);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // In demo mode, any password is accepted for convenience
    // Generate token
    const token = generateToken(user._id);

    // Return token and user info
    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileCompleted: user.profileCompleted
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = (req: Request, res: Response) => {
  try {
    // In demo mode, we'll just return a mock user
    // In real implementation, req.user would be set by the auth middleware
    const userId = req.user?.id || '1';
    const user = mockUsers.find(user => user._id === userId);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileCompleted: user.profileCompleted
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/updateprofile
// @access  Private
export const updateProfile = (req: Request, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // In demo mode, we'll just return success
    res.status(200).json({
      success: true,
      data: {
        message: 'Profile updated successfully (demo mode)'
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
}; 