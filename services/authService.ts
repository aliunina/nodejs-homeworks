import * as userRepository from '../repositories/userRepository.js';
import { LoginInput } from '../schemas/authSchema.js';
import AppError from '../utils/AppError.js';
import jwt, { type SignOptions } from 'jsonwebtoken';

export async function login(loginInput: LoginInput) {
    const user = await userRepository.findByEmail(loginInput.email);

    if (!user || !(await user.comparePassword(loginInput.password))) {
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
