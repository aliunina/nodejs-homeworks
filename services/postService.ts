import * as postRepository from '../repositories/postRepository.js';
import Post from '../models/Post.js';
import AppError from '../utils/AppError.js';

export async function createPost(
    createData: {
        title: string;
        description: string;
    },
    userId: string
) {
    const newPost = Post.create({
        ...createData,
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
    updateData: {
        title?: string;
        description?: string;
    }
) {
    const post = await postRepository.findById(postId);

    if (!post) {
        throw new AppError('Post not found', 404);
    }

    if (post.authorId !== userId) {
        throw new AppError('Post is not authored by the user', 403);
    }

    const updatedPost = await postRepository.updateById(postId, updateData);

    if (!updatedPost) {
        throw new AppError('Post not found', 404);
    }

    return updatedPost;
}
