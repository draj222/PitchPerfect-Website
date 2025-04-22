import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import Job from '../models/Job.ts';
import { AppError } from '../middleware/error.ts';

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private (founders only)
export const createJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Create job
    const job = await Job.create({
      ...req.body,
      creator: req.user!._id,
    });

    res.status(201).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Private
export const getJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Build filter
    const filter: any = {};
    
    // Filter by active status (default to active jobs)
    filter.active = req.query.active === 'false' ? false : true;
    
    // Filter by role
    if (req.query.role) {
      filter.role = req.query.role;
    }
    
    // Filter by company stage
    if (req.query.companyStage) {
      filter.companyStage = req.query.companyStage;
    }
    
    // Filter by skills
    if (req.query.skills) {
      filter.skills = { $in: (req.query.skills as string).split(',') };
    }
    
    // Filter by industry
    if (req.query.industry) {
      filter.industry = { $in: (req.query.industry as string).split(',') };
    }
    
    // Filter by remote
    if (req.query.remote) {
      filter.remote = req.query.remote === 'true';
    }
    
    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    // Execute query
    const jobs = await Job.find(filter)
      .populate('creator', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    // Get total count
    const total = await Job.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      count: jobs.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Private
export const getJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const job = await Job.findById(req.params.id).populate('creator', 'name email');

    if (!job) {
      return next(new AppError('Job not found', 404));
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (job creator only)
export const updateJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Find job
    let job = await Job.findById(req.params.id);

    if (!job) {
      return next(new AppError('Job not found', 404));
    }

    // Check ownership
    if (job.creator.toString() !== req.user!._id.toString()) {
      return next(new AppError('Not authorized to update this job', 401));
    }

    // Update job
    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (job creator only)
export const deleteJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Find job
    const job = await Job.findById(req.params.id);

    if (!job) {
      return next(new AppError('Job not found', 404));
    }

    // Check ownership
    if (job.creator.toString() !== req.user!._id.toString()) {
      return next(new AppError('Not authorized to delete this job', 401));
    }

    // Delete job
    await job.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get jobs created by current user
// @route   GET /api/jobs/myjobs
// @access  Private
export const getMyJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jobs = await Job.find({ creator: req.user!._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
}; 