import * as userService from '../services/userService.js';
import * as postService from '../services/postService.js';
import type { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError.js';
import { toUserResponseDTO } from '../mappers/userMapper.js';
import { toPostResponseDTO } from '../mappers/postMapper.js';

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
        const userId = req.user?.id;

        if (!userId) {
            throw new AppError('Not authorized', 401);
        }

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
        const userId = req.user?.id;

        if (!userId) {
            throw new AppError('Not authorized', 401);
        }

        const updatedUser = await userService.updateUser(userId, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        });

        res.status(200).json(toUserResponseDTO(updatedUser));
    } catch (error) {
        next(error);
    }
};

export const getCurrentUserPosts = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            throw new AppError('Not authorized', 401);
        }

        const author = await userService.findUserById(userId);
        const posts = await postService.findAllPostsByAuthorId(userId);

        res.status(200).json(
            posts.map((post) => toPostResponseDTO(post, author))
        );
    } catch (error) {
        next(error);
    }
};
