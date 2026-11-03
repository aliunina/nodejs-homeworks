import {
    Catch,
    HttpException,
    HttpStatus,
    type ArgumentsHost,
    type ExceptionFilter,
} from '@nestjs/common';
import type { Response } from 'express';
import AppError from './app-error.js';
import logger from '../utils/logger.js';
import type { AuthenticatedRequest } from '../types/express.js';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const req = ctx.getRequest<AuthenticatedRequest>();
        const res = ctx.getResponse<Response>();

        const { statusCode, message, errors } = this.toBody(exception);

        logger.error({
            message,
            status: statusCode,
            method: req.method,
            url: req.originalUrl,
            userId: req.user?.id ?? null,
            stack: exception instanceof Error ? exception.stack : undefined,
            errors,
        });

        res.status(statusCode).json({
            message,
            ...(errors && { errors }),
        });
    }

    private toBody(exception: unknown) {
        if (exception instanceof AppError) {
            return {
                statusCode: exception.statusCode,
                message: exception.message,
                errors: exception.errors,
            };
        }

        if (exception instanceof HttpException) {
            const statusCode = exception.getStatus();
            const body = exception.getResponse();

            if (typeof body === 'string') {
                return {
                    statusCode,
                    message: body,
                };
            }

            const payload = body as {
                message?: string | string[];
                errors?: Record<string, string>;
            };

            const message = Array.isArray(payload.message)
                ? payload.message.join(', ')
                : payload.message || exception.message;

            return {
                statusCode,
                message,
                errors: payload.errors,
            };
        }

        return {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Internal Server Error',
        };
    }
}
