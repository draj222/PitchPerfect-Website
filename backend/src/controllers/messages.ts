import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import Message from '../models/Message.ts';
import Match from '../models/Match.ts';
import { AppError } from '../middleware/error.ts';

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { matchId, content } = req.body;
    const senderId = req.user!._id;

    // Find match
    const match = await Match.findById(matchId)
      .populate('job', 'creator')
      .populate('candidate');

    if (!match) {
      return next(new AppError('Match not found', 404));
    }

    // Check if user is part of the match
    const jobCreatorId = (match.job as any).creator.toString();
    const candidateId = (match.candidate as any)._id.toString();

    if (senderId.toString() !== jobCreatorId && senderId.toString() !== candidateId) {
      return next(new AppError('Not authorized to send messages for this match', 401));
    }

    // Determine recipient
    const recipientId = senderId.toString() === jobCreatorId ? candidateId : jobCreatorId;

    // Create message
    const message = await Message.create({
      sender: senderId,
      recipient: recipientId,
      match: matchId,
      content,
    });

    // Return message with populated fields
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email')
      .populate('recipient', 'name email');

    res.status(201).json({
      success: true,
      data: populatedMessage,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages for a match
// @route   GET /api/messages/:matchId
// @access  Private (match participants only)
export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { matchId } = req.params;
    const userId = req.user!._id;

    // Find match to verify participation
    const match = await Match.findById(matchId)
      .populate('job', 'creator')
      .populate('candidate');

    if (!match) {
      return next(new AppError('Match not found', 404));
    }

    // Check if user is part of the match
    const jobCreatorId = (match.job as any).creator.toString();
    const candidateId = (match.candidate as any)._id.toString();

    if (userId.toString() !== jobCreatorId && userId.toString() !== candidateId) {
      return next(new AppError('Not authorized to view messages for this match', 401));
    }

    // Get messages
    const messages = await Message.find({ match: matchId })
      .sort({ createdAt: 'asc' })
      .populate('sender', 'name email')
      .populate('recipient', 'name email');

    // Mark messages as read if user is recipient
    await Message.updateMany(
      {
        match: matchId,
        recipient: userId,
        read: false,
      },
      { read: true }
    );

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get unread message count
// @route   GET /api/messages/unread/count
// @access  Private
export const getUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!._id;

    // Count unread messages
    const count = await Message.countDocuments({
      recipient: userId,
      read: false,
    });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's conversations
// @route   GET /api/messages/conversations
// @access  Private
export const getConversations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!._id;

    // Find matches where user is either job creator or candidate
    const matches = await Match.find({
      $or: [
        { candidate: userId },
        { job: { $in: await getJobsCreatedByUser(userId) } },
      ],
      status: 'accepted', // Only show accepted matches
    })
      .populate({
        path: 'job',
        select: 'title companyName',
        populate: {
          path: 'creator',
          select: 'name email',
        },
      })
      .populate('candidate', 'name email');

    // For each match, get the latest message and unread count
    const conversations = await Promise.all(
      matches.map(async (match) => {
        const latestMessage = await Message.findOne({ match: match._id })
          .sort({ createdAt: -1 })
          .populate('sender', 'name')
          .select('content createdAt read');

        const unreadCount = await Message.countDocuments({
          match: match._id,
          recipient: userId,
          read: false,
        });

        return {
          match: {
            id: match._id,
            job: {
              id: (match.job as any)._id,
              title: (match.job as any).title,
              companyName: (match.job as any).companyName,
              creator: {
                id: (match.job as any).creator._id,
                name: (match.job as any).creator.name,
              },
            },
            candidate: {
              id: (match.candidate as any)._id,
              name: (match.candidate as any).name,
            },
          },
          latestMessage,
          unreadCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to get jobs created by user
const getJobsCreatedByUser = async (userId: string) => {
  try {
    // Import Job model dynamically to avoid circular dependencies
    const Job = (await import('../models/Job.ts')).default;
    const jobs = await Job.find({ creator: userId }).select('_id');
    return jobs.map((job) => job._id);
  } catch (error) {
    console.error('Error getting jobs created by user:', error);
    return [];
  }
}; 