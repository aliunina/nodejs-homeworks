import path from 'path';
import User from '../models/User.js';
import { readJsonFile, writeJsonFile } from '../utils/jsonFile.js';

const USERS_DATA_PATH = path.join(process.cwd(), 'data/users.json');

export async function findByEmail(email) {
    const users = await getAll();
    const user = users.find((user) => user.email === email) || null;
    const result = user ? new User(user) : null;

    return result;
}

export async function findById(id) {
    const users = await getAll();
    const user = users.find((user) => user.id === id) || null;
    const result = user ? new User(user) : null;

    return result;
}

export async function getAll() {
    const users = await readJsonFile(USERS_DATA_PATH);

    return users.map((user) => new User(user));
}

export async function save(user) {
    const users = await getAll();

    users.push(user);
    await saveAll(users);

    return user;
}

export async function saveAll(users) {
    await writeJsonFile(USERS_DATA_PATH, users);
}

export async function updateById(id, updateData) {
    const users = await getAll();
    const index = users.findIndex((user) => user.id === id);

    if (index === -1) {
        return null;
    }

    const updatedUser = {
        ...users[index],
        ...updateData,
        id,
    };

    users[index] = updatedUser;

    await saveAll(users);

    return new User(updatedUser);
}
