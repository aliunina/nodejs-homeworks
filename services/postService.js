import * as postRepository from '../repositories/postRepository.js';
import * as userRepository from '../repositories/userRepository.js';
import Post from '../models/Post.js';
import AppError from '../utils/AppError.js';

export async function createPost(createData, userId) {
    if (!createData.title || !createData.description || !userId) {
        throw new AppError('Missing required fields', 400);
    }

    const user = await userRepository.findById(userId);

    if (!user) {
        throw new AppError('User not found', 404);
    }

    const newPost = Post.create({
        title: createData.title,
        description: createData.description,
        authorId: userId,
    });

    return postRepository.save(newPost);
}

export async function findAllPostsByAuthorId(authorId) {
    return postRepository.findAllByAuthorId(authorId);
}

export async function deletePost(postId, userId) {
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

export async function updatePost(postId, userId, updateData) {
    const post = await postRepository.findById(postId);

    if (!post) {
        throw new AppError('Post not found', 404);
    }

    if (post.authorId !== userId) {
        throw new AppError('Post is not authored by the user', 403);
    }

    const updatedPost = await postRepository.updateById(postId, {
        title: updateData.title,
        description: updateData.description,
    });

    if (!updatedPost) {
        throw new AppError('Post not found', 404);
    }

    return updatedPost;
}
