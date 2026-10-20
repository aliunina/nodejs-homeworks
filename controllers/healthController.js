import * as healthService from '../services/healthService.js';

export const readHealth = async (req, res, next) => {
    try {
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'X-Powered-By': 'Node.js',
            'Cache-Control':
                'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Connection': 'keep-alive',
            'Date': new Date().toUTCString(),
        });

        const appVersion = await healthService.getAppVersion();

        res.end(appVersion);
    } catch (error) {
        next(error);
    }
};
