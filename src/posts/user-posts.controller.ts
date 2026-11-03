import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserAuthGuard } from '../auth/user-auth.guard.js';
import { UsersService } from '../users/users.service.js';
import { PostsService } from './posts.service.js';
import type Post from './post.entity.js';
import { toPostResponseDTO } from './dtos/post-response.dto.js';

@Controller('users')
@UseGuards(UserAuthGuard)
export class UserPostsController {
    constructor(
        private readonly usersService: UsersService,
        private readonly postsService: PostsService
    ) {}

    @Get(':id/posts')
    async getUserPosts(@Param('id') userId: string) {
        const [user, posts] = await Promise.all([
            this.usersService.findUserById(userId),
            this.postsService.findAllPostsByAuthorId(userId),
        ]);

        return posts.map((post: Post) => toPostResponseDTO(post, user));
    }
}
