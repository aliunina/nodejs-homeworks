import express, { Router } from 'express';
import * as authController from '../controllers/authController.js';
import validate from '../middlewares/validationMiddleware.js';
import { loginSchema } from '../schemas/authSchema.js';

const authRoute: Router = express.Router();

authRoute.post('/login', validate(loginSchema), authController.login);

export default authRoute;
