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
} from '@nestjs/common';
import { PostsService } from './posts.service.js';
import { CreatePostDto } from './dtos/create-post.dto.js';
import { UpdatePostDto } from './dtos/update-post.dto.js';
import type { AuthenticatedRequest } from '../types/express.js';
import { toPostResponseDTO } from './dtos/post-response.dto.js';
import { UsersService } from '../users/users.service.js';
import type PostEntity from './post.entity.js';
import { UserAuthGuard } from '../auth/user-auth.guard.js';

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

        const [user, post] = await Promise.all([
            this.usersService.findUserById(userId),
            this.postsService.createPost(body, userId),
        ]);

        return toPostResponseDTO(post, user);
    }

    @Patch(':id')
    async updatePost(
        @Param('id') postId: string,
        @Body() body: UpdatePostDto,
        @Req() req: AuthenticatedRequest
    ) {
        const userId = req.user.id;

        const [user, post] = await Promise.all([
            this.usersService.findUserById(userId),
            this.postsService.updatePost(postId, userId, body),
        ]);

        return toPostResponseDTO(post, user);
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
    async getCurrentUserPosts(@Req() req: AuthenticatedRequest) {
        const userId = req.user.id;

        const [user, posts] = await Promise.all([
            this.usersService.findUserById(userId),
            this.postsService.findAllPostsByAuthorId(userId),
        ]);

        return posts.map((post: PostEntity) => toPostResponseDTO(post, user));
    }
}
