import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    type Relation,
} from 'typeorm';
import Post from '../../posts/entities/post.entity.js';
import bcrypt from 'bcrypt';

@Entity('users')
export default class User {
    private static saltRounds = 10;

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        length: 50,
    })
    firstName: string;

    @Column({
        type: 'varchar',
        length: 50,
    })
    lastName: string;

    @Column({
        type: 'varchar',
        length: 254,
        unique: true,
    })
    email: string;

    @Column({
        type: 'varchar',
        length: 60,
        select: false,
    })
    password: string;

    @OneToMany(() => Post, (post) => post.author)
    posts: Relation<Post[]>;

    static async create(params: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
    }): Promise<User> {
        const user = new User();

        user.firstName = params.firstName;
        user.lastName = params.lastName;
        user.email = params.email;

        user.password = await bcrypt.hash(params.password, User.saltRounds);

        return user;
    }

    async comparePassword(plainPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, this.password);
    }
}
