import logger from '../utils/logger.js';
import type { Request, Response, NextFunction } from 'express';

const requestLoggerMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;

        logger.info({
            message: 'Incoming request:',
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
        });
    });

    next();
};

export default requestLoggerMiddleware;
