import express from 'express';
import * as healthController from '../controllers/healthController.js';

const healthRoute = express.Router();

healthRoute.get('/', healthController.readHealth);

export default healthRoute;
