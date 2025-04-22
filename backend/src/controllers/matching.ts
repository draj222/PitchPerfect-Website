import { Request, Response, NextFunction } from 'express';
import Match from '../models/Match.ts';
import { AppError } from '../middleware/error.ts';
import { generateJobMatches, generateUserMatches } from '../services/matching.ts';

// @desc    Generate matches for a job
// @route   POST /api/matching/job/:jobId
// @access  Private (job creator only)
export const createJobMatches = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { jobId } = req.params;

    // Generate matches
    await generateJobMatches(jobId);

    res.status(200).json({
      success: true,
      message: 'Matches generated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate matches for a user
// @route   POST /api/matching/user
// @access  Private
export const createUserMatches = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Generate matches for current user
    await generateUserMatches(req.user!._id.toString());

    res.status(200).json({
      success: true,
      message: 'Matches generated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get matches for a job
// @route   GET /api/matching/job/:jobId
// @access  Private (job creator only)
export const getJobMatches = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { jobId } = req.params;

    // Get matches
    const matches = await Match.find({ job: jobId })
      .populate('candidate', 'name email bio skills')
      .sort({ score: -1 });

    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get matches for current user
// @route   GET /api/matching/user
// @access  Private
export const getUserMatches = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get matches
    const matches = await Match.find({ candidate: req.user!._id })
      .populate({
        path: 'job',
        select: 'title companyName role companyStage',
        populate: {
          path: 'creator',
          select: 'name email',
        },
      })
      .sort({ score: -1 });

    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update match status
// @route   PUT /api/matching/:matchId
// @access  Private (match participants only)
export const updateMatchStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { matchId } = req.params;
    const { status, notes } = req.body;

    // Validate status
    if (!['pending', 'accepted', 'rejected', 'archived'].includes(status)) {
      return next(new AppError('Invalid status', 400));
    }

    // Find match
    const match = await Match.findById(matchId)
      .populate('job', 'creator')
      .populate('candidate');

    if (!match) {
      return next(new AppError('Match not found', 404));
    }

    // Check authorization
    const userId = req.user!._id.toString();
    const jobCreatorId = (match.job as any).creator.toString();
    const candidateId = (match.candidate as any)._id.toString();

    if (userId !== jobCreatorId && userId !== candidateId) {
      return next(new AppError('Not authorized to update this match', 401));
    }

    // Update appropriate notes field based on who is updating
    if (userId === jobCreatorId) {
      match.jobPosterNotes = notes || match.jobPosterNotes;
    } else {
      match.candidateNotes = notes || match.candidateNotes;
    }

    // Update status
    match.status = status;
    await match.save();

    res.status(200).json({
      success: true,
      data: match,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get match details
// @route   GET /api/matching/:matchId
// @access  Private (match participants only)
export const getMatchDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { matchId } = req.params;

    // Find match with full details
    const match = await Match.findById(matchId)
      .populate({
        path: 'job',
        populate: {
          path: 'creator',
          select: 'name email',
        },
      })
      .populate('candidate', 'name email bio skills professionalHistory education achievements');

    if (!match) {
      return next(new AppError('Match not found', 404));
    }

    // Check authorization
    const userId = req.user!._id.toString();
    const jobCreatorId = (match.job as any).creator._id.toString();
    const candidateId = (match.candidate as any)._id.toString();

    if (userId !== jobCreatorId && userId !== candidateId) {
      return next(new AppError('Not authorized to view this match', 401));
    }

    res.status(200).json({
      success: true,
      data: match,
    });
  } catch (error) {
    next(error);
  }
}; 