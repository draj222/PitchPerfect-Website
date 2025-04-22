import jwt from 'jsonwebtoken';
import { IUser } from '../models/User.ts';

// Generate a JWT token
export const generateToken = (user: IUser): string => {
  const secret = process.env.JWT_SECRET || 'default_secret_for_development';
  
  // Using any to bypass TypeScript errors for now
  // This should be fixed in a production environment
  return jwt.sign(
    { id: user._id },
    secret,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  ) as string;
};

// Generate response with token
export const createTokenResponse = (user: IUser) => {
  const token = generateToken(user);

  return {
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileCompleted: user.profileCompleted,
    },
  };
}; 