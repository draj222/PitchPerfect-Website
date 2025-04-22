import mongoose from 'mongoose';

export interface IJob extends mongoose.Document {
  title: string;
  description: string;
  creator: mongoose.Types.ObjectId;
  companyName: string;
  companyLogo?: string;
  companyWebsite?: string;
  companyStage: string;
  role: 'CTO' | 'CoFounder' | 'LeadEngineer' | 'Other';
  roleDetails?: string;
  skills: string[];
  industry: string[];
  location?: string;
  remote: boolean;
  compensation: {
    equity?: {
      min?: number;
      max?: number;
    };
    salary?: {
      min?: number;
      max?: number;
      currency?: string;
    };
  };
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new mongoose.Schema<IJob>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a job title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a job description'],
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Job posting must have a creator'],
    },
    companyName: {
      type: String,
      required: [true, 'Please provide a company name'],
      trim: true,
    },
    companyLogo: {
      type: String,
    },
    companyWebsite: {
      type: String,
      trim: true,
    },
    companyStage: {
      type: String,
      required: [true, 'Please specify company stage'],
      enum: ['idea', 'pre-seed', 'seed', 'series-a', 'series-b', 'growth', 'established'],
    },
    role: {
      type: String,
      required: [true, 'Please specify the role'],
      enum: ['CTO', 'CoFounder', 'LeadEngineer', 'Other'],
    },
    roleDetails: {
      type: String,
    },
    skills: {
      type: [String],
      required: [true, 'Please specify required skills'],
    },
    industry: {
      type: [String],
      required: [true, 'Please specify the industry'],
    },
    location: {
      type: String,
      trim: true,
    },
    remote: {
      type: Boolean,
      default: false,
    },
    compensation: {
      equity: {
        min: {
          type: Number,
          min: 0,
          max: 100,
        },
        max: {
          type: Number,
          min: 0,
          max: 100,
        },
      },
      salary: {
        min: Number,
        max: Number,
        currency: {
          type: String,
          default: 'USD',
        },
      },
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Create indexes for efficient searches
JobSchema.index({ skills: 1, industry: 1, companyStage: 1, role: 1 });
JobSchema.index({ creator: 1 });
JobSchema.index({ active: 1 });

export default mongoose.model<IJob>('Job', JobSchema); 