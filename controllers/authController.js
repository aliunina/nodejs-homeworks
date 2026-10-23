import * as authService from '../services/authService.js';
import { toUserResponseDTO } from '../mappers/userMapper.js';

export const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body);

        res.cookie('token', result.jwtToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json(toUserResponseDTO(result.user));
    } catch (error) {
        next(error);
    }
};
