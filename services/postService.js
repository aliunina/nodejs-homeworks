import * as postRepository from '../repositories/postRepository.js';
import Post from '../models/Post.js';
import AppError from '../utils/AppError.js';

export async function createPost(createData, userId) {
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

    return await postRepository.deleteById(postId);
}

export async function updatePost(postId, userId, updateData) {
    const post = await postRepository.findById(postId);

    if (!post) {
        throw new AppError('Post not found', 404);
    }

    if (post.authorId !== userId) {
        throw new AppError('Post is not authored by the user', 403);
    }

    return await postRepository.updateById(postId, updateData);
}
