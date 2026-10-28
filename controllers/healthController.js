import * as healthService from '../services/healthService.js';

export const readHealth = async (req, res, next) => {
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
