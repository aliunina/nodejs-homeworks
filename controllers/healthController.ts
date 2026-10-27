import * as healthService from '../services/healthService.js';
import type { Request, Response, NextFunction } from 'express';

export const readHealth = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const version = await healthService.getAppVersion();
        res.status(200)
            .set({
                'X-Powered-By': 'Node.js',
                'Cache-Control':
                    'no-store, no-cache, must-revalidate, proxy-revalidate',
                Connection: 'keep-alive',
                Date: new Date().toUTCString(),
            })
            .json({
                version,
            });
    } catch (error) {
        next(error);
    }
};
