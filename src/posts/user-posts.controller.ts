import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserAuthGuard } from '../auth/user-auth.guard.js';
import { PostsService } from './posts.service.js';
import type Post from './post.entity.js';
import { toPostResponseDTO } from './dtos/post-response.dto.js';

@Controller('users')
@UseGuards(UserAuthGuard)
export class UserPostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get(':id/posts')
    async getUserPosts(@Param('id') userId: string) {
        const userPosts =
            await this.postsService.findAllPostsByAuthorId(userId);

        return userPosts.posts.map((post: Post) =>
            toPostResponseDTO(post, userPosts.author)
        );
    }
}
