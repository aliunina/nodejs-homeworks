import type Post from '../entities/post.entity.js';

export class PostResponseDto {
    id: string;
    title: string;
    description: string;
    createdOn: Date;
    authorName: string;
    likesCount: number;
}

export function toPostResponseDto(post: Post): PostResponseDto {
    return {
        id: post.id,
        title: post.title,
        description: post.description,
        createdOn: post.createdOn,
        authorName: `${post.author.firstName} ${post.author.lastName}`,
        likesCount: post.likes.length,
    };
}
