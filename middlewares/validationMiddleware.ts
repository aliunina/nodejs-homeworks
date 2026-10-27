import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';
import AppError from '../utils/AppError.js';

export default function validate<T>(schema: ZodType<T>) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const errors: Record<string, string> = {};

            result.error.issues.forEach((issue) => {
                errors[issue.path[0] as string] = issue.message;
            });

            return next(new AppError('Validation failed', 400, errors));
        }

        req.body = result.data;

        next();
    };
}
