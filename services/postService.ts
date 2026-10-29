import * as postRepository from '../repositories/postRepository.js';
import Post from '../models/Post.js';
import AppError from '../utils/AppError.js';
import { CreatePostInput, UpdatePostInput } from '../schemas/postSchema.js';

export async function createPost(createInput: CreatePostInput, userId: string) {
    const newPost = Post.create({
        ...createInput,
        authorId: userId,
    });
    const savedPost = await postRepository.save(newPost);

    return savedPost;
}

export async function findAllPostsByAuthorId(authorId: string) {
    return postRepository.findAllByAuthorId(authorId);
}

export async function deletePost(postId: string, userId: string) {
    const post = await postRepository.findById(postId);

    if (!post) {
        throw new AppError('Post not found', 404);
    }

    if (post.authorId !== userId) {
        throw new AppError('Post is not authored by the user', 403);
    }

    return await postRepository.deleteById(postId);
}

export async function updatePost(
    postId: string,
    userId: string,
    updateInput: UpdatePostInput
) {
    const post = await postRepository.findById(postId);

    if (!post) {
        throw new AppError('Post not found', 404);
    }

    if (post.authorId !== userId) {
        throw new AppError('Post is not authored by the user', 403);
    }

    const updatedPost = await postRepository.updateById(postId, updateInput);

    if (!updatedPost) {
        throw new AppError('Post not found', 404);
    }

    return updatedPost;
}
