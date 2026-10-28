export default class AppError extends Error {
    constructor(message, statusCode, errors) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        this.errors = errors;
        Error.captureStackTrace(this, this.constructor);
    }
}
