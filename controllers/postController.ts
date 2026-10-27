import type { Request, Response, NextFunction } from 'express';
import * as postService from '../services/postService.js';
import * as userService from '../services/userService.js';
import { toPostResponseDTO } from '../mappers/postMapper.js';

export const createPost = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id as string;

        const user = await userService.findUserById(userId);
        const post = await postService.createPost(req.body, userId);

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
        const userId = req.user?.id as string;
        const postId = req.params.id as string;
        
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
        const userId = req.user?.id as string;
        const postId = req.params.id as string;

        await postService.deletePost(postId, userId);

        res.status(200).json({ message: 'Post has been successfully deleted' });
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
        const userId = req.user?.id as string;

        const author = await userService.findUserById(userId);
        const posts = await postService.findAllPostsByAuthorId(userId);

        res.status(200).json(
            posts.map((post) => toPostResponseDTO(post, author))
        );
    } catch (error) {
        next(error);
    }
};
