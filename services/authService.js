import * as userRepository from '../repositories/userRepository.js';
import AppError from '../utils/AppError.js';
import jwt from 'jsonwebtoken';

export async function login(email, password) {
    if (!email || !password) {
        throw new AppError('Missing required credentials', 400);
    }

    const user = await userRepository.findByEmail(email);

    if (!user) {
        throw new AppError('User not found', 404);
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
        throw new AppError('Invalid credentials', 400);
    }

    const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });

    return {
        jwtToken,
        user,
    };
}
