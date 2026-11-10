import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    type Relation,
    RelationId,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { PostLike } from './post-like.entity.js';

@Entity('posts')
export default class Post {
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

    @CreateDateColumn({ type: 'timestamp', precision: 3 })
    createdOn: Date;

    @ManyToOne(() => User, (user) => user.posts, { nullable: false })
    @JoinColumn({ name: 'authorId' })
    author: Relation<User>;

    @RelationId((post: Post) => post.author)
    authorId: string;

    @OneToMany(() => PostLike, (like) => like.post, { onDelete: 'CASCADE' })
    likes: Relation<PostLike[]>;

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
