import express, { Router } from 'express';
import userAuthMiddleware from '../middlewares/userAuthMiddleware.js';
import * as postController from '../controllers/postController.js';

const postRoute: Router = express.Router();

postRoute.post('/', userAuthMiddleware, postController.createPost);
postRoute.patch('/:id', userAuthMiddleware, postController.updatePost);
postRoute.delete('/:id', userAuthMiddleware, postController.deletePost);

export default postRoute;
