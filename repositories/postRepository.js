import path from 'path';
import Post from '../models/Post.js';
import { readJsonFile, writeJsonFile } from '../utils/jsonFile.js';

const POSTS_DATA_PATH = path.join(process.cwd(), 'data/posts.json');

export async function findById(id) {
    const posts = await getAll();

    return posts.find((post) => post.id === id) ?? null;
}

export async function findAllByAuthorId(authorId) {
    const allPosts = await getAll();
    const posts = allPosts.filter((post) => post.authorId === authorId);

    return posts;
}

export async function getAll() {
    const posts = await readJsonFile(POSTS_DATA_PATH);

    return posts.map((post) => new Post(post));
}

export async function save(post) {
    const posts = await getAll();

    posts.push(post);
    await saveAll(posts);

    return post;
}

export async function saveAll(posts) {
    await writeJsonFile(POSTS_DATA_PATH, posts);
}

export async function updateById(id, updateData) {
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

export async function deleteById(id) {
    const posts = await getAll();

    const index = posts.findIndex((post) => post.id === id);

    if (index === -1) {
        return null;
    }

    const [deletedPost] = posts.splice(index, 1);

    await saveAll(posts);

    return deletedPost;
}
