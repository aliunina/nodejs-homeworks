import Post from '../models/Post.js';
import User from '../models/User.js';
import PostResponseDTO from '../dtos/PostResponseDTO.js';

export function toPostResponseDTO(post: Post, author: User): PostResponseDTO {
    return {
        id: post.id,
        title: post.title,
        description: post.description,
        createdOn: post.createdOn,
        authorName: `${author.firstName} ${author.lastName}`,
    };
}
