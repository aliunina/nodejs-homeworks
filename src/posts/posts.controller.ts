import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Req,
    UseGuards,
    Put,
    Query,
} from '@nestjs/common';
import { PostsService } from './posts.service.js';
import { CreatePostDto } from './dtos/create-post.dto.js';
import { UpdatePostDto } from './dtos/update-post.dto.js';
import type { AuthenticatedRequest } from '../types/express.js';
import { toPostResponseDto } from './dtos/post-response.dto.js';
import { UsersService } from '../users/users.service.js';
import type PostEntity from './entities/post.entity.js';
import { UserAuthGuard } from '../auth/user-auth.guard.js';
import PostListQueryDto from './dtos/post-list-query.dto.js';

@Controller('posts')
@UseGuards(UserAuthGuard)
export class PostsController {
    constructor(
        private readonly postsService: PostsService,
        private readonly usersService: UsersService
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createPost(
        @Body() body: CreatePostDto,
        @Req() req: AuthenticatedRequest
    ) {
        const userId = req.user.id;

        const post = await this.postsService.createPost(body, userId);

        return toPostResponseDto(post);
    }

    @Patch(':id')
    async updatePost(
        @Param('id') postId: string,
        @Body() body: UpdatePostDto,
        @Req() req: AuthenticatedRequest
    ) {
        const userId = req.user.id;

        const post = await this.postsService.updatePost(postId, userId, body);

        return toPostResponseDto(post);
    }

    @Delete(':id')
    async deletePost(
        @Param('id') postId: string,
        @Req() req: AuthenticatedRequest
    ) {
        const userId = req.user.id;

        await this.postsService.deletePost(postId, userId);

        return { message: 'Post has been successfully deleted' };
    }

    @Get()
    async getCurrentUserPosts(
        @Req() req: AuthenticatedRequest,
        @Query() query: PostListQueryDto
    ) {
        const userId = req.user.id;

        const posts = await this.postsService.findAllPostsByAuthorId(
            userId,
            query
        );

        return {
            data: posts.data.map((post: PostEntity) => toPostResponseDto(post)),
            page: posts.page,
            limit: posts.limit,
            total: posts.total,
        };
    }

    @Put(':id/like')
    async addLike(
        @Param('id') postId: string,
        @Req() req: AuthenticatedRequest
    ) {
        const userId = req.user.id;

        const post = await this.postsService.addLike(postId, userId);

        return toPostResponseDto(post);
    }

    @Delete(':id/like')
    async deleteLike(
        @Param('id') postId: string,
        @Req() req: AuthenticatedRequest
    ) {
        const userId = req.user.id;

        const post = await this.postsService.deleteLike(postId, userId);

        return toPostResponseDto(post);
    }
}
