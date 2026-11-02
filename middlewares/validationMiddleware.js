import z from 'zod';
import AppError from '../utils/AppError.js';

export default function validate(schema) {
    return (req, res, next) => {
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
