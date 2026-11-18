export type UserWithFirstPostRow = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    postId: string | null;
    postTitle: string | null;
    postCreatedOn: Date | string | null;
    likesCount: number | string | null;
};

export class UserListResponseDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    firstPost: {
        id: string;
        title: string;
        createdOn: Date;
        likesCount: number;
    } | null;
}

export function toUserListResponseDto(
    row: UserWithFirstPostRow
): UserListResponseDto {
    let firstPost: UserListResponseDto['firstPost'] = null;

    if (row.postId) {
        firstPost = {
            id: row.postId,
            title: row.postTitle ?? '',
            createdOn: new Date(row.postCreatedOn ?? ''),
            likesCount: Number(row.likesCount ?? 0),
        };
    }

    return {
        id: row.id,
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email,
        firstPost,
    };
}
