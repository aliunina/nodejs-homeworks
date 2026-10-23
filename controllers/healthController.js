import * as healthService from '../services/healthService.js';

export const readHealth = async (req, res, next) => {
    try {
        const appVersion = await healthService.getAppVersion();
        res.status(200)
            .set({
                'X-Powered-By': 'Node.js',
                'Cache-Control':
                    'no-store, no-cache, must-revalidate, proxy-revalidate',
                Connection: 'keep-alive',
                Date: new Date().toUTCString(),
            })
            .type('json')
            .send(appVersion);
    } catch (error) {
        next(error);
    }
};
