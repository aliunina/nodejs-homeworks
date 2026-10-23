import * as userRepository from '../repositories/userRepository.js';
import AppError from '../utils/AppError.js';
import eventBus from '../events/eventBus.js';
import User from '../models/User.js';

export async function createUser(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}) {
    if (
        !userData.email ||
        !userData.password ||
        !userData.firstName ||
        !userData.lastName
    ) {
        throw new AppError('Missing required fields', 400);
    }

    const existingUser = await userRepository.findByEmail(userData.email);

    if (existingUser) {
        throw new AppError('User already exists', 409);
    }

    const newUser = await User.create(userData);

    return userRepository.save(newUser);
}

export async function findUserById(userId: string) {
    const user = await userRepository.findById(userId);

    if (!user) {
        throw new AppError('User not found', 404);
    }

    return user;
}

export async function updateUser(
    userId: string,
    updateData: {
        firstName?: string;
        lastName?: string;
    }
) {
    const updatedUser = await userRepository.updateById(userId, updateData);

    if (!updatedUser) {
        throw new AppError('User not found', 404);
    }

    eventBus.emit('userUpdated', updatedUser);

    return updatedUser;
}
