import type User from '../../users/user.entity.js';
import type Post from '../post.entity.js';

export class PostResponseDto {
    id: string;
    title: string;
    description: string;
    createdOn: Date;
    authorName: string;
    likesCount: number;
}

export function toPostResponseDTO(post: Post, author: User): PostResponseDto {
    return {
        id: post.id,
        title: post.title,
        description: post.description,
        createdOn: post.createdOn,
        authorName: `${author.firstName} ${author.lastName}`,
        likesCount: post.likedBy.length,
    };
}
