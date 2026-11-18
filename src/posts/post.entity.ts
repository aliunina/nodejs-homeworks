import { v4 as uuid } from 'uuid';

export interface PostProps {
    id: string;
    title: string;
    description: string;
    createdOn: Date;
    authorId: string;
    likedBy: string[];
}

type CreatePostParams = Omit<PostProps, 'id' | 'createdOn' | 'likedBy'>;

export class Post {
    id: string;
    title: string;
    description: string;
    createdOn: Date;
    authorId: string;
    likedBy: string[];

    constructor(props: PostProps) {
        this.id = props.id;
        this.title = props.title;
        this.description = props.description;
        this.createdOn = new Date(props.createdOn);
        this.authorId = props.authorId;
        this.likedBy = props.likedBy;
    }

    static create(params: CreatePostParams): Post {
        return new Post({
            id: uuid(),
            title: params.title,
            description: params.description,
            createdOn: new Date(),
            authorId: params.authorId,
            likedBy: [],
        });
    }

    toJSON(): PostProps {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            createdOn: this.createdOn,
            authorId: this.authorId,
            likedBy: this.likedBy,
        };
    }
}

export default Post;
