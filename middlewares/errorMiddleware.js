import AppError from '../utils/AppError.js';
import logger from '../utils/logger.js';

// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message =
        err instanceof Error ? err.message : 'Internal Server Error';
    const errors = err instanceof AppError ? err.errors : undefined;

    logger.error({
        message,
        status: statusCode || 500,
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
