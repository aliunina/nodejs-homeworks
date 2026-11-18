import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import User from './entities/user.entity.js';
import UserListQueryDto from './dtos/user-list-query.dto.js';
import {
    toUserListResponseDto,
    type UserListResponseDto,
    type UserWithFirstPostRow,
} from './dtos/user-list-response.dto.js';

@Injectable()
export class UsersRepository extends Repository<User> {
    constructor(@InjectDataSource() private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async findWithFirstPostsAndLikes(query: UserListQueryDto): Promise<{
        data: UserListResponseDto[];
        page: number;
        limit: number;
        total: number;
    }> {
        const conditions: string[] = [];
        const parameters: string[] = [];

        if (query.firstName) {
            conditions.push('u.firstName LIKE ?');
            parameters.push(`%${query.firstName}%`);
        }

        if (query.lastName) {
            conditions.push('u.lastName LIKE ?');
            parameters.push(`%${query.lastName}%`);
        }

        if (query.email) {
            conditions.push('u.email = ?');
            parameters.push(query.email);
        }

        const whereClause =
            conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        const sortColumns = {
            firstName: 'u.firstName',
            lastName: 'u.lastName',
            email: 'u.email',
        } as const;
        const direction = query.order === 'desc' ? 'DESC' : 'ASC';

        const sqlQuery = `
            SELECT
                u.id,
                u.firstName,
                u.lastName,
                u.email,
                p.id AS postId,
                p.title AS postTitle,
                p.createdOn AS postCreatedOn,
                (
                    SELECT COUNT(*)
                    FROM post_likes pl
                    WHERE pl.postId = p.id
                ) AS likesCount
            FROM users u
            LEFT JOIN posts p ON p.id = (
                SELECT p2.id
                FROM posts p2
                WHERE p2.authorId = u.id
                ORDER BY p2.createdOn ASC, p2.id ASC
                LIMIT 1
            )
            ${whereClause}
            ORDER BY ${sortColumns[query.sortBy]} ${direction}, u.id ASC
            LIMIT ? OFFSET ?
        `;

        const rows = await this.dataSource.query<UserWithFirstPostRow[]>(
            sqlQuery,
            [...parameters, query.limit, (query.page - 1) * query.limit]
        );
        const countRows = await this.dataSource.query<{ total: string }[]>(
            `SELECT COUNT(*) AS total FROM users u ${whereClause}`,
            parameters
        );

        return {
            data: rows.map(toUserListResponseDto),
            page: query.page,
            limit: query.limit,
            total: Number(countRows[0]?.total ?? 0),
        };
    }
}
