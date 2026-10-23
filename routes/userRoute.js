import express from 'express';
import userAuthMiddleware from '../middlewares/userAuthMiddleware.js';
import * as userController from '../controllers/userController.js';

const userRoute = express.Router();

userRoute.post('/', userController.createUser);
userRoute.get('/me', userAuthMiddleware, userController.getCurrentUser);
userRoute.patch('/me', userAuthMiddleware, userController.updateCurrentUser);
userRoute.get(
    '/me/posts',
    userAuthMiddleware,
    userController.getCurrentUserPosts
);

export default userRoute;
