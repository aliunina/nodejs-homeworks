import * as userRepository from '../repositories/userRepository.js';
import AppError from '../utils/AppError.js';
import eventBus from '../events/eventBus.js';
import User from '../models/User.js';
import type {
    CreateUserInput,
    UpdateUserInput,
} from '../schemas/userSchema.js';

export async function createUser(createInput: CreateUserInput) {
    const existingUser = await userRepository.findByEmail(createInput.email);

    if (existingUser) {
        throw new AppError('User already exists', 409);
    }

    const newUser = await User.create(createInput);

    return userRepository.save(newUser);
}

export async function findUserById(userId: string) {
    const user = await userRepository.findById(userId);

    if (!user) {
        throw new AppError('User not found', 404);
    }

    return user;
}

export async function updateUser(userId: string, updateInput: UpdateUserInput) {
    const updatedUser = await userRepository.updateById(userId, updateInput);

    if (!updatedUser) {
        throw new AppError('User not found', 404);
    }

    eventBus.emit('profileUpdated', updatedUser);

    return updatedUser;
}
