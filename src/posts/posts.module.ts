import { Module } from '@nestjs/common';
import { PostsService } from './posts.service.js';
import { PostsController } from './posts.controller.js';
import { UserAuthGuard } from '../auth/user-auth.guard.js';
import { UsersModule } from '../users/users.module.js';
import { UserPostsController } from './user-posts.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import Post from "./entities/post.entity.js";
import PostLike from "./entities/post-like.entity.js";

@Module({
    imports: [UsersModule, TypeOrmModule.forFeature([Post, PostLike])],
    controllers: [PostsController, UserPostsController],
    providers: [PostsService, UserAuthGuard],
})
export class PostsModule {}
