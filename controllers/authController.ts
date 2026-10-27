import type { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService.js';
import { toUserResponseDTO } from '../mappers/userMapper.js';
import ms, { StringValue } from 'ms';

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await authService.login(req.body);
        const tokenMaxAge = ms((process.env.JWT_EXPIRES_IN || '7d') as StringValue);

        res.cookie('token', result.jwtToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: tokenMaxAge,
        });

        res.status(200).json(toUserResponseDTO(result.user));
    } catch (error) {
        next(error);
    }
};
