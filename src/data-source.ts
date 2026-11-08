import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { User } from './users/user2.entity.js';
import { Post } from './posts/post2.entity.js';
import { PostLike } from './posts/post-like.entity.js';

config();

const configService = new ConfigService();

export default new DataSource({
    type: 'mysql',
    host: configService.getOrThrow<string>('DB_HOST'),
    port: Number(configService.getOrThrow<string>('DB_PORT')),
    username: configService.getOrThrow<string>('DB_USERNAME'),
    password: configService.getOrThrow<string>('DB_PASSWORD'),
    database: configService.getOrThrow<string>('DB_NAME'),
    entities: [User, Post, PostLike],
    migrations: ['src/migrations/*.ts'],
});
