import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

export default class User {
    static saltRounds = 10;

    constructor({ id, firstName, lastName, email, password }) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }

    static async create({ firstName, lastName, email, password }) {
        const hashedPassword = await bcrypt.hash(password, User.saltRounds);

        return new User({
            id: uuid(),
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });
    }

    async comparePassword(plainPassword) {
        return bcrypt.compare(plainPassword, this.password);
    }

    toJSON() {
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            password: this.password,
        };
    }
}
