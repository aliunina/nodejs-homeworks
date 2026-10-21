import logger from '../utils/logger.js';

// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
    logger.error({
        message: err.message,
        status: err.statusCode || 500,
        method: req.method,
        url: req.originalUrl,
        userId: req.user?.id || null,
        stack: err.stack,
    });

    res.status(err.statusCode || 500).json({
        message: err.message || 'Internal Server Error',
    });
};

export default errorMiddleware;
