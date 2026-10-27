import * as postService from '../services/postService.js';
import * as userService from '../services/userService.js';
import { toPostResponseDTO } from '../mappers/postMapper.js';

export const createPost = async (req, res, next) => {
    try {
        const userId = req.user?.id;

        const user = await userService.findUserById(userId);
        const post = await postService.createPost(req.body, userId);

        res.status(201).json(toPostResponseDTO(post, user));
    } catch (error) {
        next(error);
    }
};

export const updatePost = async (req, res, next) => {
    try {
        const userId = req.user?.id;

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
        const postId = req.params.id;

        await postService.deletePost(postId, userId);

        res.status(200).json({ message: 'Post has been successfully deleted' });
    } catch (error) {
        next(error);
    }
};

export const getCurrentUserPosts = async (req, res, next) => {
    try {
        const userId = req.user?.id;

        const author = await userService.findUserById(userId);
        const posts = await postService.findAllPostsByAuthorId(userId);

        res.status(200).json(
            posts.map((post) => toPostResponseDTO(post, author))
        );
    } catch (error) {
        next(error);
    }
};
