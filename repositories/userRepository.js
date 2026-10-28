import path from 'path';
import User from '../models/User.js';
import { readJsonFile, writeJsonFile } from '../utils/jsonFile.js';

const USERS_DATA_PATH = path.join(process.cwd(), 'data/users.json');

export async function findByEmail(email) {
    const users = await getAll();

    return users.find((user) => user.email === email) ?? null;
}

export async function findById(id) {
    const users = await getAll();

    return users.find((user) => user.id === id) ?? null;
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
    await writeJsonFile(
        USERS_DATA_PATH,
        users.map((user) => user.toPersistence())
    );
}

export async function updateById(id, updateData) {
    const users = await getAll();
    const index = users.findIndex((user) => user.id === id);

    if (index === -1) {
        return null;
    }

    const current = users[index].toPersistence();
    const definedUpdates = Object.fromEntries(
        Object.entries(updateData).filter(([, value]) => value !== undefined)
    );
    const updatedUser = new User({
        ...current,
        ...definedUpdates,
        id: current.id,
    });

    users[index] = updatedUser;

    await saveAll(users);

    return updatedUser;
}
