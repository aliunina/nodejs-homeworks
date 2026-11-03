import { Module } from '@nestjs/common';
import { PostsService } from './posts.service.js';
import { PostsController } from './posts.controller.js';
import { PostsRepository } from './posts.repository.js';
import { UserAuthGuard } from '../auth/user-auth.guard.js';
import { UsersModule } from '../users/users.module.js';
import { UserPostsController } from './user-posts.controller.js';

@Module({
    imports: [UsersModule],
    controllers: [PostsController, UserPostsController],
    providers: [PostsService, PostsRepository, UserAuthGuard],
})
export class PostsModule {}
