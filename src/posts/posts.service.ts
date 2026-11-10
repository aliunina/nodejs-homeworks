import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import type { CreatePostDto } from './dtos/create-post.dto.js';
import type { UpdatePostDto } from './dtos/update-post.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Post from './entities/post.entity.js';
import PostLike from './entities/post-like.entity.js';
import PostListQueryDto from './dtos/post-list-query.dto.js';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private readonly postsRepository: Repository<Post>,
        @InjectRepository(PostLike)
        private readonly postLikesRepository: Repository<PostLike>
    ) {}

    async createPost(createData: CreatePostDto, userId: string) {
        const newPost = Post.create({
            ...createData,
            authorId: userId,
        });
        const savedPost = await this.postsRepository.save(newPost);

        return savedPost;
    }

    async findAllPostsByAuthorId(authorId: string, query: PostListQueryDto) {
        const queryBuilder = this.postsRepository
            .createQueryBuilder('post')
            .where('post.authorId = :authorId', { authorId });

        if (query.title) {
            queryBuilder.andWhere('post.title LIKE :title', {
                title: `%${query.title}`,
            });
        }

        queryBuilder
            .orderBy(
                `post.${query.sortBy}`,
                query.order.toUpperCase() as 'ASC' | 'DESC'
            )
            .skip((query.page - 1) * query.limit)
            .take(query.limit);

        const [posts, total] = await queryBuilder.getManyAndCount();

        return {
            data: posts,
            page: query.page,
            limit: query.limit,
            total,
        };
    }

    async deletePost(postId: string, userId: string) {
        const post = await this.postsRepository.findOneBy({ id: postId });

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        if (post.authorId !== userId) {
            throw new ForbiddenException('Post is not authored by the user');
        }

        return await this.postsRepository.delete({ id: postId });
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

        const post = await this.postsRepository.findOneBy({
            id: postId,
        });

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        if (post.authorId !== userId) {
            throw new ForbiddenException('Post is not authored by the user');
        }

        await this.postsRepository.update(postId, updateData);

        const updatedPost = await this.postsRepository.findOneBy({
            id: postId,
        });

        if (!updatedPost) {
            throw new NotFoundException('Post not found');
        }

        return updatedPost;
    }

    async addLike(postId: string, userId: string) {
        const post = await this.postsRepository.findOneBy({
            id: postId,
        });

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        const existingPostLike = await this.postLikesRepository.findOneBy({
            postId,
            userId,
        });

        if (existingPostLike) {
            throw new ConflictException('Already liked');
        }

        const postLike = new PostLike();
        postLike.postId = postId;
        postLike.userId = userId;

        await this.postLikesRepository.save(postLike);

        const updatedPost = await this.postsRepository.findOneBy({
            id: postId,
        });

        if (!updatedPost) {
            throw new NotFoundException('Post not found');
        }

        return updatedPost;
    }

    async deleteLike(postId: string, userId: string) {
        const post = await this.postsRepository.findOneBy({
            id: postId,
        });

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        const existingPostLike = await this.postLikesRepository.findOneBy({
            postId,
            userId,
        });

        if (!existingPostLike) {
            throw new NotFoundException('Like for this post not found');
        }

        await this.postLikesRepository.delete({
            postId,
            userId,
        });

        const updatedPost = await this.postsRepository.findOneBy({
            id: postId,
        });

        if (!updatedPost) {
            throw new NotFoundException('Post not found');
        }

        return updatedPost;
    }
}
