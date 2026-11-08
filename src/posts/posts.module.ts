import { Module } from '@nestjs/common';
import { PostsService } from './posts.service.js';
import { PostsController } from './posts.controller.js';
import { PostsRepository } from './posts.repository.js';
import { UserAuthGuard } from '../auth/user-auth.guard.js';
import { UsersModule } from '../users/users.module.js';
import { UserPostsController } from './user-posts.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post2.entity.js';
import { PostLike } from './post-like.entity.js';

@Module({
    imports: [UsersModule, TypeOrmModule.forFeature([Post, PostLike])],
    controllers: [PostsController, UserPostsController],
    providers: [PostsService, PostsRepository, UserAuthGuard],
})
export class PostsModule {}
