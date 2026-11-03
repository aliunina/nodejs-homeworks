import cookieParser from 'cookie-parser';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import requestLoggerMiddleware from './common/request-logger.middleware.js';
import logger from './utils/logger.js';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const config = app.get(ConfigService);
    const port = config.get<string>('PORT') ?? '3000';

    app.use(cookieParser());
    app.use(requestLoggerMiddleware);

    app.setGlobalPrefix('api/v1', { exclude: ['health'] });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        })
    );

    await app.listen(port, () => {
        logger.info(`Server is running on http://localhost:${port}`);
    });
}

bootstrap();
