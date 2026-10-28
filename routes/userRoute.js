import express from 'express';
import userAuthMiddleware from '../middlewares/userAuthMiddleware.js';
import * as userController from '../controllers/userController.js';
import { createUserSchema, updateUserSchema } from '../schemas/userSchema.js';
import validate from '../middlewares/validationMiddleware.js';

const userRoute = express.Router();

userRoute.post('/', validate(createUserSchema), userController.createUser);
userRoute.get('/me', userAuthMiddleware, userController.getCurrentUser);
userRoute.patch(
    '/me',
    userAuthMiddleware,
    validate(updateUserSchema),
    userController.updateCurrentUser
);

export default userRoute;
