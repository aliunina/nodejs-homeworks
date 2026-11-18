import {
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PostsRepository, Status } from './posts.repository.js';
import type { CreatePostDto } from './dtos/create-post.dto.js';
import type { UpdatePostDto } from './dtos/update-post.dto.js';
import Post from './post.entity.js';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class PostsService {
    constructor(
        private readonly postsRepository: PostsRepository,
        private readonly usersService: UsersService
    ) {}

    async createPost(createData: CreatePostDto, userId: string) {
        const author = await this.usersService.findUserById(userId);

        if (!author) {
            throw new NotFoundException('User not found');
        }

        const newPost = Post.create({
            ...createData,
            authorId: userId,
        });
        const savedPost = await this.postsRepository.save(newPost);

        return {
            post: savedPost,
            author,
        };
    }

    async findAllPostsByAuthorId(authorId: string) {
        const author = await this.usersService.findUserById(authorId);

        if (!author) {
            throw new NotFoundException('User not found');
        }

        const posts = await this.postsRepository.findAllByAuthorId(authorId);

        return {
            posts,
            author,
        };
    }

    async deletePost(postId: string, userId: string) {
        const post = await this.postsRepository.findById(postId);

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        if (post.authorId !== userId) {
            throw new ForbiddenException('Post is not authored by the user');
        }

        return await this.postsRepository.deleteById(postId);
    }

    async updatePost(
        postId: string,
        userId: string,
        updateData: UpdatePostDto
    ) {
        const author = await this.usersService.findUserById(userId);

        if (!author) {
            throw new NotFoundException('User not found');
        }

        const post = await this.postsRepository.findById(postId);

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        if (post.authorId !== userId) {
            throw new ForbiddenException('Post is not authored by the user');
        }

        const updatedPost = await this.postsRepository.updateById(
            postId,
            updateData
        );

        if (!updatedPost) {
            throw new NotFoundException('Post not found');
        }

        return {
            post: updatedPost,
            author,
        };
    }

    async addLike(postId: string, userId: string) {
        const user = await this.usersService.findUserById(userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const updatedPost = await this.postsRepository.addLikeById(
            postId,
            userId
        );

        if (updatedPost.status === Status.NOT_FOUND) {
            throw new NotFoundException('Post not found');
        }

        if (updatedPost.status === Status.ALREADY_LIKED) {
            throw new ConflictException('Already liked');
        }

        const author = await this.usersService.findUserById(
            updatedPost.post.authorId
        );

        if (!author) {
            throw new NotFoundException('Post author not found');
        }

        return {
            post: updatedPost.post,
            author,
        };
    }

    async deleteLike(postId: string, userId: string) {
        const user = await this.usersService.findUserById(userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const post = await this.postsRepository.findById(postId);

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        if (!post.likedBy.includes(userId)) {
            throw new NotFoundException('Like for this post not found');
        }

        const updatedPost = await this.postsRepository.deleteLikeById(
            postId,
            userId
        );

        if (!updatedPost) {
            throw new NotFoundException('Post not found');
        }

        const author = await this.usersService.findUserById(
            updatedPost.authorId
        );

        if (!author) {
            throw new NotFoundException('Post author not found');
        }

        return {
            post: updatedPost,
            author,
        };
    }
}
