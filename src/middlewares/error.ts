import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  keyValue?: any;
}

export const errorMiddleware = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Log error for server-side debugging
  console.error(`[ERROR] ${req.method} ${req.url} - ${err.message}`);
  if (err.stack) console.error(err.stack);

  // Specific Error Handling
  if (err.name === 'JsonWebTokenError') {
    err.message = 'Invalid token. Please log in again';
    err.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    err.message = 'Token has expired. Please log in again';
    err.statusCode = 401;
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    // Always show error details during this debug phase
    details: err.message,
    stack: err.stack, 
  });
};
