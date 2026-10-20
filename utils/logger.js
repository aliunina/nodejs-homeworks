import { createLogger, format, transports } from 'winston';
import path from 'path';

const LOGS_DIR_PATH = path.join(process.cwd(), 'logs');

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.errors({ stack: true }),
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.errors({
            stack: true,
        }),
        format.printf(({ timestamp, level, message, stack }) => {
            const stackStr = stack || '';
            return `${timestamp} [${level.toUpperCase()}] ${
                typeof message === 'object' ? JSON.stringify(message) : message
            } \n ${stackStr}`;
        })
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: path.join(LOGS_DIR_PATH, 'app.log') }),
    ],
    exceptionHandlers: [
        new transports.Console(),
        new transports.File({
            filename: path.join(LOGS_DIR_PATH, 'exceptions.log'),
        }),
    ],
    rejectionHandlers: [
        new transports.Console(),
        new transports.File({
            filename: path.join(LOGS_DIR_PATH, 'rejections.log'),
        }),
    ],
});

export default logger;
