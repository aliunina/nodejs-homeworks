import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../users/user2.entity.js';
import { Post } from './post2.entity.js';

@Entity('post_likes')
export class PostLike {
    @PrimaryColumn({ type: 'varchar', length: 36 })
    postId: string;

    @PrimaryColumn({ type: 'varchar', length: 36 })
    userId: string;

    @ManyToOne(() => Post, (post) => post.likes)
    @JoinColumn({ name: 'postId' })
    post: Post;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;
}
