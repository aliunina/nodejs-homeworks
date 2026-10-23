import express, { Router } from 'express';
import * as authController from '../controllers/authController.js';

const authRoute: Router = express.Router();

authRoute.post('/login', authController.login);

export default authRoute;
