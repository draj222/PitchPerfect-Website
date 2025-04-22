import mongoose from 'mongoose';

export interface IMatch extends mongoose.Document {
  job: mongoose.Types.ObjectId;
  candidate: mongoose.Types.ObjectId;
  score: number;
  status: 'pending' | 'accepted' | 'rejected' | 'archived';
  candidateNotes?: string;
  jobPosterNotes?: string;
  aiMatchingReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MatchSchema = new mongoose.Schema<IMatch>(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Match must reference a job'],
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Match must reference a candidate'],
    },
    score: {
      type: Number,
      required: [true, 'Match must have a score'],
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'archived'],
      default: 'pending',
    },
    candidateNotes: {
      type: String,
    },
    jobPosterNotes: {
      type: String,
    },
    aiMatchingReason: {
      type: String,
    },
  },
  { timestamps: true }
);

// Create a compound unique index to prevent duplicate matches
MatchSchema.index({ job: 1, candidate: 1 }, { unique: true });

// Create indexes for efficient querying
MatchSchema.index({ job: 1, score: -1 });
MatchSchema.index({ candidate: 1, score: -1 });
MatchSchema.index({ status: 1 });

export default mongoose.model<IMatch>('Match', MatchSchema); 