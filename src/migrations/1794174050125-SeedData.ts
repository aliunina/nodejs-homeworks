import bcrypt from 'bcrypt';
import type { MigrationInterface, QueryRunner } from 'typeorm';

const passwordHash = bcrypt.hashSync('password123', 10);

const users = [
    {
        id: '11111111-1111-4111-8111-111111111111',
        firstName: 'Anna',
        lastName: 'Ivanova',
        email: 'anna@example.com',
    },
    {
        id: '11111111-1111-4111-8111-222222222222',
        firstName: 'Ivan',
        lastName: 'Petrov',
        email: 'ivan@example.com',
    },
    {
        id: '11111111-1111-4111-8111-333333333333',
        firstName: 'Elena',
        lastName: 'Sidorova',
        email: 'elena@example.com',
    },
    {
        id: '11111111-1111-4111-8111-444444444444',
        firstName: 'Dmitry',
        lastName: 'Kuznetsov',
        email: 'dmitry@example.com',
    },
    {
        id: '11111111-1111-4111-8111-555555555555',
        firstName: 'Olga',
        lastName: 'Smirnova',
        email: 'olga@example.com',
    },
    {
        id: '11111111-1111-4111-8111-666666666666',
        firstName: 'Alexey',
        lastName: 'Popov',
        email: 'alexey@example.com',
    },
    {
        id: '11111111-1111-4111-8111-777777777777',
        firstName: 'Maria',
        lastName: 'Vasylieva',
        email: 'maria@example.com',
    },
    {
        id: '11111111-1111-4111-8111-888888888888',
        firstName: 'Sergey',
        lastName: 'Sokolov',
        email: 'sergey@example.com',
    },
    {
        id: '11111111-1111-4111-8111-999999999999',
        firstName: 'Natalia',
        lastName: 'Mikhailova',
        email: 'natalia@example.com',
    },
    {
        id: '11111111-1111-4111-8111-000000000000',
        firstName: 'Artem',
        lastName: 'Fedorov',
        email: 'artem@example.com',
    },
];

const posts = [
    {
        id: '22222222-2222-4222-8222-222222222221',
        title: 'First',
        description: 'Earliest post',
        createdOn: '2026-01-01 10:00:00',
        authorId: users[0].id,
    },
    {
        id: '22222222-2222-4222-8222-222222222222',
        title: 'Second',
        description: 'Later post',
        createdOn: '2026-02-01 10:00:00',
        authorId: users[0].id,
    },
    {
        id: '22222222-2222-4222-8222-222222222223',
        title: 'Tech Trends',
        description: 'Discussion about JavaScript frameworks',
        createdOn: '2026-03-05 14:20:00',
        authorId: users[1].id,
    },
    {
        id: '22222222-2222-4222-8222-222222222224',
        title: 'Travel Diary',
        description: 'My trip to the mountains',
        createdOn: '2026-04-12 09:15:00',
        authorId: users[2].id,
    },
    {
        id: '22222222-2222-4222-8222-222222222225',
        title: 'Healthy Food',
        description: 'Top 5 recipes for breakfast',
        createdOn: '2026-05-20 18:45:00',
        authorId: users[3].id,
    },
    {
        id: '22222222-2222-4222-8222-222222222226',
        title: 'Book Review',
        description: 'Why you should read sci-fi',
        createdOn: '2026-06-02 11:30:00',
        authorId: users[4].id,
    },
    {
        id: '22222222-2222-4222-8222-222222222227',
        title: 'Photography Guide',
        description: 'How to capture golden hour',
        createdOn: '2026-07-19 20:10:00',
        authorId: users[5].id,
    },
    {
        id: '22222222-2222-4222-8222-222222222228',
        title: 'Fitness Routine',
        description: 'Daily home workouts for beginners',
        createdOn: '2026-08-24 07:00:00',
        authorId: users[6].id,
    },
    {
        id: '22222222-2222-4222-8222-222222222229',
        title: 'Movie Insights',
        description: 'Analysis of the latest cinema releases',
        createdOn: '2026-09-15 22:05:00',
        authorId: users[7].id,
    },
    {
        id: '22222222-2222-4222-8222-222222222230',
        title: 'Financial Freedom',
        description: 'Introduction to smart investing',
        createdOn: '2026-10-30 13:40:00',
        authorId: users[8].id,
    },
];

const likes = [
    { postId: posts[0].id, userId: users[1].id },
    { postId: posts[0].id, userId: users[2].id },
    { postId: posts[1].id, userId: users[3].id },
    { postId: posts[2].id, userId: users[0].id },
    { postId: posts[2].id, userId: users[4].id },
    { postId: posts[3].id, userId: users[5].id },
    { postId: posts[4].id, userId: users[6].id },
    { postId: posts[5].id, userId: users[7].id },
    { postId: posts[6].id, userId: users[8].id },
    { postId: posts[7].id, userId: users[9].id },
    { postId: posts[8].id, userId: users[1].id },
    { postId: posts[9].id, userId: users[2].id },
];

export class SeedData1794174050125 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        for (const user of users) {
            await queryRunner.query(
                'INSERT INTO users (id, firstName, lastName, email, password) VALUES (?, ?, ?, ?, ?)',
                [
                    user.id,
                    user.firstName,
                    user.lastName,
                    user.email,
                    passwordHash,
                ]
            );
        }

        for (const post of posts) {
            await queryRunner.query(
                'INSERT INTO posts (id, title, description, createdOn, authorId) VALUES (?, ?, ?, ?, ?)',
                [
                    post.id,
                    post.title,
                    post.description,
                    post.createdOn,
                    post.authorId,
                ]
            );
        }

        for (const like of likes) {
            await queryRunner.query(
                'INSERT INTO post_likes (postId, userId) VALUES (?, ?)',
                [like.postId, like.userId]
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const postIds = posts.map((post) => `'${post.id}'`).join(', ');
        const userIds = users.map((user) => `'${user.id}'`).join(', ');

        await queryRunner.query(
            `DELETE FROM \`post_likes\` WHERE \`postId\` IN (${postIds})`
        );
        await queryRunner.query(
            `DELETE FROM \`posts\` WHERE \`id\` IN (${postIds})`
        );
        await queryRunner.query(
            `DELETE FROM \`users\` WHERE \`id\` IN (${userIds})`
        );
    }
}
