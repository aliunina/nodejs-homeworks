import type { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService.js';
import { toUserResponseDTO } from '../mappers/userMapper.js';

export const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await userService.createUser(req.body);

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

        const updatedUser = await userService.updateUser(userId, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        });

        res.status(200).json(toUserResponseDTO(updatedUser));
    } catch (error) {
        next(error);
    }
};
