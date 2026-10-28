export function toPostResponseDTO(post, author) {
    return {
        id: post.id,
        title: post.title,
        description: post.description,
        createdOn: post.createdOn,
        authorName: `${author.firstName} ${author.lastName}`,
    };
}
