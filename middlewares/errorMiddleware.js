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
        errors: err.errors,
    });

    const responseJson = {
        message: err.message || 'Internal Server Error',
    };

    if (err.errors) {
        responseJson.errors = err.errors;
    }

    res.status(err.statusCode || 500).json(responseJson);
};

export default errorMiddleware;
