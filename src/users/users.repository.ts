import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm/browser';
import User from "./entities/user.entity.js";
import UserListQueryDto from "./dtos/user-list-query.dto.js";

@Injectable()
export class UsersRepository extends Repository<User> {
    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async findWithFirstPostsAndLikes(query: UserListQueryDto): Promise<User[] | null> {
        const baseQuery = `
            SELECT *
            FROM users u
            LEFT JOIN posts p ON p.authorId = u.id = (
                SELECT *
                FROM posts p1
                ORDER BY p1.createdOn ASC
                LIMIT 1
            )
            LEFT JOIN post_likes pl ON pl.postId = p.id
        `;
    }
}
