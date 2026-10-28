import * as userRepository from '../repositories/userRepository.js';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import eventBus from '../events/eventBus.js';

export async function createUser(userData) {
    const existingUser = await userRepository.findByEmail(userData.email);

    if (existingUser) {
        throw new AppError('User already exists', 409);
    }

    const newUser = await User.create(userData);

    return userRepository.save(newUser);
}

export async function findUserById(userId) {
    const user = await userRepository.findById(userId);

    if (!user) {
        throw new AppError('User not found', 404);
    }

    return user;
}

export async function updateUser(userId, updateData) {
    const updatedUser = await userRepository.updateById(userId, updateData);

    if (!updatedUser) {
        throw new AppError('User not found', 404);
    }

    eventBus.emit('profileUpdated', updatedUser);

    return updatedUser;
}
