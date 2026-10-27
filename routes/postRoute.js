import express from 'express';
import userAuthMiddleware from '../middlewares/userAuthMiddleware.js';
import * as postController from '../controllers/postController.js';
import validate from '../middlewares/validationMiddleware.js';
import { createPostSchema, updatePostSchema } from '../schemas/postSchema.js';

const postRoute = express.Router();

postRoute.post(
    '/',
    userAuthMiddleware,
    validate(createPostSchema),
    postController.createPost
);
postRoute.patch(
    '/:id',
    userAuthMiddleware,
    validate(updatePostSchema),
    postController.updatePost
);
postRoute.delete('/:id', userAuthMiddleware, postController.deletePost);
postRoute.get('/', userAuthMiddleware, postController.getCurrentUserPosts);

export default postRoute;
