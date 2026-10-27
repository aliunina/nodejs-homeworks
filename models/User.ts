import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

export interface UserProps {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

type CreateUserParams = Omit<UserProps, 'id'>;

export class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;

    static saltRounds = 10;

    constructor(props: UserProps) {
        this.id = props.id;
        this.firstName = props.firstName;
        this.lastName = props.lastName;
        this.email = props.email;
        this.password = props.password;
    }

    static async create(params: CreateUserParams): Promise<User> {
        const hashedPassword = await bcrypt.hash(
            params.password,
            User.saltRounds
        );

        return new User({
            id: uuid(),
            firstName: params.firstName,
            lastName: params.lastName,
            email: params.email,
            password: hashedPassword,
        });
    }

    async comparePassword(plainPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, this.password);
    }

    toJSON(): Omit<UserProps, 'password'> {
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
        };
    }

    toPersistence(): UserProps {
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            password: this.password,
        };
    }
}

export default User;
