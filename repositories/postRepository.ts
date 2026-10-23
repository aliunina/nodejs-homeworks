import path from 'path';
import { Post, PostProps } from '../models/Post.js';
import { readJsonFile, writeJsonFile } from '../utils/jsonFile.js';

const POSTS_DATA_PATH = path.join(process.cwd(), 'data/posts.json');

export async function findById(id: string) {
    const posts = await getAll();

    return posts.find((post) => post.id === id) ?? null;
}

export async function findAllByAuthorId(authorId: string) {
    const posts = await getAll();

    return posts.filter((post) => post.authorId === authorId);
}

export async function getAll() {
    const posts = await readJsonFile<PostProps>(POSTS_DATA_PATH);

    return posts.map((post) => new Post(post));
}

export async function save(post: Post) {
    const posts = await getAll();

    posts.push(post);
    await saveAll(posts);

    return post;
}

export async function saveAll(posts: Post[]) {
    await writeJsonFile(POSTS_DATA_PATH, posts);
}

export async function updateById(id: string, updateData: Partial<PostProps>) {
    const posts = await getAll();
    const index = posts.findIndex((post) => post.id === id);

    if (index === -1) {
        return null;
    }

    const current = posts[index].toJSON();
    const definedUpdates = Object.fromEntries(
        Object.entries(updateData).filter(([, value]) => value !== undefined)
    );
    const updatedPost = new Post({
        ...current,
        ...definedUpdates,
        id: current.id,
        authorId: current.authorId,
    });

    posts[index] = updatedPost;
    await saveAll(posts);

    return updatedPost;
}

export async function deleteById(id: string) {
    const posts = await getAll();
    const index = posts.findIndex((post) => post.id === id);

    if (index === -1) {
        return null;
    }

    const [deletedPost] = posts.splice(index, 1);

    await saveAll(posts);

    return deletedPost;
}
