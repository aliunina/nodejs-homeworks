import { v4 as uuid } from 'uuid';

export default class Post {
    constructor({ id, title, description, createdOn, authorId }) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.createdOn = createdOn;
        this.authorId = authorId;
    }

    static create({ title, description, authorId }) {
        return new Post({
            id: uuid(),
            title,
            description,
            createdOn: new Date(),
            authorId,
        });
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            createdOn: this.createdOn,
            authorId: this.authorId,
        };
    }
}
