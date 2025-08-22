import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';
import { ResponseBuilder } from '../utils/response.js';
import { logger } from '../utils/logger.js';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let isOperational = false;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  }

  // Log error for debugging
  logger.error(message, 'ErrorHandler', err, {
    statusCode,
    isOperational,
    path: req.originalUrl,
    method: req.method,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
  });

  // Don't leak error details in production
  const errorResponse = ResponseBuilder.error(
    message,
    err instanceof AppError ? err.constructor.name : 'InternalError',
    process.env.NODE_ENV === 'development' ? err.stack : undefined,
    req
  );

  res.status(statusCode).json(errorResponse);
};

export const notFound = (req: Request, res: Response): void => {
  const response = ResponseBuilder.notFound(`Route ${req.originalUrl} not found`, req);
  res.status(404).json(response);
};
