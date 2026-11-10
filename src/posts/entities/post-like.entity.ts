import {
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    type Relation,
} from 'typeorm';
import Post from "./post.entity.js";
import User from "../../users/entities/user.entity.js";

@Entity('post_likes')
export default class PostLike {
    @PrimaryColumn({ type: 'varchar', length: 36 })
    postId: string;

    @PrimaryColumn({ type: 'varchar', length: 36 })
    userId: string;

    @ManyToOne(() => Post, (post) => post.likes)
    @JoinColumn({ name: 'postId' })
    post: Relation<Post>;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: Relation<User>;
}
