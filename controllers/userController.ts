import type { NextFunction, Request, Response } from 'express';
import * as userService from '../services/userService.js';
import { toUserResponseDTO } from '../mappers/userMapper.js';
import type {
    CreateUserInput,
    UpdateUserInput,
} from '../schemas/userSchema.js';

export const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await userService.createUser(req.body as CreateUserInput);

        res.status(201).json(toUserResponseDTO(user));
    } catch (error) {
        next(error);
    }
};

export const getCurrentUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id as string;

        const user = await userService.findUserById(userId);

        res.status(200).json(toUserResponseDTO(user));
    } catch (error) {
        next(error);
    }
};

export const updateCurrentUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id as string;

        const updatedUser = await userService.updateUser(
            userId,
            req.body as UpdateUserInput
        );

        res.status(200).json(toUserResponseDTO(updatedUser));
    } catch (error) {
        next(error);
    }
};
