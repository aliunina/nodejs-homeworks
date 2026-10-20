import * as userService from '../services/userService.js';
import * as postService from '../services/postService.js';

export const createUser = async (req, res, next) => {
    try {
        const user = await userService.create(req.body);

        const responseBody = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        };

        res.status(201).json(responseBody);
    } catch (error) {
        next(error);
    }
};

export const getCurrentUser = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const user = await userService.findById(userId);

        const responseBody = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        };

        res.status(200).json(responseBody);
    } catch (error) {
        next(error);
    }
};

export const updateCurrentUser = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const updatedUser = await userService.update(userId, req.body);

        const responseBody = {
            id: updatedUser.id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
        };

        res.status(200).json(responseBody);
    } catch (error) {
        next(error);
    }
};

export const getCurrentUserPosts = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const user = await userService.findById(userId);
        const posts = await postService.findAllByAuthorId(userId);

        const responseBody = posts.map((post) => {
            return {
                title: post.title,
                description: post.title,
                createdOn: post.createdOn,
                authorName: user.firstName + ' ' + user.lastName,
            };
        });

        res.status(200).json(responseBody);
    } catch (error) {
        next(error);
    }
};
