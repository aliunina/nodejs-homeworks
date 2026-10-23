import * as postService from '../services/postService.js';
import * as userService from '../services/userService.js';
import AppError from '../utils/AppError.js';
import { toPostResponseDTO } from '../mappers/postMapper.js';

export const createPost = async (req, res, next) => {
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

export const updatePost = async (req, res, next) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            throw new AppError('Not authorized', 401);
        }

        const postId = req.params.id;
        const post = await postService.updatePost(postId, userId, req.body);
        const user = await userService.findUserById(userId);

        res.status(200).json(toPostResponseDTO(post, user));
    } catch (error) {
        next(error);
    }
};

export const deletePost = async (req, res, next) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            throw new AppError('Not authorized', 401);
        }

        const postId = req.params.id;

        await postService.deletePost(postId, userId);

        res.status(200).json({ message: 'Post has been successfully deleted' });
    } catch (error) {
        next(error);
    }
};
