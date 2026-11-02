import express, { Router } from 'express';
import * as healthController from '../controllers/healthController.js';

const healthRoute: Router = express.Router();

healthRoute.get('/', healthController.readHealth);

export default healthRoute;
