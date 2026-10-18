const { createLogger, format, transports } = require('winston');
const path = require('path');

const logDirPath = path.join(__dirname, 'logs');

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.errors({ stack: true }),
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.printf(({ timestamp, level, message, stack }) => {
            stack = stack || '';
            return `${timestamp} [${level.toUpperCase()}] ${message} ${stack}`;
        })
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: path.join(logDirPath, 'app.log') }),
    ],
    exceptionHandlers: [
        new transports.Console(),
        new transports.File({
            filename: path.join(logDirPath, 'exceptions.log'),
        }),
    ],
    rejectionHandlers: [
        new transports.Console(),
        new transports.File({
            filename: path.join(logDirPath, 'rejections.log'),
        }),
    ],
});

module.exports = logger;
