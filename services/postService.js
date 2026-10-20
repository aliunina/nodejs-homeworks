import * as postRepository from '../repositories/postRepository.js';
import Post from '../models/Post.js';
import AppError from '../utils/AppError.js';
import { getSanitizedPayload } from '../utils/util.js';

export async function createPost(createData, userId) {
    if (!createData.title || !createData.description || !userId) {
        throw new AppError('Missing required fields', 400);
    }

    const payload = getSanitizedPayload(createData, ['title', 'description']);
    const newPost = Post.create({
        ...payload,
        authorId: userId,
    });

    const result = await postRepository.save(newPost);

    return result;
}

export async function findAllByAuthorId(authorId) {
    const posts = await postRepository.findAllByAuthorId(authorId);

    return posts;
}

export async function deletePost(postId, userId) {
    const post = await postRepository.findById(postId);

    if (!post) {
        throw new AppError('Post not found', 404);
    }

    if (post.authorId !== userId) {
        throw new AppError('Post is not authored by the user', 403);
    }

    await postRepository.deleteById(postId);

    return { message: 'Post has been successfully deleted' };
}

export async function updatePost(postId, userId, updateData) {
    const post = await postRepository.findById(postId);

    if (!post) {
        throw new AppError('Post not found', 404);
    }

    if (post.authorId !== userId) {
        throw new AppError('Post is not authored by the user', 403);
    }

    const payload = getSanitizedPayload(updateData, ['title', 'description']);
    const updatedPost = await postRepository.updateById(postId, payload);

    return updatedPost;
}
