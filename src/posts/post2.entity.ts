import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    RelationId,
} from 'typeorm';
import { User } from '../users/user2.entity.js';
import { PostLike } from './post-like.entity.js';

@Entity('posts')
export class Post {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        length: 254,
    })
    title: string;

    @Column({
        type: 'varchar',
        length: 5000,
        nullable: true,
    })
    description: string;

    @CreateDateColumn()
    createdOn: Date;

    @ManyToOne(() => User, (user) => user.posts)
    @JoinColumn({ name: 'authorId' })
    @Column({ nullable: false })
    author: User;

    @RelationId((post: Post) => post.author)
    authorId: string;

    @OneToMany(() => PostLike, (like) => like.post, { onDelete: 'CASCADE' })
    likes: PostLike[];

    static create(params: {
        title: string;
        description: string;
        authorId: string;
    }): Post {
        const post = new Post();
        post.title = params.title;
        post.description = params.description;
        post.authorId = params.authorId;
        return post;
    }
}
