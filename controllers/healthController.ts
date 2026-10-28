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
                'Cache-Control':
                    'no-store, no-cache, must-revalidate, proxy-revalidate',
            })
            .json({
                version,
            });
    } catch (error) {
        next(error);
    }
};
