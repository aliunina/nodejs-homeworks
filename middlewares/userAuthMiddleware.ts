import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';

interface JwtPayload {
    id: string;
}

const userAuthMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            throw new AppError('Not authorized', 401);
        }

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new AppError('JWT secret is not configured', 500);
        }

        const decodedToken = jwt.verify(token, secret) as JwtPayload;

        if (!decodedToken.id) {
            throw new AppError(
                'Wrong JWT Token, you need to log in again',
                401
            );
        }

        req.user = {
            id: decodedToken.id,
        };

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return next(
                new AppError('Wrong JWT Token, you need to log in again', 401)
            );
        }

        next(error);
    }
};

export default userAuthMiddleware;
