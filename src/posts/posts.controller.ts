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
} from '@nestjs/common';
import { PostsService } from './posts.service.js';
import { CreatePostDto } from './dtos/create-post.dto.js';
import { UpdatePostDto } from './dtos/update-post.dto.js';
import type { AuthenticatedRequest } from '../types/express.js';
import { toPostResponseDTO } from './dtos/post-response.dto.js';
import type PostEntity from './post.entity.js';
import { UserAuthGuard } from '../auth/user-auth.guard.js';

@Controller('posts')
@UseGuards(UserAuthGuard)
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createPost(
        @Body() body: CreatePostDto,
        @Req() req: AuthenticatedRequest
    ) {
        const userId = req.user.id;

        const createdPost = await this.postsService.createPost(body, userId);

        return toPostResponseDTO(createdPost.post, createdPost.author);
    }

    @Patch(':id')
    async updatePost(
        @Param('id') postId: string,
        @Body() body: UpdatePostDto,
        @Req() req: AuthenticatedRequest
    ) {
        const userId = req.user.id;

        const updatedPost = await this.postsService.updatePost(
            postId,
            userId,
            body
        );

        return toPostResponseDTO(updatedPost.post, updatedPost.author);
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

        const userPosts =
            await this.postsService.findAllPostsByAuthorId(userId);

        return userPosts.posts.map((post: PostEntity) =>
            toPostResponseDTO(post, userPosts.author)
        );
    }

    @Put(':id/like')
    async addLike(
        @Param('id') postId: string,
        @Req() req: AuthenticatedRequest
    ) {
        const userId = req.user.id;

        const likedPost = await this.postsService.addLike(postId, userId);

        return toPostResponseDTO(likedPost.post, likedPost.author);
    }

    @Delete(':id/like')
    async deleteLike(
        @Param('id') postId: string,
        @Req() req: AuthenticatedRequest
    ) {
        const userId = req.user.id;

        const unlikedPost = await this.postsService.deleteLike(postId, userId);

        return toPostResponseDTO(unlikedPost.post, unlikedPost.author);
    }
}
