import * as authService from '../services/authService.js';
import { toUserResponseDTO } from '../mappers/userMapper.js';
import ms from 'ms';

export const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body);
        const tokenMaxAge = ms(process.env.JWT_EXPIRES_IN || '7d');

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
