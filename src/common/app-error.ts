export default class AppError extends Error {
    statusCode: number;

    errors?: Record<string, string>;

    constructor(
        message: string,
        statusCode: number,
        errors?: Record<string, string>
    ) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        this.errors = errors;
        Error.captureStackTrace(this, this.constructor);
    }
}
