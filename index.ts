import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from './utils/logger.js';

import requestLoggerMiddleware from './middlewares/requestLoggerMiddleware.js';
import errorMiddleware from './middlewares/errorMiddleware.js';

import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import postRoute from './routes/postRoute.js';
import healthRoute from './routes/healthRoute.js';

import './events/userEvents.js';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(requestLoggerMiddleware);

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/posts', postRoute);
app.use('/api/v1/health', healthRoute);

app.use(errorMiddleware);

app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});
