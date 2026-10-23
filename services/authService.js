import * as userRepository from '../repositories/userRepository.js';
import AppError from '../utils/AppError.js';
import jwt from 'jsonwebtoken';

export async function login(loginData) {
    if (!loginData.email || !loginData.password) {
        throw new AppError('Missing required credentials', 400);
    }

    const user = await userRepository.findByEmail(loginData.email);

    if (!user) {
        throw new AppError('User not found', 404);
    }

    const isValidPassword = await user.comparePassword(loginData.password);

    if (!isValidPassword) {
        throw new AppError('Invalid credentials', 400);
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new AppError('JWT secret is not configured', 500);
    }

    const jwtToken = jwt.sign({ id: user.id }, secret, {
        expiresIn: '7d',
    });

    return {
        jwtToken,
        user,
    };
}
