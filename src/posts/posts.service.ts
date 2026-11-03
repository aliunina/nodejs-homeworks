import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PostsRepository } from './posts.repository.js';
import type { CreatePostDto } from './dtos/create-post.dto.js';
import type { UpdatePostDto } from './dtos/update-post.dto.js';
import Post from './post.entity.js';

@Injectable()
export class PostsService {
    constructor(private readonly postsRepository: PostsRepository) {}

    async createPost(createData: CreatePostDto, userId: string) {
        const newPost = Post.create({
            ...createData,
            authorId: userId,
        });
        const savedPost = await this.postsRepository.save(newPost);

        return savedPost;
    }

    async findAllPostsByAuthorId(authorId: string) {
        return this.postsRepository.findAllByAuthorId(authorId);
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
        const hasUpdate = Object.values(updateData).some(
            (value) => value !== undefined
        );

        if (!hasUpdate) {
            throw new BadRequestException('Request body can not be empty');
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

        return updatedPost;
    }

    async addLike(postId: string, userId: string) {
        const post = await this.postsRepository.findById(postId);

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        if (post.likedBy.includes(userId)) {
            throw new ConflictException('Already liked');
        }

        const updatedPost = await this.postsRepository.addLikeById(
            postId,
            userId
        );

        if (!updatedPost) {
            throw new NotFoundException('Post not found');
        }

        return updatedPost;
    }

    async deleteLike(postId: string, userId: string) {
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

        return updatedPost;
    }
}
