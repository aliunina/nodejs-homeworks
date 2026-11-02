import type { ErrorRequestHandler } from 'express';
import logger from '../utils/logger.js';
import AppError from '../utils/AppError.js';

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
    if (res.headersSent) {
        next(err);
        return;
    }

    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message =
        err instanceof Error ? err.message : 'Internal Server Error';
    const errors = err instanceof AppError ? err.errors : undefined;

    logger.error({
        message,
        status: statusCode,
        method: req.method,
        url: req.originalUrl,
        userId: req.user?.id || null,
        stack: err instanceof Error ? err.stack : undefined,
        errors,
    });

    res.status(statusCode).json({
        message: message || 'Internal Server Error',
        ...(errors && { errors }),
    });
};

export default errorMiddleware;
