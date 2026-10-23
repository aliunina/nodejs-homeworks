import * as postRepository from '../repositories/postRepository.js';
import * as userRepository from '../repositories/userRepository.js';
import Post from '../models/Post.js';
import AppError from '../utils/AppError.js';

export async function createPost(
    createData: {
        title: string;
        description: string;
    },
    userId: string
) {
    if (!createData.title || !createData.description || !userId) {
        throw new AppError('Missing required fields', 400);
    }

    const user = await userRepository.findById(userId);

    if (!user) {
        throw new AppError('User not found', 404);
    }

    const newPost = Post.create({
        ...createData,
        authorId: userId,
    });
    const savedPost = await postRepository.save(newPost);

    return savedPost;
}

export async function findAllPostsByAuthorId(authorId: string) {
    const user = await userRepository.findById(authorId);

    if (!user) {
        throw new AppError('User not found', 404);
    }

    const posts = await postRepository.findAllByAuthorId(authorId);

    return { posts, author: user };
}

export async function deletePost(postId: string, userId: string) {
    const post = await postRepository.findById(postId);

    if (!post) {
        throw new AppError('Post not found', 404);
    }

    if (post.authorId !== userId) {
        throw new AppError('Post is not authored by the user', 403);
    }

    const deletedPost = await postRepository.deleteById(postId);

    if (!deletedPost) {
        throw new AppError('Post not found', 404);
    }

    return deletedPost;
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

    const user = await userRepository.findById(userId);

    if (!user) {
        throw new AppError('User not found', 404);
    }

    return updatedPost;
}
