import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  name: string;
  role: 'founder' | 'engineer' | 'both';
  profileCompleted: boolean;
  bio?: string;
  location?: string;
  avatarUrl?: string;
  professionalHistory?: Array<{
    title: string;
    company: string;
    description: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
  }>;
  education?: Array<{
    institution: string;
    degree: string;
    field: string;
    startYear: number;
    endYear?: number;
    current: boolean;
  }>;
  achievements?: Array<{
    title: string;
    description: string;
    date?: Date;
  }>;
  skills?: string[];
  businessExpertise?: string[];
  interests?: string[];
  linkedInUrl?: string;
  githubUrl?: string;
  resumeUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  matchingPreferences?: {
    industries?: string[];
    roles?: string[];
    companyStages?: string[];
    remote?: boolean;
    locations?: string[];
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['founder', 'engineer', 'both'],
      required: [true, 'Please specify your role'],
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    bio: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    avatarUrl: {
      type: String,
    },
    professionalHistory: [
      {
        title: { type: String, required: true },
        company: { type: String, required: true },
        description: { type: String },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        current: { type: Boolean, default: false },
      },
    ],
    education: [
      {
        institution: { type: String, required: true },
        degree: { type: String, required: true },
        field: { type: String, required: true },
        startYear: { type: Number, required: true },
        endYear: { type: Number },
        current: { type: Boolean, default: false },
      },
    ],
    achievements: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        date: { type: Date },
      },
    ],
    skills: [String],
    businessExpertise: [String],
    interests: [String],
    linkedInUrl: {
      type: String,
      trim: true,
    },
    githubUrl: {
      type: String,
      trim: true,
    },
    resumeUrl: {
      type: String,
    },
    matchingPreferences: {
      industries: [String],
      roles: [String],
      companyStages: [String],
      remote: Boolean,
      locations: [String],
    },
  },
  { timestamps: true }
);

// Hash the password before saving
UserSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified or is new
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema); 