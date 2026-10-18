require('dotenv').config();

const http = require('http');
const fs = require('fs');
const path = require('path');
const logger = require('./logger');

const PORT = process.env.PORT || 3000;

const packageJsonPath = path.join(__dirname, 'package.json');
const { version } = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const server = http.createServer(function (req, res) {
    logger.info(`Incoming request: ${req.method} ${req.url}`);

    try {
        if (req.method === 'GET' && req.url === '/health') {
            res.writeHead(200, {
                'Content-Type': 'application/json',
                'X-Powered-By': 'Node.js',
                'Cache-Control':
                    'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Connection': 'keep-alive',
                'Date': new Date().toUTCString(),
            });

            res.end(JSON.stringify({ version }));
        } else {
            res.writeHead(404, {
                'Content-Type': 'application/json',
            });

            res.end(JSON.stringify({ error: 'Not Found' }));
        }
    } catch (err) {
        logger.error('Error handling request:', {
            message: err.message,
            stack: err.stack,
        });

        res.writeHead(500, {
            'Content-Type': 'application/json',
        });

        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
});

server.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});
