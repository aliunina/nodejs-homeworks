import { v4 as uuid } from 'uuid';

export interface PostProps {
    id: string;
    title: string;
    description: string;
    createdOn: Date;
    authorId: string;
}

type CreatePostParams = Omit<PostProps, 'id' | 'createdOn'>;

export class Post {
    id: string;
    title: string;
    description: string;
    createdOn: Date;
    authorId: string;

    constructor(props: PostProps) {
        this.id = props.id;
        this.title = props.title;
        this.description = props.description;
        this.createdOn = new Date(props.createdOn);
        this.authorId = props.authorId;
    }

    static create(params: CreatePostParams): Post {
        return new Post({
            id: uuid(),
            title: params.title,
            description: params.description,
            createdOn: new Date(),
            authorId: params.authorId,
        });
    }

    toJSON(): PostProps {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            createdOn: this.createdOn,
            authorId: this.authorId,
        };
    }
}

export default Post;
