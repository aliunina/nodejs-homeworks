import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';

const userAuthMiddleware = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new AppError('Not authorized', 401);
        }

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        if (tokenDecode.id) {
            req.user = {
                id: tokenDecode.id,
            };
        } else {
            throw new AppError(
                'Wrong JWT Token, you need to log in again',
                401
            );
        }
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
