import type { Request, Response, NextFunction } from 'express';
import * as postService from '../services/postService.js';
import * as userService from '../services/userService.js';
import AppError from '../utils/AppError.js';
import { toPostResponseDTO } from '../mappers/postMapper.js';

export const createPost = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            throw new AppError('Not authorized', 401);
        }

        const post = await postService.createPost(req.body, userId);
        const user = await userService.findUserById(userId);

        res.status(201).json(toPostResponseDTO(post, user));
    } catch (error) {
        next(error);
    }
};

export const updatePost = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            throw new AppError('Not authorized', 401);
        }

        const postId = req.params.id.toString();
        const post = await postService.updatePost(postId, userId, req.body);
        const user = await userService.findUserById(userId);

        res.status(200).json(toPostResponseDTO(post, user));
    } catch (error) {
        next(error);
    }
};

export const deletePost = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            throw new AppError('Not authorized', 401);
        }

        const postId = req.params.id.toString();

        await postService.deletePost(postId, userId);

        res.status(200).json({ message: 'Post has been successfully deleted' });
    } catch (error) {
        next(error);
    }
};
