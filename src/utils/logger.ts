import { createLogger, format, transports } from 'winston';
import path from 'path';

const LOGS_DIR_PATH = path.join(process.cwd(), 'logs');

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.printf(
            ({
                timestamp,
                level,
                message,
                stack,
                status,
                method,
                url,
                userId,
                duration,
                ip,
                errors,
            }) => {
                const stackStr = typeof stack === 'string' ? stack : '';
                const timestampStr =
                    typeof timestamp === 'string' ? timestamp : '';
                const messageStr =
                    typeof message === 'string'
                        ? message
                        : JSON.stringify(message);
                const extra = [
                    status && `status=${status}`,
                    method && `method=${method}`,
                    url && `url=${url}`,
                    userId && `userId=${userId}`,
                    ip && `ip=${ip}`,
                    duration && `duration=${duration}`,
                    errors && `errors=${JSON.stringify(errors)}`,
                ]
                    .filter(Boolean)
                    .join(' ');

                return `${timestampStr} [${level.toUpperCase()}] ${messageStr} ${extra} ${stackStr}`;
            }
        )
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
