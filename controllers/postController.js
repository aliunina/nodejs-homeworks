import * as postService from '../services/postService.js';

export const createPost = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const post = await postService.createPost(req.body, userId);

        res.status(201).json(post);
    } catch (error) {
        next(error);
    }
};

export const updatePost = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const postId = req.params.id;

        const result = await postService.updatePost(postId, userId, req.body);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const deletePost = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const postId = req.params.id;

        const result = await postService.deletePost(postId, userId);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
