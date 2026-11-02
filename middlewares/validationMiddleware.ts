import type { NextFunction, Request, Response } from 'express';
import { z, type ZodType } from 'zod';
import AppError from '../utils/AppError.js';

export default function validate<T>(schema: ZodType<T>) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const { formErrors, fieldErrors } = z.flattenError(result.error);
            const hasFieldErrors = Object.values(fieldErrors).some(Boolean);

            return next(
                new AppError(
                    formErrors[0] ?? 'Validation failed',
                    400,
                    hasFieldErrors ? fieldErrors : undefined
                )
            );
        }

        req.body = result.data;

        next();
    };
}
