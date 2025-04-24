import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Interface for decoded token
interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
}

// Extend the Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}

// Middleware to protect routes
export const protect = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Extract token from Bearer token
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }

    // Verify token
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'demo_secret_key'
      ) as DecodedToken;

      // In a real implementation, we would find the user in the database
      // For demo mode, we'll just set the user ID on the request
      req.user = {
        id: decoded.id
      };

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Middleware to restrict access based on user role
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }

    if (!roles.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action',
      });
    }

    next();
  };
}; 