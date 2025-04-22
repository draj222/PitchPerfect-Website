import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: 'founder' | 'engineer' | 'both';
  bio?: string;
  location?: string;
  skills?: string[];
  businessExpertise?: string[];
  interests?: string[];
  linkedInUrl?: string;
  githubUrl?: string;
  professionalHistory?: any[];
  education?: any[];
  achievements?: any[];
  matchingPreferences?: any;
  profileCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['founder', 'engineer', 'both'],
      default: 'both',
    },
    bio: {
      type: String,
      trim: true,
    },
    location: String,
    skills: [String],
    businessExpertise: [String],
    interests: [String],
    linkedInUrl: String,
    githubUrl: String,
    professionalHistory: [
      {
        title: String,
        company: String,
        description: String,
        startDate: Date,
        endDate: Date,
        current: Boolean,
      },
    ],
    education: [
      {
        school: String,
        degree: String,
        fieldOfStudy: String,
        from: Date,
        to: Date,
        current: Boolean,
      },
    ],
    achievements: [
      {
        title: String,
        description: String,
        date: Date,
      },
    ],
    matchingPreferences: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema);