import { Request, Response, NextFunction } from 'express';
import User from '../models/User.ts';
import { AppError } from '../middleware/error.ts';

// @desc    Get all users
// @route   GET /api/users
// @access  Private (admin only)
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Add filters
    const filter: any = {};
    
    // Filter by role
    if (req.query.role) {
      filter.role = req.query.role;
    }
    
    // Filter by profile completion
    if (req.query.profileCompleted) {
      filter.profileCompleted = req.query.profileCompleted === 'true';
    }
    
    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    // Execute query
    const users = await User.find(filter)
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    // Get total count
    const total = await User.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      count: users.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

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

// @desc    Get user profile stats
// @route   GET /api/users/stats
// @access  Private
export const getUserStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Import models dynamically to avoid circular dependencies
    const Match = (await import('../models/Match.ts')).default;
    const Job = (await import('../models/Job.ts')).default;
    const Message = (await import('../models/Message.ts')).default;
    
    const userId = req.user!._id;
    
    // Get user
    const user = await User.findById(userId);
    
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    
    // Get counts
    const matchesAsCandidate = await Match.countDocuments({ candidate: userId });
    const jobsPosted = await Job.countDocuments({ creator: userId });
    
    // Get matches for jobs posted by user
    const jobIds = (await Job.find({ creator: userId }).select('_id')).map(job => job._id);
    const matchesForJobs = await Match.countDocuments({ job: { $in: jobIds } });
    
    // Get message counts
    const messagesSent = await Message.countDocuments({ sender: userId });
    const messagesReceived = await Message.countDocuments({ recipient: userId });
    const unreadMessages = await Message.countDocuments({ recipient: userId, read: false });
    
    // Get match stats
    const pendingMatches = await Match.countDocuments({ 
      $or: [
        { candidate: userId, status: 'pending' },
        { job: { $in: jobIds }, status: 'pending' }
      ]
    });
    
    const acceptedMatches = await Match.countDocuments({ 
      $or: [
        { candidate: userId, status: 'accepted' },
        { job: { $in: jobIds }, status: 'accepted' }
      ]
    });
    
    res.status(200).json({
      success: true,
      data: {
        profileCompleted: user.profileCompleted,
        matchesAsCandidate,
        jobsPosted,
        matchesForJobs,
        messagesSent,
        messagesReceived,
        unreadMessages,
        pendingMatches,
        acceptedMatches,
        totalMatches: matchesAsCandidate + matchesForJobs
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search for users
// @route   GET /api/users/search
// @access  Private
export const searchUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const searchQuery = req.query.q as string;
    
    if (!searchQuery) {
      return next(new AppError('Search query is required', 400));
    }
    
    // Build search filter
    const filter: any = {
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { bio: { $regex: searchQuery, $options: 'i' } },
        { skills: { $in: searchQuery.split(',').map(s => s.trim()) } }
      ],
      profileCompleted: true
    };
    
    // Execute search
    const users = await User.find(filter)
      .select('name email role skills bio location')
      .limit(10);
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
}; 