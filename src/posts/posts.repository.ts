import path from 'path';
import { Injectable } from '@nestjs/common';
import { readJsonFile, writeJsonFile } from '../utils/json-file.js';
import Post, { type PostProps } from './post.entity.js';
import type { UpdatePostDto } from './dtos/update-post.dto.js';

@Injectable()
export class PostsRepository {
    private static readonly POSTS_DATA_PATH = path.join(
        process.cwd(),
        'data/posts.json'
    );

    constructor() {}

    async findById(id: string) {
        const posts = await this.getAll();

        return posts.find((post) => post.id === id) ?? null;
    }

    async findAllByAuthorId(authorId: string) {
        const posts = await this.getAll();

        return posts.filter((post) => post.authorId === authorId);
    }

    async getAll() {
        const posts = await readJsonFile<PostProps>(
            PostsRepository.POSTS_DATA_PATH
        );

        return posts.map((post) => new Post(post));
    }

    async save(post: Post) {
        const posts = await this.getAll();

        posts.push(post);
        await this.saveAll(posts);

        return post;
    }

    async saveAll(posts: Post[]) {
        await writeJsonFile(PostsRepository.POSTS_DATA_PATH, posts);
    }

    async updateById(id: string, updateData: UpdatePostDto) {
        const posts = await this.getAll();
        const index = posts.findIndex((post) => post.id === id);

        if (index === -1) {
            return null;
        }

        const current = posts[index].toJSON();
        const definedUpdates = Object.fromEntries(
            Object.entries(updateData).filter(
                ([, value]) => value !== undefined
            )
        );
        const updatedPost = new Post({
            ...current,
            ...definedUpdates,
            id: current.id,
            authorId: current.authorId,
        });

        posts[index] = updatedPost;
        await this.saveAll(posts);

        return updatedPost;
    }

    async deleteById(id: string) {
        const posts = await this.getAll();
        const index = posts.findIndex((post) => post.id === id);

        if (index === -1) {
            return null;
        }

        const [deletedPost] = posts.splice(index, 1);

        await this.saveAll(posts);

        return deletedPost;
    }
}
