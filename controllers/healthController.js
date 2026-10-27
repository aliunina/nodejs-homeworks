import * as healthService from '../services/healthService.js';

export const readHealth = async (req, res, next) => {
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
