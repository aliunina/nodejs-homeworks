import type { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1794174050124 implements MigrationInterface {
    name = 'InitSchema1794174050124';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`users\` (
                \`id\` varchar(36) NOT NULL,
                \`firstName\` varchar(50) NOT NULL,
                \`lastName\` varchar(50) NOT NULL,
                \`email\` varchar(254) NOT NULL,
                \`password\` varchar(60) NOT NULL,
                UNIQUE INDEX \`UQ_users_email\` (\`email\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);

        await queryRunner.query(`
            CREATE TABLE \`posts\` (
                \`id\` varchar(36) NOT NULL,
                \`title\` varchar(254) NOT NULL,
                \`description\` varchar(5000) NULL,
                \`createdOn\` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                \`authorId\` varchar(36) NOT NULL,
                PRIMARY KEY (\`id\`),
                INDEX \`IDX_posts_authorId\` (\`authorId\`),
                CONSTRAINT \`FK_posts_author\` FOREIGN KEY (\`authorId\`) REFERENCES \`users\` (\`id\`)
            ) ENGINE=InnoDB
        `);

        await queryRunner.query(`
            CREATE TABLE \`post_likes\` (
                \`postId\` varchar(36) NOT NULL,
                \`userId\` varchar(36) NOT NULL,
                PRIMARY KEY (\`postId\`, \`userId\`),
                INDEX \`IDX_post_likes_userId\` (\`userId\`),
                CONSTRAINT \`FK_post_likes_post\` FOREIGN KEY (\`postId\`) REFERENCES \`posts\` (\`id\`),
                CONSTRAINT \`FK_post_likes_user\` FOREIGN KEY (\`userId\`) REFERENCES \`users\` (\`id\`)
            ) ENGINE=InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE `post_likes`');
        await queryRunner.query('DROP TABLE `posts`');
        await queryRunner.query('DROP TABLE `users`');
    }
}
