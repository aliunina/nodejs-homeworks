import * as userRepository from '../repositories/userRepository.js';
import AppError from '../utils/AppError.js';
import jwt, { type SignOptions } from 'jsonwebtoken';

export async function login(loginData: { email: string; password: string }) {
    const user = await userRepository.findByEmail(loginData.email);

    if (!user || !(await user.comparePassword(loginData.password))) {
        throw new AppError('Invalid credentials', 401);
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new AppError('JWT secret is not configured', 500);
    }

    const expiresIn = (process.env.JWT_EXPIRES_IN ||
        '7d') as SignOptions['expiresIn'];

    const jwtToken = jwt.sign({ id: user.id }, secret, {
        expiresIn,
    });

    return {
        jwtToken,
        user,
    };
}
