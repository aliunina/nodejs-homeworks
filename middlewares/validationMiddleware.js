import AppError from '../utils/AppError.js';

export default function validate(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const errors = {};

            result.error.issues.forEach((issue) => {
                errors[issue.path[0]] = issue.message;
            });

            return next(new AppError('Validation failed', 400, errors));
        }

        req.body = result.data;

        next();
    };
}
