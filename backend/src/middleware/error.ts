import { Request, Response, NextFunction } from 'express';

// Custom error class
export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error with additional properties for error handling
interface ExtendedError extends Error {
  statusCode?: number;
  code?: number;
  keyValue?: Record<string, any>;
  errors?: Record<string, { message: string }>;
  path?: string;
  value?: string;
}

// Error handler middleware
export const errorHandler = (
  err: ExtendedError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Set default error values
  const error: ExtendedError = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  // Mongoose duplicate key error
  if (err.code === 11000 && err.keyValue) {
    const field = Object.keys(err.keyValue)[0];
    error.message = `Duplicate value for field: ${field}. Please use another value.`;
    error.statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError' && err.errors) {
    const messages = Object.values(err.errors).map((val) => val.message);
    error.message = messages.join(', ');
    error.statusCode = 400;
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError' && err.path && err.value) {
    error.message = `Invalid ${err.path}: ${err.value}`;
    error.statusCode = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token. Please log in again.';
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Your token has expired. Please log in again.';
    error.statusCode = 401;
  }

  // Response to client
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}; 