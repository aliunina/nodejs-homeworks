import type { ErrorRequestHandler } from 'express';
import logger from '../utils/logger.js';

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
    if (res.headersSent) {
        next(err);
        return;
    }

    const statusCode = err.statusCode || 500;

    logger.error({
        message: err.message,
        status: statusCode,
        method: req.method,
        url: req.originalUrl,
        userId: req.user?.id || null,
        stack: err.stack,
    });

    res.status(statusCode).json({
        message: err.message || 'Internal Server Error',
    });
};

export default errorMiddleware;
