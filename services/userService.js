import * as userRepository from '../repositories/userRepository.js';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import { getSanitizedPayload } from '../utils/util.js';
import eventBus from '../events/eventBus.js';

export async function create(userData) {
    if (
        !userData.email ||
        !userData.password ||
        !userData.firstName ||
        !userData.lastName
    ) {
        throw new AppError('Missing required fields', 400);
    }

    const user = await userRepository.findByEmail(userData.email);

    if (user) {
        throw new AppError('User already exists', 409);
    }

    const payload = getSanitizedPayload(userData, [
        'email',
        'password',
        'firstName',
        'lastName',
    ]);
    const newUser = await User.create(payload);

    return await userRepository.save(newUser);
}

export async function findById(id) {
    const user = await userRepository.findById(id);

    if (!user) {
        throw new AppError('User not found', 404);
    }

    return user;
}

export async function update(id, updateData) {
    const user = await userRepository.findById(id);

    if (!user) {
        throw new AppError('User not found', 404);
    }

    const payload = getSanitizedPayload(updateData, ['firstName', 'lastName']);
    const updatedUser = await userRepository.updateById(id, payload);

    eventBus.emit('userUpdated', updatedUser);

    return updatedUser;
}
