import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UserAuthGuard } from '../auth/user-auth.guard.js';
import { PostsService } from './posts.service.js';
import { toPostResponseDto } from './dtos/post-response.dto.js';
import Post from './entities/post.entity.js';
import PostListQueryDto from './dtos/post-list-query.dto.js';

@Controller('users')
@UseGuards(UserAuthGuard)
export class UserPostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get(':id/posts')
    async getUserPosts(
        @Param('id') userId: string,
        @Query() query: PostListQueryDto
    ) {
        const posts = await this.postsService.findAllPostsByAuthorId(
            userId,
            query
        );

        return {
            data: posts.data.map((post: Post) => toPostResponseDto(post)),
            page: posts.page,
            limit: posts.limit,
            total: posts.total,
        };
    }
}
